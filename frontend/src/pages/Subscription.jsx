import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PLANS = [
    { size: '5kg', label: 'Starter Box', freq: 'weekly', price: 399, features: ['5kg Premium Mangoes', 'Weekly delivery', 'Free delivery', 'Cancel anytime'] },
    { size: '10kg', label: 'Family Box', freq: 'weekly', price: 749, popular: true, features: ['10kg Mixed Varieties', 'Weekly delivery', 'Priority support', 'Free delivery', '2x loyalty points'] },
    { size: '20kg', label: 'Bulk Box', freq: 'weekly', price: 1399, features: ['20kg Farm Fresh', 'Flexible schedule', 'Dedicated support', 'Free delivery', 'Max rewards'] },
];

export default function Subscription() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mangoes, setMangoes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [mangoId, setMangoId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [slot, setSlot] = useState('morning');

    useEffect(() => { api.get('/mangoes?limit=20').then(({ data }) => setMangoes(data.mangoes || [])); }, []);

    const minDate = new Date(); minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split('T')[0];

    const subscribe = async () => {
        if (!user) { toast.error('Please login to subscribe'); navigate('/login'); return; }
        if (!mangoId || !startDate) return toast.error('Select mango and start date');
        try {
            await api.post('/subscriptions', { mangoId, boxSize: selected.size, frequency: selected.freq, deliverySlot: slot, startDate, deliveryAddress: { street: 'My address' } });
            toast.success('Subscription created! 🥭');
            navigate('/profile');
        } catch (err) { toast.error(err.message); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Subscribe & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Save</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get fresh mangoes delivered regularly at special prices</p>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {PLANS.map((plan, i) => (
                        <motion.div key={i} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }}
                            onClick={() => setSelected(plan)}
                            className={`relative bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transition-all border-3 ${
                                selected?.size === plan.size 
                                    ? 'border-amber-500 ring-4 ring-amber-200' 
                                    : plan.popular 
                                    ? 'border-amber-300' 
                                    : 'border-gray-200 hover:border-amber-300'
                            }`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                                        ⭐ Most Popular
                                    </span>
                                </div>
                            )}
                            {selected?.size === plan.size && (
                                <div className="absolute top-6 right-6 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                    <FiCheck className="w-6 h-6 text-white" />
                                </div>
                            )}
                            <div className="text-center mb-8">
                                <div className="text-7xl mb-4">🥭</div>
                                <h3 className="font-bold text-2xl text-gray-900 mb-2">{plan.label}</h3>
                                <p className="text-gray-600 font-medium">{plan.size} · {plan.freq}</p>
                                <div className="mt-6">
                                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                                        ₹{plan.price}
                                    </p>
                                    <p className="text-gray-500 font-medium mt-1">/week</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-base text-gray-700">
                                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FiCheck className="w-4 h-4 text-green-600" />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Configure */}
                {selected && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-100"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Configure Your {selected.label}</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="text-base text-gray-700 font-semibold mb-3 block">Select Mango Variety</label>
                                <select 
                                    value={mangoId} 
                                    onChange={(e) => setMangoId(e.target.value)} 
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none transition-all text-gray-900 font-medium"
                                >
                                    <option value="">Choose a variety...</option>
                                    {mangoes.map((m) => <option key={m._id} value={m._id}>{m.name} ({m.variety})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-base text-gray-700 font-semibold mb-3 block">Start Date</label>
                                <input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                    min={minDateStr} 
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none transition-all text-gray-900 font-medium" 
                                />
                            </div>
                            <div>
                                <label className="text-base text-gray-700 font-semibold mb-3 block">Preferred Delivery Slot</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[['morning', '🌅 Morning'], ['afternoon', '☀️ Afternoon'], ['evening', '🌆 Evening']].map(([s, label]) => (
                                        <button 
                                            key={s} 
                                            type="button" 
                                            onClick={() => setSlot(s)}
                                            className={`py-4 text-base font-semibold rounded-2xl border-2 transition-all transform hover:scale-105 ${
                                                slot === s 
                                                    ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700' 
                                                    : 'border-gray-200 text-gray-600 hover:border-amber-300'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl flex justify-between items-center">
                            <span className="text-gray-700 text-lg font-semibold">Weekly Total</span>
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">₹{selected.price}</span>
                        </div>
                        <button 
                            onClick={subscribe} 
                            className="w-full mt-6 px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 text-xl flex items-center justify-center gap-2"
                        >
                            Subscribe Now →
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
