import { useState, useEffect } from 'react';
import { FiCheck, FiTrash2, FiMessageSquare, FiStar, FiClock, FiUser, FiPackage } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ReviewManager() {
    const [tab, setTab] = useState('pending');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetch = (approved) => {
        setLoading(true);
        api.get(`/reviews?approved=${approved}`).then(({ data }) => setReviews(data || [])).finally(() => setLoading(false));
    };

    useEffect(() => { fetch(tab === 'approved'); }, [tab]);

    const approve = async (id) => {
        await api.put(`/reviews/${id}/approve`);
        toast.success('Review approved!');
        fetch(false);
    };

    const del = async (id) => {
        if (!confirm('Delete this review?')) return;
        await api.delete(`/reviews/${id}`);
        toast.success('Deleted');
        fetch(tab === 'approved');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-black text-stone-100 flex items-center gap-3 tracking-tight">
                        <FiMessageSquare className="text-mango-500 w-8 h-8" />
                        Feedback Stream
                    </h1>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mt-1">{reviews.length} customer testimonials queued</p>
                </div>
                {/* Tabs */}
                <div className="flex bg-stone-900 border border-stone-800 p-1.5 rounded-2xl w-full sm:w-auto self-stretch sm:self-auto shadow-inner">
                    {[
                        { id: 'pending', label: 'Validation Queue' }, 
                        { id: 'approved', label: 'Public Display' }
                    ].map((t) => (
                        <button 
                            key={t.id} 
                            onClick={() => setTab(t.id)}
                            className={`flex-1 sm:px-6 py-2.5 rounded-[0.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                                tab === t.id 
                                    ? 'bg-mango-500 text-stone-900 shadow-lg shadow-mango-500/20' 
                                    : 'text-stone-500 hover:text-stone-300'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Feed */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 rounded-[2rem] shimmer" />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-24 card bg-stone-900/50 border-dashed border-stone-800">
                    <FiStar className="w-12 h-12 mx-auto text-stone-800 mb-4 stroke-1" />
                    <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">No {tab} feedback found in system</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {reviews.map((r) => (
                        <div key={r._id} className="card p-6 overflow-hidden group hover:border-mango-500/30 transition-all duration-300 shadow-xl">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    {/* Stars & Entity Meta */}
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex gap-1 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar 
                                                    key={i} 
                                                    className={`w-4 h-4 ${i < r.rating ? 'text-mango-500 fill-mango-500' : 'text-stone-800'}`} 
                                                />
                                            ))}
                                        </div>
                                        <div className="h-4 w-px bg-stone-800 hidden sm:block" />
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                            <FiUser className="text-mango-500" />
                                            <span className="text-stone-100 font-black italic">{r.user?.name || r.guestName || 'Anonymous Agent'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                            <FiPackage className="text-stone-600" />
                                            <span className="text-stone-500">{r.mango?.name || 'Unknown Unit'}</span>
                                        </div>
                                    </div>

                                    {/* Comment Block */}
                                    <div>
                                        <p className="text-lg font-black text-stone-100 tracking-tight leading-tight italic">"{r.title}"</p>
                                        <p className="text-sm text-stone-400 mt-2 leading-relaxed font-medium">{r.comment}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-600">
                                        <FiClock />
                                        <span>Logged {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Actions Console */}
                                <div className="flex lg:flex-col gap-3 lg:w-16 border-t lg:border-t-0 lg:border-l border-stone-800/50 pt-4 lg:pt-0 lg:pl-6 items-center justify-center lg:justify-start">
                                    {tab === 'pending' && (
                                        <button 
                                            onClick={() => approve(r._id)} 
                                            className="w-full h-12 lg:h-12 bg-forest-500/10 hover:bg-forest-500 text-forest-400 hover:text-stone-900 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-forest-500/20"
                                            title="Validate Testimonial"
                                        >
                                            <FiCheck className="w-5 h-5 font-black" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => del(r._id)} 
                                        className="w-full h-12 lg:h-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-stone-900 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-red-500/20"
                                        title="Purge Record"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
