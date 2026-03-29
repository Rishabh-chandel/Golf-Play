import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../utils/api';
import { format } from 'date-fns';
import { AnimatedCounter } from '../../components/animations/AnimatedCounter';
import { toast } from 'react-hot-toast';
import { Trophy, CheckCircle2, Hourglass } from 'lucide-react';

const MyWinnings = () => {
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinnings = async () => {
      try {
        const response = await api.get('/winners/my');
        if (response.data.success) {
          setWinnings(response.data.data || []);
        }
      } catch (error) {
        toast.error('Failed to fetch winnings');
      } finally {
        setLoading(false);
      }
    };
    fetchWinnings();
  }, []);

  const totalWon = winnings.reduce((acc, curr) => acc + (curr.prizeAmount || 0), 0);
  const approvedWins = winnings.filter((win) => win.verificationStatus === 'approved').length;
  const pendingWins = winnings.filter((win) => win.verificationStatus === 'pending').length;

  return (
    <div className="space-y-8 mt-10">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
         <div>
           <h1 className="text-3xl font-display font-bold text-gold">My Winnings</h1>
           <p className="text-text-secondary mt-2">Prizes you’ve won from the monthly draws.</p>
         </div>
         <div className="text-right">
           <p className="text-sm font-medium text-text-secondary">Lifetime Winnings</p>
           <h2 className="text-4xl font-mono font-bold text-gold">
               <AnimatedCounter prefix="£" value={totalWon} />
           </h2>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-text-secondary">Total prizes</p>
          <p className="text-2xl font-bold mt-2">{winnings.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Approved wins</p>
          <p className="text-2xl font-bold mt-2 text-emerald">{approvedWins}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">Pending review</p>
          <p className="text-2xl font-bold mt-2 text-gold">{pendingWins}</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-display font-bold text-xl border-b border-border pb-4 mb-4">Prize History</h3>
        {loading ? (
          <div className="animate-pulse space-y-4">
             {[1, 2].map((item) => <div key={item} className="h-16 bg-surface-2 rounded-lg" />)}
          </div>
        ) : winnings.length === 0 ? (
          <div className="p-12 text-center text-text-secondary flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-gold text-2xl mb-4">🏆</div>
             <p>You haven’t won just yet. Keep playing and submitting your scores!</p>
          </div>
        ) : (
          <div className="space-y-4">
             {winnings.map((win) => (
               <div key={win._id} className="flex justify-between items-center p-4 bg-surface-2 rounded-xl border border-gold/20 gap-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                     <Trophy size={18} />
                   </div>
                   <div>
                     <h4 className="font-bold">{win.draw?.drawDate ? format(new Date(win.draw.drawDate), 'MMMM yyyy') : 'Latest'} Draw</h4>
                     <p className="text-sm text-text-secondary capitalize">
                       {String(win.matchTier || 'tier').replace('_', ' ')} prize
                     </p>
                   </div>
                 </div>
                 <div className="text-right flex items-center gap-3">
                   <div>
                     <p className="font-bold text-emerald text-lg">£{win.prizeAmount || 0}</p>
                     <p className="text-xs text-text-secondary flex items-center justify-end gap-1">
                       {win.verificationStatus === 'approved' ? <CheckCircle2 size={12} /> : <Hourglass size={12} />}
                       {win.verificationStatus || 'pending'}
                     </p>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MyWinnings;
