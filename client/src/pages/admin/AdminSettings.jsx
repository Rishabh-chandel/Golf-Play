import React from 'react';
import { Card } from '../../components/ui/Card';

const AdminSettings = () => {
  return (
    <div className="space-y-8 mt-4">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold">System Settings</h1>
        <p className="text-text-secondary mt-2">Platform-wide configuration and integrations.</p>
      </header>

      <Card>
         <h3 className="font-display font-bold text-xl mb-4">Payment Configuration (Stripe)</h3>
         <div className="space-y-4 max-w-xl">
            <div>
               <label className="block text-sm text-text-secondary">Webhook Secret</label>
               <input disabled value="whsec_.........." className="w-full mt-1 bg-surface-2 border border-border rounded px-3 py-2 text-text-secondary" />
            </div>
            <div>
               <label className="block text-sm text-text-secondary">Monthly Price ID</label>
               <input disabled value="price_monthly..." className="w-full mt-1 bg-surface-2 border border-border rounded px-3 py-2 text-text-secondary" />
            </div>
         </div>
      </Card>
      
      <Card>
         <h3 className="font-display font-bold text-xl mb-4 text-coral">Danger Zone</h3>
         <div className="flex items-center justify-between p-4 border border-coral/30 bg-coral/5 rounded-lg">
             <div className="text-sm">
                <strong className="text-white block">Pause All Subscriptions</strong>
                <span className="text-text-secondary">Halt Stripe billing cycles across the platform instantly.</span>
             </div>
             <button className="px-4 py-2 bg-coral text-white font-bold rounded-lg hover:bg-coral/80 transition-colors">
                 Pause Network
             </button>
         </div>
      </Card>
    </div>
  );
};

export default AdminSettings;