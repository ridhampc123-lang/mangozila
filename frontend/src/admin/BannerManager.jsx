import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function BannerManager() {
    const [banners, setBanners] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ label: '', title: '', subtitle: '', link: '', buttonText: 'Shop Now', position: 'hero', order: 0, isActive: true });
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetch = () => api.get('/admin/banners/all').then(({ data }) => setBanners(data || []));
    useEffect(() => { fetch(); }, []);

    const save = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Select an image');
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            fd.append('image', file);
            await api.post('/admin/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Banner created!');
            setShowForm(false);
            fetch();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const del = async (id) => {
        if (!confirm('Delete this banner?')) return;
        await api.delete(`/admin/banners/${id}`);
        toast.success('Deleted');
        fetch();
    };

    const toggle = async (b) => {
        await api.put(`/admin/banners/${b._id}`, { isActive: !b.isActive });
        toast.success(b.isActive ? 'Banner hidden' : 'Banner shown');
        fetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-stone-100 flex items-center gap-2 tracking-tight">
                        <span className="text-3xl">🖼️</span> Promotional Banners
                    </h1>
                    <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mt-1">Hero & Middle section assets</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary w-full sm:w-auto shadow-lg shadow-mango-500/10 h-12">
                    <FiPlus className="w-5 h-5" /> Launch Banner
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {banners.map((b) => (
                    <div key={b._id} className={`card overflow-hidden transition-all duration-300 group hover:border-mango-500/30 ${!b.isActive ? 'opacity-40 grayscale' : 'shadow-xl'}`}>
                        <div className="h-40 overflow-hidden relative">
                            <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-tighter border border-white/10 uppercase">
                                    {b.position}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-mango-500 uppercase tracking-widest">{b.label || 'PROMO'}</p>
                                    <p className="font-bold text-stone-100 text-lg leading-tight truncate mt-1">{b.title || 'Untitled Banner'}</p>
                                </div>
                            </div>
                            <p className="text-xs text-stone-400 mt-2 line-clamp-1">{b.subtitle || 'No subtitle provided'}</p>
                            
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-800">
                                <button onClick={() => toggle(b)} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${b.isActive ? 'border-forest-500/30 text-forest-500 bg-forest-500/5 hover:bg-forest-500/10' : 'border-stone-700 text-stone-500 bg-stone-800'}`}>
                                    {b.isActive ? 'Active' : 'Draft'}
                                </button>
                                <button onClick={() => del(b._id)} className="p-2.5 text-stone-600 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {banners.length === 0 && (
                    <div className="col-span-full py-24 card bg-stone-900/50 border-dashed border-stone-800 text-center">
                        <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">No banner assets created yet</p>
                    </div>
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-start justify-center p-4 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} 
                        className="bg-stone-900 border border-stone-800 rounded-[2.5rem] w-full max-w-md my-8 shadow-2xl">
                        <div className="flex justify-between items-center p-7 border-b border-stone-800">
                            <div>
                                <h2 className="font-black text-xl text-stone-100 uppercase tracking-tight">Banner Config</h2>
                                <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest font-black">Design & Deployment</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-3 bg-stone-800 text-stone-400 rounded-2xl hover:text-white transition-all"><FiX className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={save} className="p-7 space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Label</label><input value={form.label} onChange={(e) => setForm(f => ({ ...f, label: e.target.value }))} className="input-field py-3" placeholder="FRESH" /></div>
                                <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">CTA Label</label><input value={form.buttonText} onChange={(e) => setForm(f => ({ ...f, buttonText: e.target.value }))} className="input-field py-3" placeholder="Shop Now" /></div>
                            </div>
                            <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Headline</label><input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="input-field py-3" placeholder="ALPHONSO MANGOES" /></div>
                            <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Subtitle</label><input value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))} className="input-field py-3" placeholder="Hand-picked from Ratnagiri..." /></div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Position</label>
                                    <select value={form.position} onChange={(e) => setForm(f => ({ ...f, position: e.target.value }))} className="input-field py-3 bg-stone-800/50 appearance-none">
                                        <option value="hero">Hero Section</option><option value="middle">Mid-page</option><option value="bottom">Footer Top</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Priority Order</label><input type="number" value={form.order} onChange={(e) => setForm(f => ({ ...f, order: e.target.value }))} className="input-field py-3" /></div>
                            </div>
                            <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Visual Asset *</label><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field py-3 text-[11px] file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-stone-700 file:text-stone-300" /></div>
                            <button type="submit" disabled={saving} className="btn-primary w-full h-14 justify-center shadow-lg shadow-mango-500/10 font-black uppercase tracking-widest text-xs mt-4">
                                {saving ? 'Uploading to cloud...' : 'Publish Banner'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
