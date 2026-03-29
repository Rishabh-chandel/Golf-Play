import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { AnimatedCounter } from '../../components/animations/AnimatedCounter';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ShieldCheck, Users, HeartHandshake, Coins, FileClock } from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalCharities: 0,
    monthlyRevenue: 0,
    referredSignups: 0,
    recentAuditLogs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        if (response.data.success) {
          setStats(response.data.data || stats);
        }
      } catch (error) {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const auditBreakdown = stats.recentAuditLogs.reduce((accumulator, logEntry) => {
    const existing = accumulator.find((item) => item.action === logEntry.action);
    if (existing) {
      existing.count += 1;
    } else {
      accumulator.push({ action: logEntry.action, count: 1 });
    }
    return accumulator;
  }, []);

  return (
    <div className="space-y-8 mt-4">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-gold">Platform Overview</h1>
        <p className="text-text-secondary mt-2">High-level metrics, referrals, and recent audit activity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card delay={0.1}>
            <p className="text-sm font-medium text-text-secondary">Total Users</p>
            <h3 className="text-3xl font-mono font-bold mt-2 text-white">
                <AnimatedCounter value={loading ? 0 : stats.totalUsers} duration={1000} />
            </h3>
         </Card>
         <Card delay={0.2}>
            <p className="text-sm font-medium text-text-secondary">Active Subscribers</p>
            <h3 className="text-3xl font-mono font-bold text-emerald mt-2">
                <AnimatedCounter value={loading ? 0 : stats.activeSubscribers} duration={1000} />
            </h3>
         </Card>
          <Card delay={0.3}>
            <p className="text-sm font-medium text-text-secondary">Charities</p>
            <h3 className="text-3xl font-mono font-bold mt-2">
                <AnimatedCounter value={loading ? 0 : stats.totalCharities} duration={1000} />
            </h3>
         </Card>
         <Card delay={0.4}>
            <p className="text-sm font-medium text-text-secondary">Monthly Revenue (£)</p>
            <h3 className="text-3xl font-bold text-gold mt-2">
                <AnimatedCounter prefix="£" value={loading ? 0 : stats.monthlyRevenue} duration={1500} />
            </h3>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-xl">Audit Activity</h3>
              <p className="text-sm text-text-secondary">Recent tracked actions across the platform.</p>
            </div>
            <FileClock className="text-emerald" />
          </div>
          <div className="h-72">
            {auditBreakdown.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-secondary">No audit history yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={auditBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="action" stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: '16px' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-xl">Referral Summary</h3>
              <p className="text-sm text-text-secondary">Invite-driven growth so far.</p>
            </div>
            <Users className="text-gold" />
          </div>
          <div className="space-y-4">
            <div className="rounded-xl bg-surface-2 p-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">Referral signups</span>
              <span className="font-bold text-emerald">{stats.referredSignups || 0}</span>
            </div>
            <div className="rounded-xl bg-surface-2 p-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">Tracked charities</span>
              <span className="font-bold text-gold">{stats.totalCharities || 0}</span>
            </div>
            <div className="rounded-xl bg-surface-2 p-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">Revenue this month</span>
              <span className="font-bold text-white">£{stats.monthlyRevenue || 0}</span>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="mt-8">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div>
            <h3 className="font-display font-bold text-xl">Recent Audit Trail</h3>
            <p className="text-sm text-text-secondary">Latest recorded actions with timestamps.</p>
          </div>
          <ShieldCheck className="text-emerald" />
        </div>
        <div className="space-y-3">
          {(stats.recentAuditLogs || []).map((entry) => (
            <div key={entry._id} className="flex items-center justify-between gap-4 rounded-xl bg-surface-2 px-4 py-3">
              <div>
                <p className="font-medium">{entry.description}</p>
                <p className="text-xs text-text-secondary">
                  {entry.actor ? `${entry.actor.firstName} ${entry.actor.lastName}` : 'System'} · {dayjs(entry.createdAt).format('DD MMM YYYY, HH:mm')}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald/10 text-emerald">{entry.action}</span>
            </div>
          ))}
          {(stats.recentAuditLogs || []).length === 0 && (
            <div className="p-6 text-center text-text-secondary">Audit events will appear here once users start using the app.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminOverview;
