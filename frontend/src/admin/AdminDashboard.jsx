import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiUsers, FiDollarSign, FiPackage } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../services/api';

const PIE_COLORS = ['#f59e0b', '#6366f1', '#22c55e', '#06b6d4', '#f43f5e', '#a855f7'];

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard').then(({ data }) => setStats(data)).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-4">
            <div className="h-8 w-48 rounded-xl shimmer" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl shimmer" />)}</div>
            <div className="h-64 rounded-2xl shimmer" />
        </div>
    );

    const statCards = [
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingBag />, color: 'text-mango-400', bg: 'bg-mango-500/10' },
        { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: <FiDollarSign />, color: 'text-forest-400', bg: 'bg-forest-500/10' },
        { label: 'Customers', value: stats?.totalUsers || 0, icon: <FiUsers />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Products', value: stats?.totalMangoes || 0, icon: <FiPackage />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-stone-100">Dashboard</h1>
                <p className="text-stone-400 text-sm mt-1">Welcome back! Here's what's happening with MangoZila.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center ${s.color} text-lg`}>{s.icon}</div>
                        </div>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-stone-400 text-xs mt-1">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Dashboard Sections */}
            <div className="space-y-6">
                {/* Charts */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="card p-4 sm:p-5 lg:col-span-2">
                        <h2 className="font-semibold text-stone-100 mb-6 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-mango-500 rounded-full"></span>
                            Revenue (Last 7 Days)
                        </h2>
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.dailyRevenue || []}>
                                    <defs>
                                        <linearGradient id="Rev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                                    <XAxis dataKey="_id" tick={{ fill: '#78716c', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#78716c', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                                    <Tooltip 
                                        contentStyle={{ background: '#1c1917', border: '1px solid #f59e0b33', borderRadius: 12, fontSize: '12px' }} 
                                        formatter={(v) => [`₹${v}`, 'Revenue']} 
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#Rev)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Status Pie */}
                    <div className="card p-4 sm:p-5">
                        <h2 className="font-semibold text-stone-100 mb-6 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                            Order Status
                        </h2>
                        <div className="h-[220px] w-full">
                            {stats?.statusBreakdown?.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={stats.statusBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                            {stats.statusBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ background: '#1c1917', border: '1px solid #ffffff11', borderRadius: 12, fontSize: '11px' }}
                                            formatter={(v, n) => [v, n.replace(/_/g, ' ')]} 
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-stone-500 text-sm italic">
                                    No orders data
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Sections: Recent Orders & Top Mangoes */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="card p-4 sm:p-5">
                        <h2 className="font-semibold text-stone-100 mb-4 text-sm">Recent Orders</h2>
                        <div className="space-y-4">
                            {stats?.recentOrders?.length > 0 ? stats.recentOrders.map((o) => (
                                <div key={o._id} className="flex justify-between items-center py-2 border-b border-stone-800 last:border-0 hover:bg-stone-800/20 px-1 rounded-lg transition-colors">
                                    <div className="min-w-0">
                                        <p className="font-mono text-[10px] text-mango-400 font-bold uppercase tracking-wider">#{o.orderId}</p>
                                        <p className="text-xs text-stone-300 truncate mt-0.5">{o.user?.name || o.customerInfo?.name || 'Guest'}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <p className="text-sm font-bold text-stone-100">₹{o.pricing?.total}</p>
                                        <p className={`text-[10px] font-black uppercase tracking-tight mt-0.5 ${o.status === 'delivered' ? 'text-forest-400' : o.status === 'cancelled' ? 'text-red-400' : 'text-mango-400'}`}>
                                            {o.status.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>
                            )) : <p className="text-stone-500 text-xs py-10 text-center italic">No recent orders yet</p>}
                        </div>
                    </div>

                    <div className="card p-4 sm:p-5">
                        <h2 className="font-semibold text-stone-100 mb-4 text-sm">Popular Mangoes</h2>
                        <div className="space-y-4">
                            {stats?.popularMangoes?.length > 0 ? stats.popularMangoes.map((m, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-stone-800 last:border-0 hover:bg-stone-800/20 px-1 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-mango-500 font-black text-xs w-5">0{i + 1}</span>
                                        <span className="text-sm font-medium text-stone-200">🥭 {m.name}</span>
                                    </div>
                                    <span className="text-xs font-black bg-stone-800 px-2 py-1 rounded text-stone-400 uppercase tracking-tighter shadow-sm">{m.totalSold} sold</span>
                                </div>
                            )) : <p className="text-stone-500 text-xs py-10 text-center italic">No sales data yet</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
