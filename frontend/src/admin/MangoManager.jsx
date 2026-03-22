import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function MangoManager() {
    const [mangoes, setMangoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', variety: '', description: '', farmLocation: '', isFeatured: false, isBestSeller: false, isPreBookable: false, boxOptions: [] });
    const [files, setFiles] = useState([]);
    const [saving, setSaving] = useState(false);

    const fetch = () => {
        setLoading(true);
        api.get('/mangoes?limit=50').then(({ data }) => setMangoes(data.mangoes || [])).finally(() => setLoading(false));
    };

    useEffect(() => { fetch(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: '', variety: '', description: '', farmLocation: '', isFeatured: false, isBestSeller: false, isPreBookable: false, boxOptions: [{ size: '5kg', price: '', stock: '' }] });
        setFiles([]);
        setShowForm(true);
    };

    const openEdit = (m) => {
        setEditing(m);
        setForm({ name: m.name, variety: m.variety, description: m.description, farmLocation: m.farmLocation, isFeatured: m.isFeatured, isBestSeller: m.isBestSeller, isPreBookable: m.isPreBookable, boxOptions: m.boxOptions || [] });
        setFiles([]);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (['boxOptions'].includes(k)) fd.append(k, JSON.stringify(v));
                else if (typeof v === 'boolean') fd.append(k, v);
                else fd.append(k, v);
            });
            files.forEach((f) => fd.append('images', f));

            if (editing) await api.put(`/mangoes/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            else await api.post('/mangoes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

            toast.success(editing ? 'Mango updated!' : 'Mango created!');
            setShowForm(false);
            fetch();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const deleteMango = async (id) => {
        if (!confirm('Delete this mango?')) return;
        await api.delete(`/mangoes/${id}`);
        toast.success('Deleted');
        fetch();
    };

    const updateBox = (i, field, val) => {
        const boxes = [...form.boxOptions];
        boxes[i] = { ...boxes[i], [field]: val };
        setForm((f) => ({ ...f, boxOptions: boxes }));
    };

    const addBox = () => setForm((f) => ({ ...f, boxOptions: [...f.boxOptions, { size: '10kg', price: '', stock: '' }] }));
    const removeBox = (i) => setForm((f) => ({ ...f, boxOptions: f.boxOptions.filter((_, idx) => idx !== i) }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-100 flex items-center gap-2">
                        <span className="text-3xl">🥭</span> Mango Products
                    </h1>
                    <p className="text-stone-400 text-sm mt-1">{mangoes.length} products total</p>
                </div>
                <button onClick={openCreate} className="btn-primary w-full sm:w-auto shadow-lg shadow-mango-500/10">
                    <FiPlus className="w-5 h-5" /> Add New Mango
                </button>
            </div>

            {/* Table wrapper */}
            {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-2xl shimmer" />)}</div>
            ) : mangoes.length === 0 ? (
                <div className="text-center py-20 card bg-stone-900/50">
                    <p className="text-5xl mb-4 opacity-40">🥭</p>
                    <p className="text-stone-400 font-medium">No mangoes yet. Add your first product!</p>
                </div>
            ) : (
                <div className="card overflow-hidden border-stone-800 shadow-2xl">
                    <div className="responsive-table-container">
                        <table className="w-full text-sm min-w-[800px]">
                            <thead>
                                <tr className="border-b border-stone-800 bg-stone-800/20 text-[10px] uppercase font-black tracking-widest text-stone-500">
                                    <th className="p-5 text-left">Product Details</th>
                                    <th className="p-5 text-left">Variety</th>
                                    <th className="p-5 text-left">Inventory & Pricing</th>
                                    <th className="p-5 text-left">Status Tags</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800/50">
                                {mangoes.map((m) => (
                                    <tr key={m._id} className="hover:bg-stone-800/30 transition-all group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-stone-800 rounded-xl overflow-hidden shadow-inner flex-shrink-0 flex items-center justify-center border border-stone-700/50">
                                                    {m.images?.[0] ? 
                                                        <img src={m.images[0]} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : 
                                                        <span className="text-2xl">🥭</span>
                                                    }
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-stone-100 truncate">{m.name}</p>
                                                    <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold mt-0.5">{m.farmLocation || 'Orchard location'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-stone-300 font-medium">Alphonso {m.variety}</td>
                                        <td className="p-5">
                                            <div className="space-y-1">
                                                {m.boxOptions?.map((b) => (
                                                    <div key={b.size} className="flex items-center gap-2 text-xs">
                                                        <span className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-400 font-bold uppercase tracking-tight">{b.size}</span>
                                                        <span className="text-mango-400 font-black">₹{b.price}</span>
                                                        <span className={`text-[10px] font-bold ${b.stock > 10 ? 'text-stone-500' : 'text-red-400'}`}>({b.stock} left)</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                                                {m.isFeatured && <span className="px-2 py-0.5 bg-mango-500/10 text-mango-400 border border-mango-500/20 rounded-md text-[10px] font-black uppercase">Staff Pick</span>}
                                                {m.isBestSeller && <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md text-[10px] font-black uppercase">Viral</span>}
                                                {m.isPreBookable && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[10px] font-black uppercase">Booking</span>}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => openEdit(m)} className="p-2.5 text-stone-400 hover:text-mango-400 hover:bg-mango-500/10 rounded-xl transition-all shadow-sm"><FiEdit className="w-4 h-4" /></button>
                                                <button onClick={() => deleteMango(m._id)} className="p-2.5 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all shadow-sm"><FiTrash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-start justify-center p-4 overflow-y-auto custom-scrollbar-dark">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-stone-900 border border-stone-800 rounded-[2rem] w-full max-w-2xl my-4 sm:my-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                        <div className="flex justify-between items-center p-6 border-b border-stone-800">
                            <div>
                                <h2 className="font-black text-xl text-stone-100">{editing ? 'Edit Product' : 'New Mango Entry'}</h2>
                                <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest font-bold">Product Catalog Editor</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-3 bg-stone-800 rounded-2xl text-stone-400 hover:text-stone-100 transition-all"><FiX className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Product Name *</label><input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Premium Kesar Mangoes" /></div>
                                    <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Mango Variety *</label><input required value={form.variety} onChange={(e) => setForm((f) => ({ ...f, variety: e.target.value }))} className="input-field" placeholder="Kesar" /></div>
                                </div>
                                <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Orchard Location</label><input value={form.farmLocation} onChange={(e) => setForm((f) => ({ ...f, farmLocation: e.target.value }))} className="input-field" placeholder="Talala, Gir, Gujarat" /></div>
                                <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Product Description *</label><textarea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field resize-none py-3" placeholder="Describe the taste, aroma, and origin..." /></div>
                            </div>

                            {/* Box Options */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-mango-400">Inventory & Pricing Config</label>
                                    <button type="button" onClick={addBox} className="text-xs font-black text-mango-500 hover:text-mango-400 flex items-center gap-1.5 px-3 py-1.5 bg-mango-500/5 rounded-lg border border-mango-500/10 transition-all">+ Add Option</button>
                                </div>
                                <div className="space-y-3">
                                    {form.boxOptions.map((box, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row gap-3 p-4 bg-stone-800/20 rounded-2xl border border-stone-800/50 relative group">
                                            <div className="flex-1 grid grid-cols-3 gap-3">
                                                <div className="space-y-1"><label className="text-[9px] uppercase font-bold text-stone-600 ml-1">Size</label>
                                                    <select value={box.size} onChange={(e) => updateBox(i, 'size', e.target.value)} className="input-field py-1.5 text-xs">
                                                        {['5kg', '10kg', '20kg'].map((s) => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-1"><label className="text-[9px] uppercase font-bold text-stone-600 ml-1">Price (₹)</label>
                                                    <input type="number" placeholder="0" value={box.price} onChange={(e) => updateBox(i, 'price', e.target.value)} className="input-field py-1.5 text-xs text-mango-400 font-bold" />
                                                </div>
                                                <div className="space-y-1"><label className="text-[9px] uppercase font-bold text-stone-600 ml-1">Stock</label>
                                                    <input type="number" placeholder="0" value={box.stock} onChange={(e) => updateBox(i, 'stock', e.target.value)} className="input-field py-1.5 text-xs" />
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removeBox(i)} className="sm:mt-5 p-2 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all self-end sm:self-auto"><FiX className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="flex flex-wrap gap-4 px-1 py-2">
                                {[['isFeatured', 'Staff Pick'], ['isBestSeller', 'Best Seller'], ['isPreBookable', 'Pre-Booking Only']].map(([key, label]) => (
                                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} className="accent-mango-500 w-5 h-5 rounded-lg" />
                                        <span className="text-xs font-black uppercase tracking-wider text-stone-400 group-hover:text-stone-200 transition-colors">{label}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Images */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 ml-1">Product Images</label>
                                <div className="relative group">
                                    <input type="file" multiple accept="image/*" onChange={(e) => setFiles([...e.target.files])} className="input-field text-xs py-3 cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-stone-700 file:text-stone-300 hover:file:bg-stone-600" />
                                </div>
                                {files.length > 0 && <p className="text-[10px] font-bold text-mango-400 mt-2 px-1 flex items-center gap-1.5">✅ {files.length} Photo{files.length !== 1 ? 's' : ''} Ready to Upload</p>}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                <button type="submit" disabled={saving} className="btn-primary flex-1 shadow-lg shadow-mango-500/10 h-14 uppercase tracking-widest text-xs font-black">{saving ? 'Processing Entry...' : editing ? 'Deploy Updates' : 'Launch Product'}</button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary sm:w-32 h-14 !bg-transparent !border-stone-800 text-stone-400 hover:text-stone-200 uppercase tracking-widest text-xs font-black transition-all">Abort</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
