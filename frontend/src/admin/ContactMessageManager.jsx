import { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiChevronDown, FiMessageCircle, FiMail, FiPhone, FiX } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = ['new', 'read', 'replied', 'resolved'];
const STATUS_COLORS = { 
    new: 'text-mango-400 bg-mango-500/10 border-mango-500/30', 
    read: 'text-blue-400 bg-blue-500/10 border-blue-500/30', 
    replied: 'text-purple-400 bg-purple-500/10 border-purple-500/30', 
    resolved: 'text-forest-400 bg-forest-500/10 border-forest-500/30'
};

export default function ContactMessageManager() {
    const [contacts, setContacts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetch = useCallback(() => {
        setLoading(true);
        const q = new URLSearchParams({ page, ...(status && { status }), ...(search && { search }) });
        api.get(`/contacts?${q}`).then(({ data }) => {
            setContacts(data.contacts || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        }).catch(() => {
            toast.error('Failed to load contacts');
        }).finally(() => setLoading(false));
    }, [page, status, search]);

    useEffect(() => { fetch(); }, [fetch]);

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await api.put(`/contacts/${id}`, { status: newStatus });
            toast.success('Status updated successfully');
            fetch();
        } catch { 
            toast.error('Failed to update status'); 
        } finally { 
            setUpdatingId(null); 
        }
    };

    const openContactDetails = async (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
        
        // Mark as read if status is new
        if (contact.status === 'new') {
            try {
                await api.get(`/contacts/${contact._id}`);
                fetch();
            } catch {
                // Ignore error
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedContact(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-black text-stone-100 flex items-center gap-3 tracking-tight">
                        <FiMessageCircle className="text-mango-500 w-8 h-8" />
                        Inquiry Feed
                    </h1>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mt-1">{total} communications received</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                        <input 
                            value={search} 
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                            placeholder="Search by name or content..." 
                            className="input-field pl-11 text-xs py-3 rounded-2xl border-stone-800" 
                        />
                    </div>
                    <select 
                        value={status} 
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }} 
                        className="input-field w-full sm:w-44 text-xs py-3 rounded-2xl border-stone-800 appearance-none bg-stone-800/50"
                    >
                        <option value="">All Streams</option>
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
                        <div key={i} className="h-24 rounded-2xl shimmer" />
                    ))}
                </div>
            ) : contacts.length === 0 ? (
                <div className="text-center py-24 card bg-stone-900/50 border-dashed border-stone-800">
                    <FiMessageCircle className="w-12 h-12 mx-auto text-stone-700 mb-4 stroke-1" />
                    <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">Your inbox is currently empty</p>
                </div>
            ) : (
                <div className="card overflow-hidden shadow-2xl border-stone-800">
                    <div className="responsive-table-container">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead>
                                <tr className="border-b border-stone-800 text-[10px] uppercase font-black tracking-widest text-stone-500 bg-stone-800/10">
                                    <th className="p-5 text-left">Sender Identity</th>
                                    <th className="p-5 text-left">Contact Channel</th>
                                    <th className="p-5 text-left">Inquiry Subject</th>
                                    <th className="p-5 text-left">Reception Date</th>
                                    <th className="p-5 text-left">Lifecycle Stage</th>
                                    <th className="p-5 text-right">Workflow</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800/30">
                                {contacts.map((contact) => (
                                    <tr 
                                        key={contact._id} 
                                        className="hover:bg-stone-800/20 transition-all cursor-pointer group"
                                        onClick={() => openContactDetails(contact)}
                                    >
                                        <td className="p-5">
                                            <p className="text-stone-100 font-bold text-base leading-tight italic">{contact.name}</p>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-stone-300 font-medium">
                                                    <FiMail className="w-3.5 h-3.5 text-mango-500" />
                                                    <span>{contact.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                                    <FiPhone className="w-3.5 h-3.5" />
                                                    <span>{contact.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-stone-300 font-bold text-xs truncate max-w-[200px] bg-stone-800/50 px-3 py-1.5 rounded-lg border border-stone-800">{contact.subject}</p>
                                        </td>
                                        <td className="p-5 text-stone-500 text-[11px] font-bold">
                                            {new Date(contact.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current bg-opacity-10 ${STATUS_COLORS[contact.status]}`}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="p-5" onClick={(e) => e.stopPropagation()}>
                                            <div className="relative max-w-[130px] ml-auto">
                                                <select 
                                                    value={contact.status} 
                                                    onChange={(e) => updateStatus(contact._id, e.target.value)}
                                                    disabled={updatingId === contact._id || contact.status === 'resolved'}
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

            {/* Message Details Modal Overlay */}
            <AnimatePresence>
                {showModal && selectedContact && (
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
                                    <h2 className="text-xl font-black text-stone-100 uppercase tracking-tighter">Inquiry Protocol</h2>
                                    <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest font-black">
                                        Received {new Date(selectedContact.createdAt).toLocaleDateString('en-IN')} at {new Date(selectedContact.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <button onClick={closeModal} className="p-3 bg-stone-800 text-stone-400 rounded-2xl hover:text-white transition-all"><FiX className="w-5 h-5" /></button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-7 space-y-8">
                                {/* Profile Header */}
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="w-20 h-20 bg-stone-800 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner border border-stone-700/50">
                                        {selectedContact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-2xl font-black text-stone-100 uppercase tracking-tight italic">{selectedContact.name}</p>
                                        <div className="flex flex-wrap gap-4 mt-3">
                                            <a href={`mailto:${selectedContact.email}`} className="flex items-center gap-2 text-xs font-bold text-mango-500 hover:text-mango-400 transition-colors">
                                                <FiMail className="w-4 h-4" />
                                                {selectedContact.email}
                                            </a>
                                            <a href={`tel:${selectedContact.phone}`} className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-300 transition-colors">
                                                <FiPhone className="w-4 h-4" />
                                                {selectedContact.phone}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-auto">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current bg-opacity-10 ${STATUS_COLORS[selectedContact.status]}`}>
                                            {selectedContact.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Subject & Message Section */}
                                <div className="space-y-4">
                                    <div className="p-5 bg-stone-800/30 rounded-3xl border border-stone-800/50">
                                        <p className="text-[9px] uppercase font-black text-stone-500 tracking-widest mb-2">Subject Matter</p>
                                        <p className="text-xl font-black text-stone-100 tracking-tight leading-tight">{selectedContact.subject}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[9px] uppercase font-black text-stone-500 tracking-widest ml-1">Communication Body</p>
                                        <div className="p-7 bg-stone-800/20 rounded-[2.5rem] border border-stone-800/30 text-stone-300 text-sm leading-relaxed italic whitespace-pre-wrap relative overflow-hidden">
                                            <span className="absolute -top-6 -right-2 text-8xl text-stone-800/40 font-black select-none uppercase tracking-tighter">Draft</span>
                                            {selectedContact.message}
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Section */}
                                {selectedContact.adminNotes && (
                                    <div className="space-y-3">
                                        <p className="text-[9px] uppercase font-black text-stone-500 tracking-widest ml-1">Internal Operations Notes</p>
                                        <div className="p-5 bg-mango-500/5 rounded-3xl border border-mango-500/10 text-stone-300 text-xs italic border-dashed">
                                            {selectedContact.adminNotes}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Action Bar */}
                            <div className="p-7 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row gap-4">
                                <a
                                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                                    className="flex-1 h-14 bg-mango-500 hover:bg-mango-600 text-stone-900 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-mango-500/20 transition-all"
                                >
                                    <FiMail className="w-4 h-4" /> Respond via Client
                                </a>
                                <button 
                                    onClick={closeModal}
                                    className="flex-1 h-14 bg-stone-800 hover:bg-stone-700 text-stone-100 font-black uppercase tracking-widest text-xs rounded-2xl transition-all border border-stone-700"
                                >
                                    Dismiss View
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
