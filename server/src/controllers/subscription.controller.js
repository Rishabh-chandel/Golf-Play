import stripe from '../config/stripe.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createCheckout = async (req, res, next) => {
  try {
    const { plan } = req.body;
    
    // Validate plan
    if (!['monthly', 'yearly', 'annual'].includes(plan)) {
      return res.status(400).json(errorResponse('Invalid plan type', 400));
    }
    
    const isMonthly = plan === 'monthly';
    const priceId = isMonthly
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : (process.env.STRIPE_ANNUAL_PRICE_ID || process.env.STRIPE_YEARLY_PRICE_ID);

    if (!priceId) {
      return res.status(500).json(errorResponse('Stripe price ID is not configured', 500));
    }

    const clientUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
      
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: req.user._id.toString(),
      success_url: `${clientUrl}/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/pricing?canceled=true`,
      customer_email: req.user.email,
    });
    
    res.status(200).json(successResponse({ url: session.url }));
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id, status: 'active' });
    
    if (!sub || !sub.stripeSubscriptionId) {
      return res.status(400).json(errorResponse('No active subscription found', 400));
    }
    
    // Update Stripe to cancel at period end
    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true
    });
    
    sub.cancelAtPeriodEnd = true;
    await sub.save();
    
    res.status(200).json(successResponse(null, 'Subscription set to cancel at end of billing period'));
  } catch (error) {
    next(error);
  }
};

export const getStatus = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(successResponse(sub));
  } catch (error) {
    next(error);
  }
};

export const createPortalSession = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id, status: 'active' });
    if (!sub || !sub.stripeCustomerId) {
      return res.status(400).json(errorResponse('No stripe customer found', 400));
    }

    const clientUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${clientUrl}/dashboard/subscription`,
    });
    
    res.status(200).json(successResponse({ url: portalSession.url }));
  } catch (error) {
    next(error);
  }
};
