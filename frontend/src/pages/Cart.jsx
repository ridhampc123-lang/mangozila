import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiTruck, FiGift } from 'react-icons/fi';
import useCartStore from '../store/cartStore';

export default function Cart() {
    const items = useCartStore(state => state.items);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const removeItem = useCartStore(state => state.removeItem);
    const clearCart = useCartStore(state => state.clearCart);
    const cartTotal = useCartStore(state => state.getCartTotal());

    if (items.length === 0) return (
        <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 pt-24 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="text-9xl mb-8 animate-bounce">🛒</div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 text-lg mb-8">Add some fresh mangoes to get started</p>
                <Link to="/store" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full hover:shadow-xl transition-all transform hover:scale-105">
                    Shop Mangoes <FiArrowRight className="w-5 h-5" />
                </Link>
            </motion.div>
        </div>
    );

    const delivery = cartTotal >= 500 ? 0 : 49;
    const total = cartTotal + delivery;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="text-5xl">🛒</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">My Cart</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.key}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-sm p-3 sm:p-6 flex gap-4 sm:gap-6 border border-gray-100 hover:shadow-md transition-all group"
                            >
                                {/* Image */}
                                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-50">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : <div className="w-full h-full flex items-center justify-center text-4xl">🥭</div>}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="min-w-0">
                                            <h3 className="font-black text-sm sm:text-lg text-gray-900 truncate leading-tight mb-0.5">{item.name}</h3>
                                            <p className="text-[10px] sm:text-xs text-amber-600 font-bold uppercase tracking-widest">{item.variety} · {item.boxSize}</p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.key)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all sm:hidden"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-end justify-between mt-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400 font-bold sm:hidden">₹{item.price}/box</p>
                                            {/* Qty */}
                                            <div className="flex items-center bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden border border-gray-100 p-0.5">
                                                <button
                                                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                                    className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-white hover:text-amber-600 transition-all rounded-md"
                                                >
                                                    <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                                <span className="text-[10px] sm:text-sm font-black text-gray-900 min-w-[24px] sm:min-w-[40px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                                    className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-white hover:text-amber-600 transition-all rounded-md"
                                                >
                                                    <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="hidden sm:block text-xs text-gray-400 font-bold mb-1 uppercase tracking-tighter">Per Box: ₹{item.price}</p>
                                            <p className="text-base sm:text-2xl text-gray-900 font-black">₹{item.price * item.quantity}</p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.key)}
                                            className="hidden sm:flex p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {items.length > 1 && (
                            <div className="flex justify-start px-2">
                                <button
                                    onClick={clearCart}
                                    className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 font-black transition-colors"
                                >
                                    Empty My Cart
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-[2rem] sm:rounded-3xl shadow-xl p-6 sm:p-8 h-fit lg:sticky lg:top-32 border border-gray-100">
                        <h2 className="font-black text-xl sm:text-2xl text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                            Summary
                            <span className="text-sm font-bold text-gray-400">{items.length} Items</span>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-500 font-bold text-sm sm:text-base">
                                <span>Subtotal</span>
                                <span className="text-gray-900">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-bold text-sm sm:text-base">
                                <div className="flex items-center gap-2">
                                    <FiTruck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                                    <span>Delivery</span>
                                </div>
                                <span className={delivery === 0 ? 'text-forest-600' : 'text-gray-900'}>
                                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                                </span>
                            </div>

                            {/* Promo Context */}
                            {delivery > 0 ? (
                                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                                    <p className="text-[10px] sm:text-xs text-amber-700 font-black uppercase tracking-wider text-center">
                                        Add ₹{500 - cartTotal} more for FREE Delivery!
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-forest-50 rounded-2xl p-4 border border-forest-100 flex items-center gap-2">
                                    <FiGift className="w-5 h-5 text-forest-500" />
                                    <p className="text-[10px] sm:text-xs text-forest-700 font-black uppercase tracking-wider">
                                        You've unlocked free delivery!
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between text-gray-900 font-black text-xl sm:text-3xl pt-6 border-t border-gray-100">
                                <span>Total</span>
                                <span className="text-amber-600">
                                    ₹{total}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            <Link
                                to="/checkout"
                                className="flex items-center justify-center gap-3 w-full py-4 sm:py-5 bg-amber-500 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base uppercase tracking-widest"
                            >
                                Checkout Now
                                <FiArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/store"
                                className="flex items-center justify-center gap-2 w-full py-4 text-gray-400 hover:text-gray-600 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all"
                            >
                                Continue Browsing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
