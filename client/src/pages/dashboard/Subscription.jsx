import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const Subscription = () => {
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  
  const handleSubscribe = async (tier) => {
    setSessionLoading(true);
    try {
      if (!user.selectedCharity) {
        toast.error("Please select a charity in 'My Charity' before subscribing.");
        return;
      }
      const plan = tier === 'annual' ? 'yearly' : 'monthly';
      const response = await api.post('/subscriptions/create-checkout', { plan });
      // In real scenario, redirect to Stripe
      toast.success("Redirecting to Stripe: " + response.data.data.url);
      window.location.href = response.data.data.url;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create checkout session');
    } finally {
      setSessionLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    try {
      const response = await api.post('/subscriptions/customer-portal');
      window.location.href = response.data.data.url;
    } catch (err) {
      toast.error('Failed to access billing portal');
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = user?.subscriptionStatus === 'active';

  return (
    <div className="space-y-8 mt-10">
      <header className="mb-10">
         <h1 className="text-3xl font-display font-bold">Subscription & Billing</h1>
         <p className="text-text-secondary mt-2">Manage your plan and payment methods.</p>
      </header>

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="font-display font-bold text-xl mb-1">Current Plan</h3>
            {isSubscribed ? (
               <div className="mt-4">
                 <span className="inline-block px-3 py-1 bg-emerald/20 text-emerald rounded-full text-sm font-medium mb-2">
                   Active {user.subscriptionTier}
                 </span>
                 <p className="text-sm text-text-secondary">Your subscription is active and you are eligible for the next draw.</p>
               </div>
            ) : (
               <div className="mt-4">
                 <span className="inline-block px-3 py-1 bg-surface-2 text-text-secondary rounded-full text-sm font-medium mb-2">
                   Free / Unsubscribed
                 </span>
                 <p className="text-sm text-text-secondary">Subscribe to enter monthly draws and support your chosen charity.</p>
               </div>
            )}
          </div>

          <div>
             {isSubscribed ? (
               <Button onClick={handlePortal} disabled={loading} variant="outline">
                 {loading ? 'Loading...' : 'Manage Billing'}
               </Button>
             ) : (
               <div className="flex gap-4">
                 <Button onClick={() => handleSubscribe('monthly')} disabled={sessionLoading}>
                   £10 / Month
                 </Button>
                 <Button onClick={() => handleSubscribe('annual')} disabled={sessionLoading} variant="outline" className="border-gold text-gold hover:bg-gold/10">
                   £100 / Year
                 </Button>
               </div>
             )}
          </div>
        </div>
      </Card>
      
      <Card className="bg-surface-2 border-border">
         <h3 className="font-display font-bold text-lg mb-2">How it works</h3>
         <ul className="list-disc list-inside text-sm text-text-secondary space-y-2 ml-4">
           <li>50% of your subscription goes directly to your selected charity.</li>
           <li>The remaining amount funds the prize pool and platform operations.</li>
           <li>You must submit at least one valid golf score a month to qualify for the draw.</li>
           <li>You can pause or cancel your subscription at any time securely via Stripe.</li>
         </ul>
      </Card>
    </div>
  );
};

export default Subscription;