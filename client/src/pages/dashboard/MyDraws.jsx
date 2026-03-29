import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../utils/api';
import { format } from 'date-fns';

const MyDraws = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const res = await api.get('/draws/my-results');
        if (res.data.success) {
          const userWins = res.data.data || [];

          if (userWins.length > 0) {
            setDraws(
              userWins.map((win) => ({
                _id: win._id,
                drawDate: win.draw?.drawDate,
                status: win.draw?.status || 'published',
                totalPrizePool: win.draw?.prizePool?.total || win.prizeAmount,
                isWin: true,
                matchTier: win.matchTier,
                prizeAmount: win.prizeAmount,
                draw: win.draw,
              }))
            );
            return;
          }

          const publicDraws = await api.get('/draws/results');
          if (publicDraws.data.success) {
            setDraws((publicDraws.data.data || []).slice(0, 6));
          }
        }
      } catch (err) {
        console.error("Failed to fetch draws");
      } finally {
        setLoading(false);
      }
    };
    fetchDraws();
  }, []);

  return (
    <div className="space-y-8 mt-10">
      <header className="mb-10">
         <h1 className="text-3xl font-display font-bold">My Draws</h1>
         <p className="text-text-secondary mt-2">Your history of drawn events and results.</p>
      </header>

      <Card>
        <h3 className="font-display font-bold text-xl border-b border-border pb-4 mb-4">Past Draws</h3>
        {loading ? (
          <div className="animate-pulse space-y-4">
             {[1, 2, 3].map(i => <div key={i} className="h-20 bg-surface-2 rounded-lg" />)}
          </div>
        ) : draws.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
             No draw history available.
          </div>
        ) : (
          <div className="space-y-4">
            {draws.map(draw => (
              <div key={draw._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface-2 rounded-xl border border-border">
                <div className="mb-2 md:mb-0">
                   <h4 className="font-bold text-lg">{draw.drawDate ? `${format(new Date(draw.drawDate), 'MMMM yyyy')} Draw` : 'Published Draw'}</h4>
                   <p className="text-sm text-text-secondary">
                     Status: <span className="text-emerald capitalize">{draw.status || 'published'}</span>
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-sm">
                     Prize Pool: <span className="text-gold font-bold">£{draw.totalPrizePool || draw.prizePool?.total || 0}</span>
                   </p>
                   <p className="text-xs text-text-secondary mt-1">
                     {draw.isWin ? `Won Tier ${draw.matchTier}` : 'Winners Announced'}
                   </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MyDraws;