import { useEffect, useState, useRef } from 'react';
import { FiPlus, FiX, FiPercent, FiDollarSign, FiCalendar, FiTag } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function CouponManager() {
    const [coupons, setCoupons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ 
        code: '', 
        description: '', 
        discountType: 'percentage', 
        discountValue: '', 
        minOrderAmount: '', 
        maxDiscountAmount: '', 
        usageLimit: '', 
        validUntil: '', 
        isActive: true 
    });
    const [saving, setSaving] = useState(false);
    const codeInputRef = useRef(null);

    const fetch = () => api.get('/coupons').then(({ data }) => setCoupons(data));
    useEffect(() => { fetch(); }, []);

    // Auto-focus code input when form opens
    useEffect(() => {
        if (showForm && codeInputRef.current) {
            setTimeout(() => codeInputRef.current.focus(), 100);
        }
    }, [showForm]);

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/coupons', form);
            toast.success('Coupon created successfully!');
            setShowForm(false);
            setForm({ 
                code: '', 
                description: '', 
                discountType: 'percentage', 
                discountValue: '', 
                minOrderAmount: '', 
                maxDiscountAmount: '', 
                usageLimit: '', 
                validUntil: '', 
                isActive: true 
            });
            fetch();
        } catch (err) { 
            toast.error(err.response?.data?.message || 'Failed to create coupon'); 
        } finally { 
            setSaving(false); 
        }
    };

    const del = async (id) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            toast.success('Coupon deleted');
            fetch();
        } catch {
            toast.error('Failed to delete coupon');
        }
    };

    const closeModal = () => {
        setShowForm(false);
        setForm({ 
            code: '', 
            description: '', 
            discountType: 'percentage', 
            discountValue: '', 
            minOrderAmount: '', 
            maxDiscountAmount: '', 
            usageLimit: '', 
            validUntil: '', 
            isActive: true 
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-black text-stone-100 flex items-center gap-3 tracking-tight">
                        <FiTag className="text-mango-500 w-8 h-8" />
                        Discount Engine
                    </h1>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mt-1">{coupons.length} promotional codes active</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)} 
                    className="w-full sm:w-auto px-6 h-12 bg-mango-500 hover:bg-mango-600 text-stone-900 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-mango-500/20"
                >
                    <FiPlus className="w-4 h-4" /> Create New Coupon
                </button>
            </div>

            {/* Metrics Row (Small) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total active', val: coupons.filter(c => c.isActive).length, icon: FiTag, color: 'text-mango-500' },
                    { label: 'Expirations', val: coupons.filter(c => c.validUntil && new Date(c.validUntil) < new Date()).length, icon: FiCalendar, color: 'text-red-500' }
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

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((c) => (
                    <div key={c._id} className="card overflow-hidden group hover:border-mango-500/30 transition-all duration-300 shadow-2xl">
                        {/* Card Header Layer */}
                        <div className="p-5 border-b border-stone-800/50 bg-stone-800/20 flex justify-between items-start">
                            <div>
                                <span className="px-3 py-1 bg-black/40 text-mango-500 font-mono text-base font-black tracking-[0.2em] rounded-lg border border-mango-500/20 shadow-inner">
                                    {c.code}
                                </span>
                                <p className="text-[10px] text-stone-500 uppercase font-black mt-2 tracking-widest">{c.discountType} discount</p>
                            </div>
                            <button onClick={() => del(c._id)} className="p-2 text-stone-600 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-4">
                            <p className="text-xs text-stone-300 font-medium leading-relaxed italic">{c.description || 'No system description provided'}</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] uppercase font-black text-stone-600 tracking-tighter">Value</p>
                                    <p className="text-xl font-black text-stone-100 italic">
                                        {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] uppercase font-black text-stone-600 tracking-tighter">Threshold</p>
                                    <p className="text-xl font-black text-stone-100 italic">₹{c.minOrderAmount}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-stone-800/50 flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] uppercase font-black text-stone-500 tracking-widest mb-1.5">Usage Volume</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-stone-700/50 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-mango-500 shadow-[0_0_8px_rgba(242,156,33,0.4)]" 
                                                style={{ width: c.usageLimit ? `${(c.usedCount / c.usageLimit) * 100}%` : '10%' }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-stone-400">{c.usedCount}/{c.usageLimit || '∞'}</span>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                                    c.isActive ? 'border-forest-500/30 text-forest-400 bg-forest-500/5' : 'border-stone-700 text-stone-500'
                                }`}>
                                    {c.isActive ? 'Live' : 'Vaulted'}
                                </div>
                            </div>
                        </div>

                        {/* Expiry Bar */}
                        {c.validUntil && (
                            <div className="px-5 py-2 bg-stone-800/40 flex items-center gap-2 border-t border-stone-800/20">
                                <FiCalendar className="w-3 h-3 text-stone-500" />
                                <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
                                    Expires {new Date(c.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
                {coupons.length === 0 && (
                    <div className="col-span-full py-24 text-center card bg-stone-900/50 border-dashed border-stone-800">
                        <FiTag className="w-12 h-12 mx-auto text-stone-800 mb-4 stroke-1" />
                        <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">No discount protocols established</p>
                    </div>
                )}
            </div>

            {/* Coupon Creation Modal Overlay */}
            <AnimatePresence>
                {showForm && (
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
                                    <h2 className="text-xl font-black text-stone-100 uppercase tracking-tighter">Coupon Protocol</h2>
                                    <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest font-black">Configure a new atmospheric discount code</p>
                                </div>
                                <button onClick={closeModal} className="p-3 bg-stone-800 text-stone-400 rounded-2xl hover:text-white transition-all"><FiX className="w-5 h-5" /></button>
                            </div>

                            {/* Modal Content - Form */}
                            <form onSubmit={save} className="p-7 space-y-8">
                                {/* Coupon Key Definition */}
                                <div className="p-6 bg-stone-800/30 rounded-3xl border border-stone-800/50 space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-stone-500 tracking-[0.2em] mb-3 block">Access Code</label>
                                        <input
                                            ref={codeInputRef}
                                            type="text"
                                            required
                                            value={form.code}
                                            onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }))}
                                            placeholder="E.G. MANGO50"
                                            className="w-full bg-black/40 border-2 border-stone-800 focus:border-mango-500/50 text-mango-500 text-3xl font-black italic tracking-[0.2em] px-5 py-4 rounded-2xl transition-all outline-none uppercase"
                                            maxLength="20"
                                        />
                                        <p className="text-[9px] text-stone-500 mt-2 italic font-medium">Alphanumeric strings only. This key will be used by the customer during checkout.</p>
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-stone-500 tracking-[0.2em] mb-2 block">Visual Description</label>
                                        <textarea
                                            value={form.description}
                                            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                                            placeholder="Provide context for this incentive..."
                                            className="input-field w-full resize-none py-4 px-5 text-stone-300 text-xs italic bg-stone-800/20"
                                            rows="2"
                                            maxLength="200"
                                        />
                                    </div>
                                </div>

                                {/* Economic Logic */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-black text-stone-500 tracking-[0.2em] mb-2 block ml-1">Calculation Logic</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'percentage', label: 'Scaling %', icon: FiPercent },
                                                { id: 'flat', label: 'Fixed ₹', icon: FiDollarSign }
                                            ].map((type) => (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setForm(f => ({ ...f, discountType: type.id }))}
                                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all group ${
                                                        form.discountType === type.id 
                                                            ? 'border-mango-500 bg-mango-500/10 shadow-[0_0_20px_rgba(242,156,33,0.1)]' 
                                                            : 'border-stone-800 bg-stone-800/20 hover:border-stone-700'
                                                    }`}
                                                >
                                                    <type.icon className={`w-5 h-5 ${form.discountType === type.id ? 'text-mango-500' : 'text-stone-600 transition-colors group-hover:text-stone-400'}`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${form.discountType === type.id ? 'text-stone-100' : 'text-stone-500'}`}>{type.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-black text-stone-500 tracking-[0.2em] mb-2 block ml-1">Numerical Value</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                required
                                                value={form.discountValue}
                                                onChange={(e) => setForm(f => ({ ...f, discountValue: e.target.value }))}
                                                className="input-field w-full h-16 text-2xl font-black italic px-6 bg-stone-800/40 border-stone-800"
                                                min="0"
                                                max={form.discountType === 'percentage' ? '100' : undefined}
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-500 font-black text-xs uppercase tracking-widest pointer-events-none">
                                                {form.discountType === 'percentage' ? 'Percent' : 'Rupees'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Operational Constraints */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-stone-500 tracking-[0.2em] mb-2 block ml-1">Order Floor (₹)</label>
                                        <input
                                            type="number"
                                            value={form.minOrderAmount}
                                            onChange={(e) => setForm(f => ({ ...f, minOrderAmount: e.target.value }))}
                                            className="input-field w-full h-12 text-xs font-bold"
                                            placeholder="Minimum spend required"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-black text-stone-500 tracking-[0.2em] mb-2 block ml-1">Saturation Limit</label>
                                        <input
                                            type="number"
                                            value={form.usageLimit}
                                            onChange={(e) => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                                            className="input-field w-full h-12 text-xs font-bold"
                                            placeholder="Max total applications"
                                        />
                                    </div>
                                </div>

                                {/* Temporal Window */}
                                <div>
                                    <label className="text-[10px] uppercase font-black text-stone-500 tracking-[0.2em] mb-2 block ml-1">Phaseline Termination</label>
                                    <div className="relative">
                                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                                        <input
                                            type="date"
                                            value={form.validUntil}
                                            onChange={(e) => setForm(f => ({ ...f, validUntil: e.target.value }))}
                                            className="input-field w-full h-12 pl-12 text-xs font-bold"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                {/* Action Console */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-stone-800">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 h-14 bg-stone-800 hover:bg-stone-700 text-stone-300 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all border border-stone-700"
                                    >
                                        Abort Request
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving || !form.code || !form.discountValue}
                                        className="flex-1 h-14 bg-mango-500 hover:bg-mango-600 disabled:opacity-30 text-stone-900 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-mango-500/20"
                                    >
                                        {saving ? 'Processing...' : 'Engage Discount'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
