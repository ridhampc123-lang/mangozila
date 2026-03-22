import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiChevronDown, FiChevronUp, FiMapPin, FiArrowRight, FiShoppingBag, FiX } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ── Guest Orders (reads from localStorage order IDs) ──────────────────
function GuestOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const ids = (() => {
            try { return JSON.parse(localStorage.getItem('mz_guest_orders') || '[]'); }
            catch { return []; }
        })();
        if (ids.length === 0) { Promise.resolve().then(() => setLoading(false)); return; }
        Promise.all(ids.map((id) => orderAPI.track(id).then((r) => r.data).catch(() => null)))
            .then((results) => { if (!cancelled) setOrders(results.filter(Boolean)); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    if (loading) return (
        <div className="space-y-4">
            {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
                    <div className="flex gap-2"><div className="h-8 w-24 bg-gray-100 rounded-xl" /></div>
                </div>
            ))}
        </div>
    );

    if (orders.length === 0) return (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">🥭</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-500 text-sm mb-6">Place an order and it will appear here automatically.</p>
            <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all">
                Shop Mangoes <FiArrowRight />
            </Link>
        </div>
    );

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            {orders.map((order) => (
                <OrderCard
                    key={order._id}
                    order={order}
                    onCancelled={(orderId) => setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status: 'cancelled' } : o))}
                />
            ))}
        </div>
    );
}

const STATUS_CONFIG = {
    placed:           { label: 'Order Placed',      color: 'bg-blue-100 text-blue-700 border-blue-200' },
    confirmed:        { label: 'Confirmed',          color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    packed:           { label: 'Packed',             color: 'bg-amber-100 text-amber-700 border-amber-200' },
    shipped:          { label: 'Shipped',            color: 'bg-orange-100 text-orange-700 border-orange-200' },
    out_for_delivery: { label: 'Out for Delivery',   color: 'bg-purple-100 text-purple-700 border-purple-200' },
    delivered:        { label: 'Delivered',          color: 'bg-green-100 text-green-700 border-green-200' },
    cancelled:        { label: 'Cancelled',          color: 'bg-red-100 text-red-700 border-red-200' },
};

function OrderCard({ order: initialOrder, onCancelled }) {
    const [order, setOrder] = useState(initialOrder);
    const [expanded, setExpanded] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const status = STATUS_CONFIG[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700 border-gray-200' };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        setCancelling(true);
        try {
            await orderAPI.cancelOrder(order.orderId);
            const updated = { ...order, status: 'cancelled' };
            setOrder(updated);
            onCancelled?.(order.orderId);
            toast.success('Order cancelled successfully');
        } catch (err) {
            toast.error(err?.message || 'Could not cancel order');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
            {/* Order header row */}
            <div className="px-5 py-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-amber-600 text-sm">#{order.orderId}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.color}`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="font-black text-gray-900 text-lg">₹{order.pricing?.total}</span>
                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 transition-all"
                        aria-label="Toggle details"
                    >
                        {expanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Product thumbnails preview (always visible) */}
            <div className="px-5 pb-4 flex gap-2 flex-wrap">
                {order.items?.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-1.5">
                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-amber-100 flex-shrink-0">
                            {item.image
                                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                : <span className="flex items-center justify-center w-full h-full text-sm">🥭</span>
                            }
                        </div>
                        <span className="text-xs font-semibold text-gray-700 max-w-[90px] truncate">{item.name}</span>
                    </div>
                ))}
                {(order.items?.length || 0) > 4 && (
                    <div className="flex items-center px-3 py-1.5 bg-gray-50 rounded-xl text-xs text-gray-500 font-semibold">
                        +{order.items.length - 4} more
                    </div>
                )}
            </div>

            {/* Expanded details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-gray-100"
                    >
                        {/* Items list */}
                        <div className="px-5 pt-4 space-y-3">
                            {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0">
                                        {item.image
                                            ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            : <span className="flex items-center justify-center w-full h-full text-2xl">🥭</span>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.boxSize} box · Qty {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-amber-600 text-sm flex-shrink-0">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        {/* Pricing summary */}
                        <div className="mx-5 my-4 bg-gray-50 rounded-xl p-4 text-sm space-y-1.5">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span><span className="font-semibold">₹{order.pricing?.subtotal}</span>
                            </div>
                            {order.pricing?.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span><span className="font-semibold">−₹{order.pricing.discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery</span>
                                <span className="font-semibold">
                                    {order.pricing?.deliveryCharge === 0
                                        ? <span className="text-green-600">FREE</span>
                                        : `₹${order.pricing?.deliveryCharge}`}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200 font-black text-gray-900">
                                <span>Total</span><span className="text-amber-600">₹{order.pricing?.total}</span>
                            </div>
                        </div>

                        {/* Delivery address */}
                        {order.deliveryAddress && (
                            <div className="mx-5 mb-4 flex items-start gap-2 text-sm text-gray-600">
                                <FiMapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span>
                                    {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                                    {order.deliveryAddress.state} – {order.deliveryAddress.pincode}
                                </span>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="px-5 pb-5 flex gap-2 flex-wrap">
                            {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                <Link
                                    to={`/track/${order.orderId}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all"
                                >
                                    <FiPackage className="w-4 h-4" /> Track Order <FiArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            )}
                            {order.status === 'delivered' && (
                                <Link
                                    to={`/track/${order.orderId}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-xl font-bold text-sm hover:bg-green-200 transition-all"
                                >
                                    View Details
                                </Link>
                            )}
                            {['placed', 'confirmed'].includes(order.status) && (
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiX className="w-4 h-4" />
                                    {cancelling ? 'Cancelling…' : 'Cancel Order'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function MyOrders() {
    const { dbUser, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleCancelInList = (orderId) => {
        setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status: 'cancelled' } : o));
    };

    useEffect(() => {
        if (authLoading) return;
        if (!dbUser) {
            Promise.resolve().then(() => setLoading(false));
            return;
        }
        let cancelled = false;
        orderAPI.getMyOrders()
            .then((res) => { if (!cancelled) setOrders(res.data || []); })
            .catch(() => { if (!cancelled) setError('Failed to load orders'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [dbUser, authLoading]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/20 to-orange-50/20 pt-24 pb-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">My Orders</h1>
                    <p className="text-gray-500 text-base">All your mango orders in one place</p>
                </div>

                {/* Not logged in — show their guest orders from localStorage */}
                {!authLoading && !dbUser && (
                    <GuestOrders />
                )}

                {/* Loading */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                                <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
                                <div className="flex gap-2">
                                    <div className="h-8 w-24 bg-gray-100 rounded-xl" />
                                    <div className="h-8 w-24 bg-gray-100 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center py-16">
                        <p className="text-red-500 font-semibold mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-bold"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && dbUser && orders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <FiShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8">Browse our fresh mango collection and place your first order!</p>
                        <Link
                            to="/store"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all"
                        >
                            Shop Mangoes <FiArrowRight />
                        </Link>
                    </div>
                )}

                {/* Orders list */}
                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400 font-medium">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                        {orders.map((order) => (
                            <OrderCard key={order._id} order={order} onCancelled={handleCancelInList} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
