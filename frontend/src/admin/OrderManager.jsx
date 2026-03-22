import { useEffect, useState } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_COLORS = { placed: 'text-mango-400', confirmed: 'text-blue-400', packed: 'text-purple-400', shipped: 'text-cyan-400', out_for_delivery: 'text-orange-400', delivered: 'text-forest-400', cancelled: 'text-red-400' };

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [updatingId, setUpdatingId] = useState(null);

    const fetch = () => {
        setLoading(true);
        const q = new URLSearchParams({ page, ...(status && { status }), ...(search && { search }) });
        api.get(`/orders?${q}`).then(({ data }) => {
            setOrders(data.orders || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        }).finally(() => setLoading(false));
    };

    useEffect(() => { fetch(); }, [status, search, page]);

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            toast.success('Status updated');
            fetch();
        } catch (err) { toast.error(err.message); }
        finally { setUpdatingId(null); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-black text-stone-100 uppercase tracking-tighter">Order Logs</h1>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mt-1">{total} transctions recorded</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search ID or Customer..." className="input-field pl-11 text-xs py-3 rounded-2xl border-stone-800 focus:ring-mango-500/10" />
                    </div>
                    <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field w-full sm:w-44 text-xs py-3 rounded-2xl border-stone-800 appearance-none bg-stone-800/50">
                        <option value="">All Streams</option>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-2xl shimmer" />)}</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-24 card bg-stone-900/50 border-dashed border-stone-800">
                    <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">No matching orders found</p>
                </div>
            ) : (
                <div className="card overflow-hidden shadow-2xl border-stone-800">
                    <div className="responsive-table-container">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead>
                                <tr className="border-b border-stone-800 text-[10px] uppercase font-black tracking-widest text-stone-500 bg-stone-800/10">
                                    <th className="p-5 text-left">Reference</th>
                                    <th className="p-5 text-left">Identity</th>
                                    <th className="p-5 text-left">Timeline & Locale</th>
                                    <th className="p-5 text-left">Logistics</th>
                                    <th className="p-5 text-left">Value</th>
                                    <th className="p-5 text-left">Pipeline Status</th>
                                    <th className="p-5 text-right">Operation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800/30">
                                {orders.map((o) => (
                                    <tr key={o._id} className="hover:bg-stone-800/20 transition-all group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/track/${o.orderId}`} target="_blank" className="font-mono text-mango-400 hover:text-mango-300 font-black text-xs transition-colors">#{o.orderId}</Link>
                                                {o.isGuest && <span className="px-1.5 py-0.5 bg-stone-800 text-stone-500 rounded text-[9px] font-black tracking-tighter uppercase border border-stone-700">EXT</span>}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-stone-100 font-bold">{o.customerInfo?.name}</p>
                                            <p className="text-[10px] text-stone-500 font-medium mt-0.5">{o.customerInfo?.phone}</p>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-stone-400 text-xs font-bold">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                                            <p className="mt-0.5 text-[10px] text-stone-600 font-bold uppercase truncate max-w-[120px]">{o.deliveryAddress?.city || 'N/A'}</p>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[11px] text-stone-300 font-medium bg-stone-800/50 w-fit px-2 py-0.5 rounded-md border border-stone-800">{o.items?.length || 0} unit(s)</span>
                                                {(o.deliveryAddress?.latitude || o.deliveryAddress?.coordinates?.lat) && (
                                                    <a 
                                                        href={`https://www.openstreetmap.org/?mlat=${o.deliveryAddress?.latitude || o.deliveryAddress?.coordinates?.lat}&mlon=${o.deliveryAddress?.longitude || o.deliveryAddress?.coordinates?.lng}#map=18/${o.deliveryAddress?.latitude || o.deliveryAddress?.coordinates?.lat}/${o.deliveryAddress?.longitude || o.deliveryAddress?.coordinates?.lng}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-[9px] bg-stone-800 hover:bg-stone-700 text-mango-500 font-black px-2 py-1 rounded-lg border border-stone-700 transition-all w-fit uppercase"
                                                    >
                                                        📍 G-Map
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5 font-black text-stone-100 text-base italic tracking-tighter">₹{o.pricing?.total}</td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current bg-opacity-10 ${STATUS_COLORS[o.status] || 'text-stone-400'}`}>
                                                {o.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="relative group/select max-w-[140px] ml-auto">
                                                <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}
                                                    disabled={updatingId === o._id || o.status === 'delivered' || o.status === 'cancelled'}
                                                    className="w-full bg-stone-800/50 border border-stone-800 text-stone-300 py-2 px-3 pr-8 rounded-xl text-[10px] font-black uppercase tracking-wider appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors">
                                                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                                </select>
                                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 w-3 h-3 pointer-events-none" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex gap-2 mt-4 justify-center">
                    {[...Array(pages)].map((_, i) => (
                        <button key={i} onClick={() => setPage(i + 1)}
                            className={`w-9 h-9 rounded-xl text-sm font-medium ${page === i + 1 ? 'bg-mango-500 text-stone-900' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
