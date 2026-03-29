import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { AnimatedCounter } from '../../components/animations/AnimatedCounter';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import dayjs from 'dayjs';
import { BarChart, Bar, CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from 'recharts';
import { Trophy, Target, HeartHandshake, BarChart3 } from 'lucide-react';

const COLORS = ['#10b981', '#f5c842', '#f97316'];

const Overview = () => {
  const [scores, setScores] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [currentDraw, setCurrentDraw] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [scoresRes, winningsRes, drawRes] = await Promise.allSettled([
          api.get('/scores/my'),
          api.get('/winners/my'),
          api.get('/draws/current'),
        ]);

        if (scoresRes.status === 'fulfilled' && scoresRes.value.data.success) {
          setScores(scoresRes.value.data.data || []);
        }
        if (winningsRes.status === 'fulfilled' && winningsRes.value.data.success) {
          setWinnings(winningsRes.value.data.data || []);
        }
        if (drawRes.status === 'fulfilled' && drawRes.value.data.success) {
          setCurrentDraw(drawRes.value.data.data || null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const totalRounds = scores.length;
  const totalWinnings = winnings.reduce((sum, win) => sum + (win.prizeAmount || 0), 0);
  const averageScore = scores.length
    ? (scores.reduce((sum, score) => sum + (score.value ?? score.grossScore ?? 0), 0) / scores.length).toFixed(1)
    : '0.0';
  const bestRound = scores.length
    ? Math.min(...scores.map((score) => score.value ?? score.grossScore ?? 0))
    : 0;
  const prizePoolTotal = currentDraw?.prizePool?.total || 0;

  const scoreTimeline = [...scores]
    .sort((a, b) => new Date(a.datePlayed) - new Date(b.datePlayed))
    .map((score, index) => ({
      label: dayjs(score.datePlayed).format('D MMM'),
      score: score.value ?? score.grossScore ?? 0,
      differential: score.scoreDifferential ?? 0,
      round: index + 1,
    }));

  const scoreDistribution = [
    { name: 'Great', value: scores.filter((score) => (score.value ?? score.grossScore ?? 0) <= 28).length },
    { name: 'Solid', value: scores.filter((score) => (score.value ?? score.grossScore ?? 0) > 28 && (score.value ?? score.grossScore ?? 0) <= 35).length },
    { name: 'Work to do', value: scores.filter((score) => (score.value ?? score.grossScore ?? 0) > 35).length },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8 mt-10">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold">Good morning, Champ 🏌️</h1>
        <p className="text-text-secondary mt-2">Here is your latest score trend, prize status, and winnings summary.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card delay={0.1}>
            <p className="text-sm font-medium text-text-secondary">Current Prize Pool</p>
            <h3 className="text-3xl font-mono font-bold text-gold mt-2">
                {loading ? '...' : <AnimatedCounter prefix="£" value={prizePoolTotal} duration={1000} />}
            </h3>
         </Card>
         <Card delay={0.2}>
            <p className="text-sm font-medium text-text-secondary">Lifetime Winnings</p>
            <h3 className="text-3xl font-mono font-bold text-emerald mt-2">
                {loading ? '...' : <AnimatedCounter prefix="£" value={totalWinnings} duration={1000} />}
            </h3>
         </Card>
          <Card delay={0.3}>
            <p className="text-sm font-medium text-text-secondary">Rounds Logged</p>
            <h3 className="text-3xl font-mono font-bold mt-2">
                {loading ? '...' : <AnimatedCounter value={totalRounds} duration={1000} />}
            </h3>
         </Card>
         <Card delay={0.4} className="border-emerald/30 bg-emerald/5">
            <p className="text-sm font-medium text-text-secondary">Average Score</p>
            <div className="flex items-center justify-between mt-2">
                <h3 className="text-xl font-bold">{loading ? '...' : averageScore}</h3>
                <span className="text-xs px-2 py-1 bg-emerald/20 text-emerald rounded-full">Best {bestRound || '—'}</span>
            </div>
            <p className="text-xs text-text-secondary mt-2">Next draw: {currentDraw?.drawDate ? dayjs(currentDraw.drawDate).format('DD MMM YYYY') : 'Pending'}</p>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4 gap-4">
            <div>
              <h3 className="font-display font-bold text-xl">Score Trend</h3>
              <p className="text-sm text-text-secondary">Your recent rounds plotted over time.</p>
            </div>
            <BarChart3 className="text-emerald" />
          </div>
          <div className="h-72">
            {scoreTimeline.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-secondary">Submit a score to start building your trend line.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="label" stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: '16px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="differential" stroke="#f5c842" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-bold text-xl border-b border-border pb-4 mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-3">
            {winnings.slice(0, 3).map((win, index) => (
              <div key={win._id || index} className="p-3 rounded-lg bg-surface-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <p className="font-medium">£{win.prizeAmount}</p>
                    <p className="text-xs text-text-secondary">{win.verificationStatus || 'pending'} · {win.draw?.drawDate ? dayjs(win.draw.drawDate).format('MMM YYYY') : 'Draw result'}</p>
                  </div>
                </div>
              </div>
            ))}
            {winnings.length === 0 && (
              <div className="p-6 text-center text-text-secondary bg-surface-2 rounded-xl">No winnings recorded yet.</div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-xl">Round Distribution</h3>
              <p className="text-sm text-text-secondary">How your rounds currently cluster.</p>
            </div>
            <Target className="text-gold" />
          </div>
          <div className="h-72">
            {scoreDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-secondary">No score data to chart yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: '16px' }} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-xl">Charity Impact</h3>
              <p className="text-sm text-text-secondary">Subscription allocation snapshot.</p>
            </div>
            <HeartHandshake className="text-emerald" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Charity', value: 50 },
                    { name: 'Prize Pool', value: 50 },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={6}
                >
                  {[0, 1].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: '16px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
