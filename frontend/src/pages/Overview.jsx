import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/api';
import LoadingScreen from '../components/LoadingScreen';

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    pendingVerification: 0,
    activeCustomers: 0,
    chartData: []
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments/list');
      const transactions = response.data.transactions;

      const successful = transactions.filter(t => t.status === 'Success');
      const pending = transactions.filter(t => t.status === 'Pending Verification');
      const uniqueCustomers = new Set(transactions.map(t => t.customer_email)).size;

      // Group by date for chart (simple last 7 days mock or real logic)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayTotal = successful
          .filter(t => new Date(t.created_at).toDateString() === d.toDateString())
          .reduce((acc, t) => acc + t.amount, 0);
        return { name: dateStr, amount: dayTotal };
      }).reverse();

      setStats({
        totalRevenue: successful.reduce((acc, t) => acc + t.amount, 0),
        totalTransactions: transactions.length,
        pendingVerification: pending.length,
        activeCustomers: uniqueCustomers,
        chartData: last7Days
      });
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = [
    { label: 'Total Revenue', value: `\u20B9${stats.totalRevenue.toLocaleString()}`, change: '+12.5%', icon: <TrendingUp color="#10b981" />, trend: 'up' },
    { label: 'Total Transactions', value: stats.totalTransactions, change: '+5', icon: <ArrowUpRight color="var(--primary)" />, trend: 'up' },
    { label: 'Active Customers', value: stats.activeCustomers, change: '+2', icon: <Users color="#6366f1" />, trend: 'up' },
    { label: 'Pending Verification', value: stats.pendingVerification, change: 'Action Required', icon: <Clock color="#f59e0b" />, trend: 'neutral' },
  ];

  if (loading) {
    return <LoadingScreen fullScreen />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>Dashboard Overview</h1>
        <p style={{ color: '#64748b' }}>Here's what's happening with your payments today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            style={{ background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '0.75rem' }}>
                {card.icon}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: card.trend === 'up' ? '#10b981' : '#f59e0b', background: card.trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '0.25rem 0.625rem', borderRadius: '100px', alignSelf: 'start' }}>
                {card.change}
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>{card.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit' }}>{card.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '2rem' }}>Revenue Insights</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`\u20B9${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Platform Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 color="#10b981" size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>API Status</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Operational - 99.9% Uptime</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet color="var(--primary)" size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Withdrawals</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Instant Processing Active</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle color="#f59e0b" size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Compliance</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>UTR Verification Required</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
