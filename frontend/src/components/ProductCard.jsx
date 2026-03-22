import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiMapPin } from 'react-icons/fi';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ mango }) {
    const addItem = useCartStore((state) => state.addItem);
    const [selectedBox, setSelectedBox] = useState(mango.boxOptions?.[0]);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity] = useState(1);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedBox) return;
        setAddingToCart(true);
        addItem(mango, selectedBox.size, selectedBox.price, quantity);
        toast.success(`Added to cart!`, { icon: '🥭' });
        setTimeout(() => setAddingToCart(false), 600);
    };

    const discount = selectedBox?.originalPrice
        ? Math.round(((selectedBox.originalPrice - selectedBox.price) / selectedBox.originalPrice) * 100)
        : 0;

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-amber-500/20 group cursor-pointer flex flex-col border-2 border-gray-100"
        >
            <Link to={`/product/${mango.slug}`}>
                {/* Image */}
                <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
                    {mango.images?.[0] ? (
                        <img
                            src={mango.images[0]}
                            alt={mango.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400'; // Fallback mango image
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">🥭</div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {mango.isBestSeller && <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">🔥 Best Seller</span>}
                        {mango.isFeatured && <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">⭐ Featured</span>}
                        {mango.isPreBookable && <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">📅 Pre-Book</span>}
                        {discount > 0 && <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">{discount}% OFF</span>}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">{mango.name}</h3>
                            <p className="text-sm text-amber-600 font-bold mt-0.5">{mango.variety}</p>
                        </div>
                        {mango.rating > 0 && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-bold text-gray-900">{mango.rating}</span>
                            </div>
                        )}
                    </div>

                    {mango.farmLocation && (
                        <div className="flex items-center gap-1 mt-2">
                            <FiMapPin className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700 font-medium line-clamp-1">{mango.farmLocation}</span>
                        </div>
                    )}

                    {/* Box size selector */}
                    {mango.boxOptions?.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {mango.boxOptions.map((opt) => (
                                <button
                                    key={opt.size}
                                    onClick={(e) => { e.preventDefault(); setSelectedBox(opt); }}
                                    className={`px-3 py-2 text-sm font-bold rounded-xl border-2 transition-all ${selectedBox?.size === opt.size
                                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 shadow-lg scale-105'
                                        : 'border-gray-300 text-gray-700 hover:border-amber-400 hover:bg-amber-50'
                                        } ${opt.stock === 0 ? 'opacity-40 line-through cursor-not-allowed' : ''}`}
                                    disabled={opt.stock === 0}
                                >
                                    {opt.size}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Price & Cart */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-gray-100">
                        <div>
                            <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">₹{selectedBox?.price || 0}</p>
                            {selectedBox?.originalPrice && (
                                <p className="text-sm text-gray-500 line-through font-semibold">₹{selectedBox.originalPrice}</p>
                            )}
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCart}
                            disabled={addingToCart || selectedBox?.stock === 0}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${selectedBox?.stock === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-2xl hover:scale-105'
                                }`}
                        >
                            <FiShoppingCart className="w-5 h-5" />
                            {selectedBox?.stock === 0 ? 'Out' : addingToCart ? '✓' : 'Add'}
                        </motion.button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
