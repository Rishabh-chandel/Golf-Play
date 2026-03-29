import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const Leaderboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        if (response.data.success) {
          setRows(response.data.data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-obsidian text-text-primary">
      <Navbar />
      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Leaderboard</h1>
          <p className="text-text-secondary">Anonymised monthly rankings based on rolling score averages.</p>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-bold text-xl">Top Players</h2>
            <span className="text-xs text-text-secondary">Updated {dayjs().format('DD MMM YYYY')}</span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-16 rounded-xl bg-surface-2" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((entry) => (
                <motion.div
                  key={entry.userId || entry.rank}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 md:p-6 flex items-center justify-between gap-4 hover:bg-surface-2/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-emerald/10 text-emerald flex items-center justify-center font-bold">
                        {entry.rank}
                      </span>
                      <div>
                        <p className="font-bold">Player #{100 + entry.rank}</p>
                        <p className="text-sm text-text-secondary">{entry.totalRounds} rounds tracked</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-lg text-gold">Avg {entry.averageScore}</p>
                    <p className="text-xs text-text-secondary">Best {entry.bestScore}</p>
                  </div>
                </motion.div>
              ))}
              {rows.length === 0 && (
                <div className="p-8 text-center text-text-secondary">No leaderboard data yet.</div>
              )}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;