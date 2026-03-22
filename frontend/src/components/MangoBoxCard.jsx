import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

export default function MangoBoxCard({ mango }) {
    const [selectedBox, setSelectedBox] = useState(mango.boxOptions?.[0] || null);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!selectedBox) {
            toast.error('Please select a box size');
            return;
        }
        addItem(mango, selectedBox.size, selectedBox.price, quantity);
        toast.success(`Added ${mango.name} to cart!`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-gray-100 flex flex-col h-full"
        >
            <Link to={`/product/${mango.slug}`} className="block relative overflow-hidden bg-gray-50 aspect-square rounded-t-xl sm:rounded-t-2xl">
                <img
                    src={mango.images?.[0] || '/placeholder-mango.jpg'}
                    alt={mango.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {mango.isBestSeller && (
                        <span className="bg-amber-500 text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg uppercase tracking-wider">
                            Top
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-2 sm:p-4 flex flex-col flex-1">
                <div className="flex-1">
                    <Link to={`/product/${mango.slug}`} className="block mb-1">
                        <h3 className="text-xs sm:text-base font-black text-gray-900 line-clamp-1 leading-tight group-hover:text-amber-600 transition-colors">
                            {mango.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-widest">{mango.variety}</p>
                    </Link>

                    {mango.rating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                            <FaStar className="text-amber-500 text-[8px] sm:text-[10px]" />
                            <span className="text-[10px] sm:text-xs font-black text-gray-900">{mango.rating}</span>
                            <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold">({mango.totalReviews})</span>
                        </div>
                    )}

                    {/* Compact Size Selector */}
                    <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                            {mango.boxOptions?.map((box) => (
                                <button
                                    key={box.size}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedBox(box);
                                    }}
                                    className={`text-[8px] sm:text-[10px] px-1.5 py-1 rounded-md border-2 font-black transition-all ${selectedBox?.size === box.size
                                        ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-amber-200'
                                        }`}
                                >
                                    {box.size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Price and Add Button */}
                {selectedBox && (
                    <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between gap-1">
                        <div className="flex flex-col">
                            <span className="text-sm sm:text-lg font-black text-gray-900">
                                ₹{selectedBox.price}
                            </span>
                            {selectedBox.originalPrice && (
                                <span className="text-[8px] sm:text-[10px] text-gray-400 line-through font-bold">
                                    ₹{selectedBox.originalPrice}
                                </span>
                            )}
                        </div>

                        {selectedBox.stock > 0 ? (
                            <button
                                onClick={handleAddToCart}
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors shadow-lg active:scale-95"
                                title="Add to Cart"
                            >
                                <FaShoppingCart className="text-[10px] sm:text-xs" />
                            </button>
                        ) : (
                            <span className="text-[8px] sm:text-[10px] font-black text-red-500 uppercase">Sold</span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
