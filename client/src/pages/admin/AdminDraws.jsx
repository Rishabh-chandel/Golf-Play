import React from 'react';
import { Card } from '../../components/ui/Card';

const AdminDraws = () => {
  return (
    <div className="space-y-8 mt-4">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold">Draw Management</h1>
        <p className="text-text-secondary mt-2">Manage monthly prize draws, trigger algos manually, and verify winners.</p>
      </header>

      <Card>
        <h3 className="font-display font-bold text-xl mb-4">Pending Draws</h3>
        <p className="text-text-secondary">Next scheduled draw is currently gathering eligibility data.</p>
        <div className="mt-6">
           <button className="px-4 py-2 bg-emerald text-obsidian font-bold rounded-lg opacity-50 cursor-not-allowed">
              Execute Draw Mechanism
           </button>
           <p className="text-xs text-text-secondary mt-2">Only available when current pool cycle completes.</p>
        </div>
      </Card>
      
      <Card>
         <h3 className="font-display font-bold text-xl mb-4">Historical Draws</h3>
         <div className="p-8 text-center text-text-secondary bg-surface-2 rounded-lg">
             Historical records of all triggered smart contracts and draws will populate here.
         </div>
      </Card>
    </div>
  );
};

export default AdminDraws;
