import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiPackage, FiTruck, FiHome } from 'react-icons/fi';
import api from '../services/api';

const STAGES = [
    { key: 'placed', label: 'Order Placed', icon: '📋', desc: 'Your order has been received' },
    { key: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Order confirmed by team' },
    { key: 'packed', label: 'Packed', icon: '📦', desc: 'Mangoes carefully packed' },
    { key: 'shipped', label: 'Shipped', icon: '🚚', desc: 'On the way to your city' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🏍️', desc: 'Our rider is on the way' },
    { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Enjoy your fresh mangoes!' },
];

export default function OrderTracking() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [inputId, setInputId] = useState('');

    useEffect(() => {
        if (orderId) fetchOrder(orderId);
        else setLoading(false);
    }, [orderId]);

    const fetchOrder = async (id) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/orders/track/${id}`);
            setOrder(data);
            setNotFound(false);
        } catch {
            setNotFound(true);
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const currentStageIdx = order ? STAGES.findIndex((s) => s.key === order.status) : -1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Track Your Order</h1>
                    <p className="text-xl text-gray-600">Real-time delivery updates</p>
                </div>

                {/* Search */}
                {!orderId && (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border-2 border-gray-100">
                        <label className="text-lg font-bold text-gray-900 mb-4 block">Enter Order ID</label>
                        <div className="flex gap-4">
                            <input 
                                value={inputId} 
                                onChange={(e) => setInputId(e.target.value.toUpperCase())} 
                                placeholder="e.g. MZAB1234CD" 
                                className="flex-1 px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none transition-all text-gray-900 font-semibold uppercase" 
                            />
                            <button onClick={() => fetchOrder(inputId)} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105">Track →</button>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-32">
                        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <p className="text-xl text-gray-600 font-medium">Finding your order...</p>
                    </div>
                )}

                {notFound && (
                    <div className="text-center py-32">
                        <p className="text-8xl mb-6">😕</p>
                        <p className="text-3xl font-bold text-gray-900 mb-3">Order not found</p>
                        <p className="text-lg text-gray-600 mb-8">Check the order ID and try again</p>
                        <Link to="/" className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105">Back to Home</Link>
                    </div>
                )}

                {order && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Order Header */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-2 border-gray-100">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold mb-1">Order ID</p>
                                    <p className="text-xl font-bold text-amber-600 font-mono">#{order.orderId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold mb-1">Placed on</p>
                                    <p className="text-base text-gray-700 font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold mb-1">Delivery Slot</p>
                                    <p className="text-base text-gray-700 font-medium">
                                        {order.deliverySlot?.date ? new Date(order.deliverySlot.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'} ·{' '}
                                        {{ morning: '9AM–12PM', afternoon: '12PM–4PM', evening: '4PM–8PM' }[order.deliverySlot?.slot] || ''}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold mb-1">Status</p>
                                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold border-2 ${
                                        order.status === 'delivered' ? 'border-green-500 bg-green-100 text-green-700' :
                                        order.status === 'cancelled' ? 'border-red-500 bg-red-100 text-red-700' :
                                        'border-amber-500 bg-amber-100 text-amber-700'
                                    }`}>
                                        {order.status.replace(/_/g, ' ').toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Timeline */}
                        {order.status !== 'cancelled' && (
                            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-2 border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Delivery Progress</h2>
                                <div className="relative">
                                    {/* Progress bar */}
                                    <div className="absolute left-7 top-7 bottom-7 w-1 bg-gray-200 rounded-full" />
                                    <div
                                        className="absolute left-7 top-7 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                                        style={{ height: `${Math.min(100, (currentStageIdx / (STAGES.length - 1)) * 100)}%` }}
                                    />

                                    <div className="space-y-8">
                                        {STAGES.map((stage, i) => {
                                            const isDone = i <= currentStageIdx;
                                            const isCurrent = i === currentStageIdx;
                                            return (
                                                <div key={stage.key} className="flex items-start gap-6 relative">
                                                    <motion.div
                                                        initial={{ scale: 0.8 }} 
                                                        animate={{ scale: isDone ? 1 : 0.8 }}
                                                        className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 transition-all shadow-lg ${
                                                            isCurrent ? 'bg-gradient-to-br from-amber-500 to-orange-500 ring-4 ring-amber-200' :
                                                            isDone ? 'bg-gradient-to-br from-amber-400 to-orange-400' : 'bg-gray-200 border-2 border-gray-300'
                                                        }`}
                                                    >
                                                        {isDone ? <span className="text-2xl">{stage.icon}</span> : <span className="text-gray-500 font-bold">{i + 1}</span>}
                                                    </motion.div>
                                                    <div className={`pt-2 ${isDone ? '' : 'opacity-50'}`}>
                                                        <p className={`font-bold text-lg ${isCurrent ? 'text-amber-600' : isDone ? 'text-gray-900' : 'text-gray-400'}`}>{stage.label}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{stage.desc}</p>
                                                        {isCurrent && order.statusHistory?.find((h) => h.status === stage.key)?.timestamp && (
                                                            <p className="text-sm text-amber-600 font-medium mt-2">
                                                                {new Date(order.statusHistory.find((h) => h.status === stage.key).timestamp).toLocaleString('en-IN')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-2 border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Items Ordered</h3>
                            <div className="space-y-4">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b-2 border-gray-100 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0">
                                                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span className="text-3xl flex items-center justify-center w-full h-full">🥭</span>}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">{item.boxSize} × {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-xl text-amber-600 font-bold">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between pt-6 mt-4 border-t-2 border-gray-200">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">₹{order.pricing?.total}</span>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                    <FiHome className="text-white w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Delivery To</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg text-gray-900 font-semibold">{order.customerInfo?.name}</p>
                                <p className="text-base text-gray-700">{order.deliveryAddress?.fullAddress || order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}</p>
                                <p className="text-base text-gray-700 font-medium">{order.customerInfo?.phone}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
