import React from 'react';
import { Card } from '../../components/ui/Card';

const AdminCharities = () => {
  return (
    <div className="space-y-8 mt-4">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold">Charity Partners</h1>
        <p className="text-text-secondary mt-2">Manage onboarded charities and automated payouts.</p>
      </header>

      <Card>
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-xl">Active Organizations</h3>
            <button className="px-4 py-2 bg-surface-2 hover:bg-surface-1 border border-border text-sm rounded-lg transition-colors">
               + Add Partner
            </button>
         </div>
         <p className="text-text-secondary mt-4 mb-4">View your integrated non-profits. The system splits sub revenue symmetrically 50% to chosen charity entries.</p>
         
         <div className="p-8 text-center text-text-secondary bg-surface-2 rounded-lg border border-border mt-4">
             List populated by backend charity seeds. Click "Add Partner" to register a new NGO wallet or account.
         </div>
      </Card>
    </div>
  );
};

export default AdminCharities;