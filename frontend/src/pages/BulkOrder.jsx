import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiMapPin, FiCheck, FiTruck, FiChevronDown } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const LOCATIONS = ['Ahmedabad', 'Gandhinagar', 'Rajkot'];
const PRODUCT_TYPES = ['Kesar 5kg', 'Kesar 10kg', 'Kachchh Kesar 5kg', 'Kachchh Kesar 10kg'];

export default function BulkOrder() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        productType: '',
        company: '',
        quantity: '',
        apartment: '',
        address: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [locationSearch, setLocationSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const locationRef = useRef(null);
    const productRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
            }
            if (productRef.current && !productRef.current.contains(event.target)) {
                setShowProductDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredLocations = LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(locationSearch.toLowerCase())
    );

    const filteredProducts = PRODUCT_TYPES.filter(prod => 
        prod.toLowerCase().includes(productSearch.toLowerCase())
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.productType || !formData.quantity) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Phone validation (10 digits)
        if (!/^\d{10}$/.test(formData.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/bulk-orders', formData);
            toast.success('Bulk order request submitted successfully! We will contact you soon.');
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                location: '',
                productType: '',
                company: '',
                quantity: '',
                apartment: '',
                address: '',
                message: ''
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit bulk order request');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 pt-28 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full text-amber-800 font-medium mb-6">
                        <FiPackage className="w-4 h-4" />
                        Bulk Orders & Corporate Gifting
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                        Order in bulk, get discounts<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                            & win free mangoes!
                        </span>
                    </h1>
                    <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
                        Become a Mangozila representative for your apartment/locality and order in bulk. 
                        You get complementary boxes of mangoes from Mangozila!
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Left Side - Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Info Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
                            <h2 className="text-2xl font-bold text-stone-900 mb-6">Why Order in Bulk?</h2>
                            <div className="space-y-4">
                                {[
                                    'We take large orders of mangoes and guide for apartments and housing complexes',
                                    'Minimum order of 10 mango boxes qualifies as a bulk booking',
                                    'This option is valid for apartments/complexes within a single community',
                                    'Get special wholesale pricing and free delivery',
                                    'Dedicated support and flexible delivery schedules'
                                ].map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <FiCheck className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-stone-700 leading-relaxed">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                    <FiTruck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900">Fast Delivery</h3>
                            </div>
                            <p className="text-stone-700 leading-relaxed">
                                We ensure fresh mangoes delivered directly to your apartment or housing complex. 
                                Coordinate with your community and place orders in bulk to maximize savings!
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                            <h3 className="text-lg font-semibold text-stone-900 mb-3">Need Help?</h3>
                            <p className="text-stone-700 mb-4">Our bulk order team is ready to assist you</p>
                            <div className="space-y-2">
                                <p className="text-stone-800">
                                    <span className="font-medium">📞 Phone:</span>{' '}
                                    <a href="tel:+919586816799" className="text-green-700 hover:text-green-800 font-semibold">
                                        +91 9586816799
                                    </a>
                                </p>
                                <p className="text-stone-800">
                                    <span className="font-medium">✉️ Email:</span>{' '}
                                    <a href="mailto:mangozila1@gmail.com" className="text-green-700 hover:text-green-800 font-semibold">
                                        mangozila1@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 sticky top-4"
                    >
                        <h2 className="text-2xl font-bold text-stone-900 mb-2">
                            Send your bulk order details
                        </h2>
                        <p className="text-green-600 font-medium mb-6">
                            Now & we will get back to you shortly!
                        </p>

                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiCheck className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-3">Request Submitted!</h3>
                                <p className="text-stone-600 mb-6">
                                    Thank you for your bulk order inquiry. Our team will contact you within 24 hours.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                                >
                                    Submit Another Request
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Your name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Your email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Enter your 10-digit phone number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit phone number"
                                        maxLength="10"
                                        pattern="[0-9]{10}"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Location Dropdown */}
                                <div ref={locationRef}>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Your Location <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 z-10" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location || locationSearch}
                                            onChange={(e) => {
                                                setLocationSearch(e.target.value);
                                                setFormData({ ...formData, location: '' });
                                                setShowLocationDropdown(true);
                                            }}
                                            onFocus={() => setShowLocationDropdown(true)}
                                            placeholder="Select or type your location"
                                            className="w-full pl-10 pr-10 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
                                            required
                                            autoComplete="off"
                                        />
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 pointer-events-none" />
                                        
                                        {/* Dropdown List */}
                                        {showLocationDropdown && filteredLocations.length > 0 && (
                                            <div className="absolute z-20 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {filteredLocations.map((loc) => (
                                                    <button
                                                        key={loc}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, location: loc });
                                                            setLocationSearch('');
                                                            setShowLocationDropdown(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors border-b border-stone-100 last:border-0"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FiMapPin className="w-4 h-4 text-green-600" />
                                                            <span className="text-stone-800">{loc}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {formData.location && (
                                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                            <FiCheck className="w-3 h-3" /> Selected: {formData.location}
                                        </p>
                                    )}
                                </div>

                                {/* Product Type Dropdown */}
                                <div ref={productRef}>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Product Type <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 z-10" />
                                        <input
                                            type="text"
                                            name="productType"
                                            value={formData.productType || productSearch}
                                            onChange={(e) => {
                                                setProductSearch(e.target.value);
                                                setFormData({ ...formData, productType: '' });
                                                setShowProductDropdown(true);
                                            }}
                                            onFocus={() => setShowProductDropdown(true)}
                                            placeholder="Select or type product type"
                                            className="w-full pl-10 pr-10 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white"
                                            required
                                            autoComplete="off"
                                        />
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 pointer-events-none" />
                                        
                                        {/* Dropdown List */}
                                        {showProductDropdown && filteredProducts.length > 0 && (
                                            <div className="absolute z-20 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {filteredProducts.map((prod) => (
                                                    <button
                                                        key={prod}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, productType: prod });
                                                            setProductSearch('');
                                                            setShowProductDropdown(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors border-b border-stone-100 last:border-0"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FiPackage className="w-4 h-4 text-green-600" />
                                                            <span className="text-stone-800 font-medium">{prod}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {formData.productType && (
                                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                            <FiCheck className="w-3 h-3" /> Selected: {formData.productType}
                                        </p>
                                    )}
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="Minimum 10 boxes"
                                        min="10"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Apartment */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Apartment (L-2 and full address)
                                    </label>
                                    <input
                                        type="text"
                                        name="apartment"
                                        value={formData.apartment}
                                        onChange={handleChange}
                                        placeholder="e.g., A-101, Green Park Apartments"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Your Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Full delivery address"
                                        rows="3"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Additional Information
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Any special requirements or questions?"
                                        rows="4"
                                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>

                {/* Footer Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 bg-white rounded-2xl shadow-lg border border-stone-200 p-8"
                >
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-stone-900 mb-4">How It Works</h3>
                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h4 className="font-semibold text-stone-900 mb-2">Submit Request</h4>
                                <p className="text-stone-600 text-sm">Fill out the form with your bulk order requirements</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h4 className="font-semibold text-stone-900 mb-2">Get Quote</h4>
                                <p className="text-stone-600 text-sm">We'll contact you with pricing and availability</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h4 className="font-semibold text-stone-900 mb-2">Fresh Delivery</h4>
                                <p className="text-stone-600 text-sm">Receive premium mangoes at your doorstep</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
