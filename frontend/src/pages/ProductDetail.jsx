import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiCalendar, FiArrowLeft, FiPackage, FiMinus, FiPlus } from 'react-icons/fi';
import useCartStore from '../store/cartStore';
import { useProduct } from '../hooks/useProducts';
import toast from 'react-hot-toast';

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const addItem = useCartStore(state => state.addItem);
    const { data: mango, isLoading } = useProduct(slug);

    const [selectedBox, setSelectedBox] = useState(null);
    const [activeImg, setActiveImg] = useState(0);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        if (mango?.boxOptions) {
            setSelectedBox(mango.boxOptions[0]);
        }
    }, [mango]);

    const handleAddToCart = () => {
        if (!selectedBox || selectedBox.stock === 0) {
            toast.error('Please select an available box size');
            return;
        }
        addItem(mango, selectedBox.size, selectedBox.price, qty);
        toast.success(`${qty}x ${mango.name} (${selectedBox.size}) added to cart!`, { icon: '🥭' });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        setTimeout(() => navigate('/checkout'), 500);
    };

    if (isLoading) return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-10">
                    <div className="aspect-square rounded-3xl bg-gray-200 animate-pulse" />
                    <div className="space-y-5">
                        {[...Array(6)].map((_, i) => <div key={i} className="h-8 rounded-xl bg-gray-200 animate-pulse" />)}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!mango) return (
        <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
            <div className="text-center">
                <p className="text-9xl mb-6">🥭</p>
                <p className="text-3xl font-bold text-gray-900 mb-4">Mango not found</p>
                <Link to="/store" className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg transition-all">
                    Back to Store
                </Link>
            </div>
        </div>
    );

    const allImages = mango.images?.length > 0 ? mango.images : null;

    return (
        <div className="min-h-screen bg-white pt-24 pb-36 lg:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <Link to="/store" className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors mb-8 font-bold text-sm uppercase tracking-widest">
                    <FiArrowLeft className="w-4 h-4" /> Back to Collection
                </Link>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* ─── Images Area ─── stays put only on desktop (lg:sticky) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:sticky lg:top-28"
                    >
                        {/* Main image */}
                        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl border border-gray-100 group">
                            {allImages ? (
                                <img
                                    key={activeImg}
                                    src={allImages[activeImg]}
                                    alt={mango.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-8xl">🥭</div>
                            )}
                        </div>

                        {/* Thumbnail strip — only if multiple images */}
                        {allImages?.length > 1 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImg(i)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                                            activeImg === i
                                                ? 'border-amber-500 shadow-lg scale-105'
                                                : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-amber-300'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* ─── Content Area ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="space-y-7"
                    >
                        {/* Badges */}
                        <div className="flex gap-2 flex-wrap">
                            {mango.isBestSeller && (
                                <span className="px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                    🔥 Best Seller
                                </span>
                            )}
                            {mango.isPreBookable && (
                                <span className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                    📅 Pre-Order
                                </span>
                            )}
                            <span className="px-4 py-1.5 bg-forest-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                🌿 Fresh Harvest
                            </span>
                        </div>

                        {/* Name + variety + rating */}
                        <div>
                            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
                                {mango.name}
                            </h1>
                            <div className="flex items-center flex-wrap gap-4">
                                <p className="text-amber-600 font-black text-base tracking-widest uppercase">{mango.variety}</p>
                                {mango.rating > 0 && (
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                        <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="text-gray-900 font-black text-sm">{mango.rating}</span>
                                        <span className="text-gray-400 font-bold text-xs border-l border-gray-200 pl-2">
                                            {mango.totalReviews} Reviews
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Farm / Season cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                    <FiMapPin className="w-5 h-5 text-amber-600" />
                                </div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Origin</p>
                                <p className="font-bold text-gray-900 text-sm">{mango.farmLocation || 'Premium Orchards'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                    <FiCalendar className="w-5 h-5 text-amber-600" />
                                </div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Season</p>
                                <p className="font-bold text-gray-900 text-sm">{mango.harvestDetails?.season || 'Current Season'}</p>
                            </div>
                        </div>

                        {/* Description */}
                        {mango.description && (
                            <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100">
                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base italic">
                                    "{mango.description}"
                                </p>
                            </div>
                        )}

                        {/* Box size selector */}
                        {mango.boxOptions?.length > 0 && (
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Select Box Size</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {mango.boxOptions.map((opt) => (
                                        <button
                                            key={opt.size}
                                            onClick={() => setSelectedBox(opt)}
                                            disabled={opt.stock === 0}
                                            className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                                                selectedBox?.size === opt.size
                                                    ? 'bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-500/25 -translate-y-1'
                                                    : 'bg-white border-gray-100 text-gray-600 hover:border-amber-200 hover:bg-amber-50'
                                            } ${opt.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        >
                                            <FiPackage className={`w-6 h-6 mb-2 ${selectedBox?.size === opt.size ? 'text-white' : 'text-amber-500'}`} />
                                            <p className="font-black text-xs uppercase tracking-wider mb-0.5">{opt.size}</p>
                                            <p className={`text-lg font-black ${selectedBox?.size === opt.size ? 'text-white' : 'text-gray-900'}`}>
                                                ₹{opt.price}
                                            </p>
                                            {opt.originalPrice && opt.originalPrice > opt.price && (
                                                <p className={`text-xs line-through ${selectedBox?.size === opt.size ? 'text-amber-200' : 'text-gray-400'}`}>
                                                    ₹{opt.originalPrice}
                                                </p>
                                            )}
                                            {opt.stock === 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                                                    Out
                                                </span>
                                            )}
                                            {opt.stock > 0 && opt.stock <= 5 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">
                                                    Only {opt.stock} left
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price + Qty + Buttons — inline on desktop, fixed bar on mobile */}
                        {selectedBox && (
                            <>
                                {/* Desktop: inline action section */}
                                <div className="hidden lg:block space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
                                            <p className="text-4xl font-black text-gray-900">₹{selectedBox.price * qty}</p>
                                        </div>
                                        {/* Qty stepper */}
                                        <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                                            <button
                                                onClick={() => setQty(Math.max(1, qty - 1))}
                                                className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white transition-all text-gray-700 font-black"
                                            >
                                                <FiMinus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 text-center font-black text-xl text-gray-900">{qty}</span>
                                            <button
                                                onClick={() => setQty(Math.min(selectedBox.stock || 99, qty + 1))}
                                                className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white transition-all text-gray-700 font-black"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={selectedBox.stock === 0}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-gray-800 text-white font-black rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Buy Now
                                    </button>
                                    {selectedBox.stock === 0 && (
                                        <p className="text-center text-red-500 font-bold text-sm">This size is currently out of stock</p>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* ─── Mobile Fixed Bottom Action Bar ─── only shows on < lg */}
            {selectedBox && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-2xl px-4 py-3 safe-area-bottom">
                    <div className="flex items-center gap-3">
                        {/* Price */}
                        <div className="flex-shrink-0">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                            <p className="text-xl font-black text-gray-900">₹{selectedBox.price * qty}</p>
                        </div>

                        {/* Qty stepper */}
                        <div className="flex items-center bg-gray-100 rounded-xl p-0.5 flex-shrink-0">
                            <button
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white transition-all text-gray-700"
                            >
                                <FiMinus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-black text-base text-gray-900">{qty}</span>
                            <button
                                onClick={() => setQty(Math.min(selectedBox.stock || 99, qty + 1))}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white transition-all text-gray-700"
                            >
                                <FiPlus className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleBuyNow}
                            disabled={selectedBox.stock === 0}
                            className="flex-1 flex items-center justify-center py-3 bg-gray-900 hover:bg-gray-800 text-white font-black rounded-xl active:scale-95 transition-all text-xs uppercase tracking-wide disabled:opacity-50"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
