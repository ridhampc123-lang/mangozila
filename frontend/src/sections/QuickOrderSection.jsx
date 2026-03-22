import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

export default function QuickOrderSection() {
    const navigate = useNavigate();
    const { data } = useProducts({ limit: 100 });
    const products = data?.mangoes || [];
    
    const addItem = useCartStore(state => state.addItem);
    
    const [selectedMango, setSelectedMango] = useState('');
    const [selectedBox, setSelectedBox] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState('');

    const selectedProduct = products.find(p => p._id === selectedMango);
    const boxOptions = selectedProduct?.boxOptions || [];

    const handleQuickOrder = () => {
        if (!selectedMango) {
            toast.error('Please select a mango variety');
            return;
        }
        if (!selectedBox) {
            toast.error('Please select box size');
            return;
        }
        if (!pincode || pincode.length !== 6) {
            toast.error('Please enter valid 6-digit pincode');
            return;
        }

        const box = boxOptions.find(b => b.size === selectedBox);
        if (!box) return;

        addItem(selectedProduct, selectedBox, box.price, quantity);
        toast.success('Added to cart! Redirecting to checkout...');
        setTimeout(() => navigate('/checkout'), 1000);
    };

    return (
        <section className="py-16 bg-gradient-to-br from-orange-500 to-amber-600">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
 initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Quick Mango Box Order
                        </h2>
                        <p className="text-lg text-gray-600">
                            Order premium mangoes in under 30 seconds
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Select Mango Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Mango Variety *
                            </label>
                            <select
                                value={selectedMango}
                                onChange={(e) => {
                                    setSelectedMango(e.target.value);
                                    setSelectedBox('');
                                }}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                            >
                                <option value="">Choose variety...</option>
                                {products.map(p => (
                                    <option key={p._id} value={p._id}>{p.name} - {p.variety}</option>
                                ))}
                            </select>
                        </div>

                        {/* Select Box Size */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Box Size *
                            </label>
                            <select
                                value={selectedBox}
                                onChange={(e) => setSelectedBox(e.target.value)}
                                disabled={!selectedMango}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Choose size...</option>
                                {boxOptions.map(box => (
                                    <option key={box.size} value={box.size}>
                                        {box.size} - ₹{box.price} {box.stock > 0 ? `(${box.stock} available)` : '(Out of stock)'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Quantity
                            </label>
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        {/* Enter Pincode */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Enter Pincode *
                            </label>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="e.g., 400001"
                                maxLength={6}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleQuickOrder}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        🥭 Book Mango Box Now
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Free delivery on orders above ₹999 • Cash on Delivery available
                    </p>
                </motion.div>
            </div>
        </section>
    );
}