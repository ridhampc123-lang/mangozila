import { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiChevronDown, FiPackage, FiMapPin, FiX } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = ['pending', 'contacted', 'quoted', 'confirmed', 'rejected'];
const STATUS_COLORS = { 
    pending: 'text-mango-400', 
    contacted: 'text-blue-400', 
    quoted: 'text-purple-400', 
    confirmed: 'text-forest-400', 
    rejected: 'text-red-400' 
};

const LOCATION_OPTIONS = ['Ahmedabad', 'Gandhinagar', 'Rajkot'];
const PRODUCT_OPTIONS = ['Kesar 5kg', 'Kesar 10kg', 'Kachchh Kesar 5kg', 'Kachchh Kesar 10kg'];

export default function BulkOrderManager() {
    const [bulkOrders, setBulkOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetch = useCallback(() => {
        setLoading(true);
        const q = new URLSearchParams({ page, ...(status && { status }), ...(search && { search }) });
        api.get(`/bulk-orders?${q}`).then(({ data }) => {
            setBulkOrders(data.bulkOrders || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        }).catch(() => {
            toast.error('Failed to load bulk orders');
        }).finally(() => setLoading(false));
    }, [page, status, search]);

    useEffect(() => { fetch(); }, [fetch]);

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await api.put(`/bulk-orders/${id}`, { status: newStatus });
            toast.success('Status updated successfully');
            fetch();
        } catch { 
            toast.error('Failed to update status'); 
        } finally { 
            setUpdatingId(null); 
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    return (
        <div>
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-black text-stone-100 flex items-center gap-3 tracking-tight">
                        <FiPackage className="text-mango-500 w-8 h-8" />
                        Bulk Orders
                    </h1>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mt-1">{total} corporate inquiries logged</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                        <input 
                            value={search} 
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                            placeholder="Search by name/company..." 
                            className="input-field pl-11 text-xs py-3 rounded-2xl border-stone-800" 
                        />
                    </div>
                    <select 
                        value={status} 
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }} 
                        className="input-field w-full sm:w-44 text-xs py-3 rounded-2xl border-stone-800 appearance-none bg-stone-800/50"
                    >
                        <option value="">All Inquiries</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl shimmer" />
                    ))}
                </div>
            ) : bulkOrders.length === 0 ? (
                <div className="text-center py-24 card bg-stone-900/50 border-dashed border-stone-800 shadow-none">
                    <FiPackage className="w-12 h-12 mx-auto text-stone-700 mb-4 stroke-1" />
                    <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">No bulk order data available</p>
                </div>
            ) : (
                <div className="card overflow-hidden shadow-2xl border-stone-800">
                    <div className="responsive-table-container">
                        <table className="w-full text-sm min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-stone-800 text-[10px] uppercase font-black tracking-widest text-stone-500 bg-stone-800/10">
                                    <th className="p-5 text-left">Customer / Deal</th>
                                    <th className="p-5 text-left">Contact Data</th>
                                    <th className="p-5 text-left">Geography</th>
                                    <th className="p-5 text-left">Product Selection</th>
                                    <th className="p-5 text-left">Volume</th>
                                    <th className="p-5 text-left">Date Logged</th>
                                    <th className="p-5 text-left">Stage</th>
                                    <th className="p-5 text-right">Pipeline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800/30">
                                {bulkOrders.map((order) => (
                                    <tr 
                                        key={order._id} 
                                        className="hover:bg-stone-800/20 transition-all cursor-pointer group"
                                        onClick={() => openOrderDetails(order)}
                                    >
                                        <td className="p-5">
                                            <p className="text-stone-100 font-bold text-base leading-tight">{order.name}</p>
                                            {order.company && (
                                                <p className="text-[10px] text-mango-500 uppercase font-black tracking-wider mt-1">{order.company}</p>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <p className="text-stone-300 text-xs font-medium">{order.email}</p>
                                            <p className="text-stone-500 text-[10px] mt-0.5">{order.phone}</p>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-1.5 text-stone-400">
                                                <FiMapPin className="w-3.5 h-3.5 text-mango-500" />
                                                <span className="text-xs font-bold uppercase tracking-tight">{order.location}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="px-2 py-1 bg-stone-800 text-mango-500 border border-mango-500/10 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                {order.productType}
                                            </span>
                                        </td>
                                        <td className="p-5 text-stone-200 font-black italic text-lg">{order.quantity}</td>
                                        <td className="p-5 text-stone-500 text-[11px] font-bold">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current bg-opacity-10 ${STATUS_COLORS[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-5" onClick={(e) => e.stopPropagation()}>
                                            <div className="relative max-w-[130px] ml-auto">
                                                <select 
                                                    value={order.status} 
                                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                                    disabled={updatingId === order._id || order.status === 'confirmed' || order.status === 'rejected'}
                                                    className="w-full bg-stone-800/40 border border-stone-800 text-stone-300 py-2 px-3 pr-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-30"
                                                >
                                                    {STATUS_OPTIONS.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 w-3 h-3 pointer-events-none transition-all" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
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

            {/* Order Details Modal Overlay */}
            <AnimatePresence>
                {showModal && selectedOrder && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="bg-stone-900 rounded-[2.5rem] border border-stone-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-[0_0_80px_-20px_rgba(0,0,0,0.6)] hide-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Sticky Header */}
                            <div className="p-7 border-b border-stone-800 sticky top-0 bg-stone-900/90 backdrop-blur-md z-10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-black text-stone-100 uppercase tracking-tighter">Deal Breakdown</h2>
                                    <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest font-black">
                                        Received {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')} • {new Date(selectedOrder.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <button onClick={closeModal} className="p-3 bg-stone-800 text-stone-400 rounded-2xl hover:text-white transition-all"><FiX className="w-5 h-5" /></button>
                            </div>

                            {/* Modal Dynamic Content */}
                            <div className="p-7 space-y-8">
                                {/* Identity Grid */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="p-5 bg-stone-800/30 rounded-3xl border border-stone-800/50">
                                        <p className="text-[9px] uppercase font-black text-stone-500 tracking-widest mb-2">Primary Contact</p>
                                        <p className="text-xl font-black text-stone-100 italic">{selectedOrder.name}</p>
                                        <p className="text-sm text-mango-500 font-bold mt-1">{selectedOrder.company || 'Private Deal'}</p>
                                        <div className="mt-4 flex flex-col gap-1">
                                            <p className="text-xs text-stone-400 font-medium truncate">{selectedOrder.email}</p>
                                            <p className="text-xs text-stone-400 font-medium">{selectedOrder.phone}</p>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-stone-800/30 rounded-3xl border border-stone-800/50">
                                        <p className="text-[9px] uppercase font-black text-stone-500 tracking-widest mb-2">Deal Summary</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-stone-400 font-bold">Volume</span>
                                                <span className="text-lg font-black text-stone-100 italic">{selectedOrder.quantity} Boxes</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-stone-400 font-bold">Category</span>
                                                <span className="px-2 py-0.5 bg-mango-500/10 text-mango-400 border border-mango-500/20 rounded-md text-[9px] font-black uppercase">{selectedOrder.productType}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-stone-400 font-bold">Region</span>
                                                <span className="text-xs font-black text-stone-100 uppercase tracking-tighter">{selectedOrder.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logistics Breakdown */}
                                {(selectedOrder.apartment || selectedOrder.address) && (
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] uppercase font-black text-stone-500 tracking-widest ml-1">Logistics / Destination</h3>
                                        <div className="p-5 bg-stone-800/20 rounded-3xl border border-stone-800/30">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center flex-shrink-0 text-mango-500 shadow-inner">
                                                    <FiMapPin className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    {selectedOrder.apartment && (
                                                        <p className="text-sm font-bold text-stone-100">{selectedOrder.apartment}</p>
                                                    )}
                                                    {selectedOrder.address && (
                                                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">{selectedOrder.address}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Intelligence / Message */}
                                {selectedOrder.message && (
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] uppercase font-black text-stone-500 tracking-widest ml-1">Inquiry Intelligence</h3>
                                        <div className="p-5 bg-mango-500/5 rounded-3xl border border-mango-500/10 italic text-stone-300 text-sm leading-relaxed relative overflow-hidden">
                                            <span className="absolute -top-4 -right-2 text-7xl text-mango-500/5 font-black uppercase select-none">Notes</span>
                                            {selectedOrder.message}
                                        </div>
                                    </div>
                                )}

                                {/* Economic Section */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] uppercase font-black text-stone-500 tracking-widest ml-1">Internal Pipeline Section</h3>
                                    <div className="p-5 bg-stone-800/30 rounded-3xl border border-stone-800/50 space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[9px] uppercase font-bold text-stone-500">Valuation</p>
                                                <p className="text-2xl font-black text-stone-100 tracking-tighter italic">₹{selectedOrder.quotedPrice || '0.00'}</p>
                                            </div>
                                            <div className="space-y-1 sm:text-right">
                                                <p className="text-[9px] uppercase font-bold text-stone-500">Current Pipeline Phase</p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-current bg-opacity-10 ${STATUS_COLORS[selectedOrder.status]}`}>
                                                    {selectedOrder.status}
                                                </span>
                                            </div>
                                        </div>
                                        {selectedOrder.adminNotes && (
                                            <div className="pt-4 border-t border-stone-700/50">
                                                <p className="text-[9px] uppercase font-bold text-stone-500 mb-2">Team Strategy Notes</p>
                                                <p className="text-xs text-stone-300 italic">{selectedOrder.adminNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Action Bar */}
                            <div className="p-7 pt-4 bg-stone-900 border-t border-stone-800">
                                <button 
                                    onClick={closeModal}
                                    className="w-full h-14 bg-stone-800 hover:bg-stone-700 text-stone-100 font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-black/20 text-xs"
                                >
                                    Exit Data View
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
        </div>
    );
}
