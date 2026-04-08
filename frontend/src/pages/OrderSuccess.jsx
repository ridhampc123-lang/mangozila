import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiMail, FiMapPin, FiArrowRight, FiHome } from 'react-icons/fi';

export default function OrderSuccess() {
    const { state } = useLocation();
    const order = state?.order;

    // If there's no order in state (e.g. direct URL access), show a plain message instead of a blank screen
    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4">
                <p className="text-6xl mb-4">🥭</p>
                <h1 className="text-2xl font-black text-gray-900 mb-2">No order found</h1>
                <p className="text-gray-500 mb-6">Try tracking your order with your Order ID.</p>
                <Link to="/track" className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-bold">
                    Track Order
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-green-50/20 to-amber-50/30 pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {/* ── Success Header ── */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="text-center mb-8"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-green-200">
                        <FiCheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">Order Confirmed! 🥭</h1>
                    <p className="text-lg text-gray-600">Your fresh mangoes are being prepared.</p>
                    <div className="inline-flex items-center gap-2 mt-3 px-5 py-2 bg-amber-100 text-amber-700 rounded-full font-bold text-sm">
                        Order ID: <span className="font-mono text-base">{order.orderId}</span>
                    </div>
                </motion.div>

                {/* ── Items Ordered ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-5"
                >
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                            <FiPackage className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Items Ordered</h2>
                        <span className="ml-auto text-sm text-gray-500 font-medium">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4">
                                {/* Product image */}
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0 shadow-sm">
                                    {item.image
                                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        : <span className="flex items-center justify-center w-full h-full text-3xl">🥭</span>
                                    }
                                </div>
                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-base leading-tight truncate">{item.name}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">{item.boxSize} box · Qty: {item.quantity}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">₹{item.price} × {item.quantity}</p>
                                </div>
                                {/* Line total */}
                                <p className="font-bold text-amber-600 text-lg flex-shrink-0">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pricing breakdown */}
                    <div className="bg-gray-50 px-6 py-5 space-y-2.5">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-semibold">₹{order.pricing?.subtotal}</span>
                        </div>
                        {order.pricing?.discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span className="font-semibold">−₹{order.pricing.discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Delivery</span>
                            <span className="font-semibold">
                                {order.pricing?.deliveryCharge === 0 ? <span className="text-green-600">FREE</span> : `₹${order.pricing?.deliveryCharge}`}
                            </span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-gray-200">
                            <span className="font-black text-gray-900 text-base">Total Paid (COD)</span>
                            <span className="font-black text-xl text-amber-600">₹{order.pricing?.total}</span>
                        </div>
                        <p className="text-xs text-gray-400 text-right">Cash on Delivery · No payment needed now</p>
                    </div>
                </motion.div>

                {/* ── Delivery Address ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-5"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <FiMapPin className="w-5 h-5 text-amber-500" />
                        <p className="font-bold text-gray-900 text-sm">Delivery To</p>
                    </div>
                    <p className="font-bold text-gray-800 text-base">{order.customerInfo?.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5 leading-snug">
                        {order.deliveryAddress?.fullAddress || order.deliveryAddress?.street}, {order.deliveryAddress?.city},{' '}
                        {order.deliveryAddress?.state || 'Gujarat'} – {order.deliveryAddress?.pincode}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{order.customerInfo?.phone}</p>
                </motion.div>

                {/* ── Email notice ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-7"
                >
                    <FiMail className="text-blue-500 w-5 h-5 flex-shrink-0" />
                    <p className="text-sm text-blue-700 font-medium">Order confirmation &amp; invoice sent to <span className="font-bold">{order.customerInfo?.email}</span></p>
                </motion.div>

                {/* ── Action buttons ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <Link
                        to={`/track/${order.orderId}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-amber-200 transition-all text-base"
                    >
                        <FiPackage className="w-5 h-5" /> Track My Order <FiArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/my-orders"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all text-base"
                    >
                        <FiHome className="w-4 h-4" /> My Orders
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
