import { useState, useEffect } from 'react';
import { FiTrendingUp, FiPackage, FiCalendar, FiActivity, FiUser, FiMoreVertical } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function SubscriptionManager() {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/subscriptions').then(({ data }) => setSubs(data || [])).finally(() => setLoading(false));
    }, []);

    const STATUS_ATTRS = { 
        active: { color: 'text-forest-400 bg-forest-400/10 border-forest-400/20', label: 'Active Delivery' }, 
        paused: { color: 'text-mango-400 bg-mango-400/10 border-mango-400/20', label: 'On Hold' }, 
        cancelled: { color: 'text-red-400 bg-red-400/10 border-red-400/20', label: 'Terminated' } 
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-black text-stone-100 flex items-center gap-3 tracking-tight">
                        <FiTrendingUp className="text-mango-500 w-8 h-8" />
                        Subscription Matrix
                    </h1>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mt-1">{subs.length} recurring contracts operational</p>
                </div>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Plans', val: subs.filter(s => s.status === 'active').length, icon: FiActivity, color: 'text-forest-400' },
                    { label: 'Avg Frequency', val: 'Weekly', icon: FiCalendar, color: 'text-mango-500' }
                ].map((stat, i) => (
                    <div key={i} className="card p-4 bg-stone-900/40 flex items-center gap-4 border-stone-800/50">
                        <div className={`p-2.5 rounded-xl bg-stone-800 ${stat.color} shadow-inner`}>
                            <stat.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] uppercase font-black text-stone-500 tracking-widest">{stat.label}</p>
                            <p className="text-lg font-black text-stone-100 italic">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Layer */}
            <div className="card overflow-hidden shadow-2xl border-stone-800">
                <div className="responsive-table-container">
                    <table className="w-full text-sm min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-stone-800 text-[10px] uppercase font-black tracking-widest text-stone-500 bg-stone-800/10">
                                <th className="p-5 text-left">Contract Holder</th>
                                <th className="p-5 text-left">Allocated Unit</th>
                                <th className="p-5 text-left">Plan Configuration</th>
                                <th className="p-5 text-left">Economic Value</th>
                                <th className="p-5 text-left">Next Dispatch</th>
                                <th className="p-5 text-left">Lifecycle State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800/30">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="p-8"><div className="h-12 rounded-2xl shimmer w-full" /></td></tr>
                                ))
                            ) : subs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <FiTrendingUp className="w-12 h-12 mx-auto text-stone-800 mb-4 stroke-1" />
                                        <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">No subscription protocols active</p>
                                    </td>
                                </tr>
                            ) : (
                                subs.map((s) => (
                                    <tr key={s._id} className="hover:bg-stone-800/20 transition-all group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-mango-500 transition-colors shadow-inner border border-stone-800">
                                                    <FiUser className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-stone-100 italic leading-tight">{s.user?.name}</p>
                                                    <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest mt-0.5">{s.user?.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                {s.mango?.images?.[0] ? (
                                                    <img src={s.mango.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover border border-stone-800 shadow-md group-hover:scale-110 transition-transform" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center text-lg">🥭</div>
                                                )}
                                                <span className="text-stone-200 font-bold italic tracking-tight">{s.mango?.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-800 border border-stone-700 rounded-lg shadow-sm">
                                                <FiPackage className="w-3 h-3 text-mango-500" />
                                                <span className="text-[10px] font-black uppercase text-stone-300 tracking-widest">{s.boxSize} · {s.frequency}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="space-y-0.5">
                                                <p className="text-base font-black text-stone-100 italic">₹{s.pricePerDelivery}</p>
                                                <p className="text-[8px] uppercase font-black text-stone-500 tracking-tighter mt-1">Per Rotation</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {s.nextDeliveryDate ? (
                                                <div className="flex items-center gap-2 text-stone-400">
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-bold">{new Date(s.nextDeliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                                                </div>
                                            ) : <span className="text-stone-700">—</span>}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-current bg-opacity-10 shadow-sm ${STATUS_ATTRS[s.status]?.color || 'text-stone-500'}`}>
                                                {STATUS_ATTRS[s.status]?.label || s.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
