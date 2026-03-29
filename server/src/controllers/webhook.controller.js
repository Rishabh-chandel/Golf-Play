import stripe from '../config/stripe.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id;
        
        if (userId) {
          const subscriptionData = await stripe.subscriptions.retrieve(session.subscription);
          
          let sub = await Subscription.findOne({ user: userId });
          
          if (!sub) {
            sub = new Subscription({ user: userId });
          }

          const amount = session.amount_total; // in pence
          const isYearly = amount > 5000; // rough heuristic

          sub.plan = isYearly ? 'yearly' : 'monthly';
          sub.status = 'active';
          sub.stripeCustomerId = session.customer;
          sub.stripeSubscriptionId = session.subscription;
          sub.currentPeriodStart = new Date(subscriptionData.current_period_start * 1000);
          sub.currentPeriodEnd = new Date(subscriptionData.current_period_end * 1000);
          sub.amount = amount;
          sub.currency = session.currency;
          
          await sub.save();
          
          await User.findByIdAndUpdate(userId, { subscription: sub._id });
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subId = invoice.subscription;
        const sub = await Subscription.findOne({ stripeSubscriptionId: subId });
        
        if (sub) {
          sub.status = 'active';
          sub.history.push({
            event: 'payment_succeeded',
            amount: invoice.amount_paid,
            stripeEventId: event.id
          });
          
          // Contribution calculations happen in a cron job/service, but we record payment success here
          const subscriptionData = await stripe.subscriptions.retrieve(subId);
          sub.currentPeriodStart = new Date(subscriptionData.current_period_start * 1000);
          sub.currentPeriodEnd = new Date(subscriptionData.current_period_end * 1000);
          
          await sub.save();
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const sub = await Subscription.findOne({ stripeSubscriptionId: invoice.subscription });
        if (sub) {
          sub.status = 'past_due';
          sub.history.push({
            event: 'payment_failed',
            amount: invoice.amount_due,
            stripeEventId: event.id
          });
          await sub.save();
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const sub = await Subscription.findOne({ stripeSubscriptionId: subscription.id });
        if (sub) {
          sub.status = 'cancelled';
          await sub.save();
        }
        break;
      }
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Internal Server Error');
  }
};
