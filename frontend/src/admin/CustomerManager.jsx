import { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiPhone, FiMail, FiBarChart, FiAward, FiChevronDown } from 'react-icons/fi';
import api from '../services/api';

export default function CustomerManager() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetch = () => {
        setLoading(true);
        const q = new URLSearchParams({ page, ...(search && { search }) });
        api.get(`/users?${q}`).then(({ data }) => {
            setUsers(data.users || []); setTotal(data.total || 0); setPages(data.pages || 1);
        }).finally(() => setLoading(false));
    };

    useEffect(() => { fetch(); }, [search, page]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-black text-stone-100 flex items-center gap-3 tracking-tight">
                        <FiUsers className="text-mango-500 w-8 h-8" />
                        Customer Registry
                    </h1>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mt-1">{total} authenticated consumers logged</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                    <input 
                        value={search} 
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                        placeholder="Search by identity..." 
                        className="input-field pl-11 text-xs py-3 rounded-2xl border-stone-800 w-full" 
                    />
                </div>
            </div>

            {/* Content Table */}
            <div className="card overflow-hidden shadow-2xl border-stone-800">
                <div className="responsive-table-container">
                    <table className="w-full text-sm min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-stone-800 text-[10px] uppercase font-black tracking-widest text-stone-500 bg-stone-800/10">
                                <th className="p-5 text-left">Consumer Profile</th>
                                <th className="p-5 text-left">Connectivity</th>
                                <th className="p-5 text-left">Internal Standing</th>
                                <th className="p-5 text-left">Affiliation Key</th>
                                <th className="p-5 text-left">Registry Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800/30">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="p-8">
                                            <div className="h-12 rounded-2xl shimmer w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <FiUsers className="w-12 h-12 mx-auto text-stone-800 mb-4 stroke-1" />
                                        <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">No registry entries found</p>
                                    </td>
                                </tr>
                            ) : users.map((u) => (
                                <tr key={u._id} className="hover:bg-stone-800/20 transition-all group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-stone-800 rounded-[1.25rem] flex items-center justify-center text-mango-500 font-black text-lg shadow-inner border border-stone-700/50 group-hover:scale-110 transition-transform">
                                                {u.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-stone-100 italic text-base leading-tight tracking-tight">{u.name}</p>
                                                <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest mt-0.5">{u.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs text-stone-300 font-medium">
                                                <FiMail className="w-3.5 h-3.5 text-mango-500" />
                                                <span>{u.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                                <FiPhone className="w-3.5 h-3.5" />
                                                <span>{u.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <FiAward className="text-mango-500 w-4 h-4" />
                                            <div>
                                                <p className="text-lg font-black text-stone-100 italic leading-none">{u.loyaltyPoints || 0}</p>
                                                <p className="text-[8px] uppercase font-black text-stone-500 tracking-tighter mt-1">Loyalty Credits</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-3 py-1 bg-stone-800 text-mango-500 border border-stone-700 rounded-lg text-[10px] font-mono font-black tracking-widest shadow-sm">
                                            {u.referralCode || '—'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-stone-500 text-[11px] font-bold">
                                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Grid */}
            {pages > 1 && (
                <div className="flex gap-2.5 mt-8 justify-center">
                    {[...Array(pages)].map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setPage(i + 1)}
                            className={`w-11 h-11 rounded-2xl text-xs font-black transition-all shadow-lg ${
                                page === i + 1 
                                    ? 'bg-mango-500 text-stone-900 shadow-mango-500/20 scale-110' 
                                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-100'
                            }`}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
