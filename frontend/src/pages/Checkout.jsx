import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCheck, FiShield, FiUser, FiAlertCircle } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

// Fix for Leaflet default icon issues in Vite/React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const STEPS = ['Contact Info', 'Delivery Details', 'Review & Place'];

const AHMEDABAD_CENTER = [23.0225, 72.5714];
const GANDHINAGAR_CENTER = [23.2156, 72.6369];
const MAX_DISTANCE_KM = 70;

// Haversine formula to calculate distance in KM
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const isWithinRange = (lat, lng) => {
    const distAmd = getDistance(lat, lng, AHMEDABAD_CENTER[0], AHMEDABAD_CENTER[1]);
    const distGnr = getDistance(lat, lng, GANDHINAGAR_CENTER[0], GANDHINAGAR_CENTER[1]);
    return distAmd <= MAX_DISTANCE_KM || distGnr <= MAX_DISTANCE_KM;
};

function LocationMarker({ position, setPosition, onLocationSelect }) {
    const map = useMap();
    
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onLocationSelect(lat, lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

// Updater component to center map when coords change from elsewhere
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function Checkout() {
    const navigate = useNavigate();
    const items = useCartStore(state => state.items);
    const clearCart = useCartStore(state => state.clearCart);
    const cartTotal = useCartStore(state => state.getCartTotal());
    const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: {
            phone: '',
            address: '',
            city: '',
            pincode: '',
            lat: AHMEDABAD_CENTER[0],
            lng: AHMEDABAD_CENTER[1]
        }
    });

    const [step, setStep] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [couponData, setCouponData] = useState(null);
    const [placing, setPlacing] = useState(false);
    
    const [markerPos, setMarkerPos] = useState(AHMEDABAD_CENTER);
    const [deliveryStatus, setDeliveryStatus] = useState({ available: false, message: 'Please select delivery location' });
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);

    const handleSearchAddress = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsGeocoding(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=in`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPos = [parseFloat(lat), parseFloat(lon)];
                setMarkerPos(newPos);
                handleLocationSelect(parseFloat(lat), parseFloat(lon));
            } else {
                toast.error('Location not found. Try adding "Ahmedabad" or "Gandhinagar" to your search.');
            }
        } catch (err) {
            toast.error('Search failed. Please try again.');
        } finally {
            setIsGeocoding(false);
        }
    };

    const selectedCity = watch('city');
    const selectedPincode = watch('pincode');
    const selectedAddress = watch('address');

    const handleLocationSelect = async (lat, lng) => {
        setSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await res.json();
            
            if (data && data.address) {
                const fullAddr = data.display_name || '';
                const city = data.address.city || data.address.town || data.address.village || data.address.suburb || '';
                const pincode = data.address.postcode || '';

                setValue('address', fullAddr);
                setValue('city', city);
                setValue('pincode', pincode);
                setValue('lat', lat);
                setValue('lng', lng);

                if (isWithinRange(lat, lng)) {
                    if (pincode) {
                        setDeliveryStatus({ available: true, message: 'Delivery available in your area' });
                    } else {
                        setDeliveryStatus({ available: false, message: 'Please select a valid delivery location on the map.' });
                    }
                } else {
                    setDeliveryStatus({ available: false, message: 'Delivery currently available within 70km of Ahmedabad and Gandhinagar.' });
                }
            } else {
                toast.error('Could not determine address. Try another spot.');
            }
        } catch (err) {
            console.error('Reverse geocoding error:', err);
            toast.error('Location service unavailable');
        } finally {
            setSearching(false);
        }
    };

    const validateAndNext = async () => {
        let fieldsToValidate = [];
        if (step === 0) fieldsToValidate = ['name', 'email', 'phone'];
        if (step === 1) fieldsToValidate = ['address'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            if (step === 1 && !deliveryStatus.available) {
                toast.error('Delivery not available for this location');
                return;
            }
            setStep(step + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        try {
            const { data } = await api.post('/coupons/validate', { code: couponCode, orderAmount: cartTotal });
            setCouponData(data);
            toast.success(`Coupon applied! ₹${data.discountValue} off`);
        } catch (err) { 
            toast.error(err.message || 'Invalid coupon'); 
            setCouponData(null); 
        }
    };

    const delivery = cartTotal >= 500 ? 0 : 49;
    const couponDiscount = couponData?.discountValue || 0;
    const finalTotal = Math.max(0, cartTotal - couponDiscount + delivery);

    const placeOrder = async (formData) => {
        if (!deliveryStatus.available) {
            toast.error(deliveryStatus.message);
            return;
        }
        setPlacing(true);
        try {
            const payload = {
                customerInfo: { name: formData.name, email: formData.email, phone: formData.phone },
                deliveryAddress: { 
                    fullAddress: formData.address, 
                    city: formData.city, 
                    pincode: formData.pincode,
                    latitude: formData.lat,
                    longitude: formData.lng
                },
                items: items.map((i) => ({ mangoId: i.mangoId, boxSize: i.boxSize, quantity: i.quantity })),
                couponCode: couponData ? couponCode : undefined,
            };
            const { data } = await api.post('/orders', payload);
            
            // Guest order persistence
            try {
                const stored = JSON.parse(localStorage.getItem('mz_guest_orders') || '[]');
                if (!stored.includes(data.order.orderId)) {
                    stored.unshift(data.order.orderId);
                    localStorage.setItem('mz_guest_orders', JSON.stringify(stored.slice(0, 20)));
                }
            } catch (_) {}

            navigate('/order-success', { state: { order: data.order } });
            clearCart();
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || 'Failed to place order');
        } finally { setPlacing(false); }
    };

    if (items.length === 0 && !placing) { navigate('/cart'); return null; }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">Checkout</h1>
                        <p className="text-base md:text-lg text-gray-600">
                            {items.length} item{items.length > 1 ? 's' : ''} · <span className="text-amber-600 font-bold">₹{finalTotal}</span>
                        </p>
                    </div>
                    {selectedCity && (
                        <div className={`w-full lg:w-auto px-6 py-3 rounded-2xl flex items-center justify-center lg:justify-start gap-2 border-2 transition-all ${deliveryStatus.available ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            {deliveryStatus.available ? <FiCheck className="w-5 h-5 flex-shrink-0" /> : <FiAlertCircle className="w-5 h-5 flex-shrink-0" />}
                            <span className="font-bold text-sm md:text-base">{deliveryStatus.message}</span>
                        </div>
                    )}
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-center mb-12 gap-1 sm:gap-4 overflow-x-auto pb-4 sm:pb-0">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center flex-shrink-0">
                            <div className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all ${
                                i < step 
                                    ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                                    : i === step 
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                                    : 'bg-gray-100 text-gray-400'
                            }`}>
                                {i < step ? <FiCheck className="w-3 h-3 sm:w-5 sm:h-5" /> : <span className="text-xs sm:text-lg">{i + 1}</span>}
                                <span className={`${i === step ? 'inline' : 'hidden sm:inline'}`}>{s}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-1 w-3 sm:w-8 md:w-16 mx-1 sm:mx-0 rounded-full ${
                                    i < step ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit(placeOrder)}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence mode="wait">

                                {/* STEP 0: Contact Info */}
                                {step === 0 && (
                                    <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                                    <FiUser className="text-white w-5 h-5" />
                                                </div>
                                                Contact Information
                                            </h2>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="sm:col-span-2">
                                                    <label className="text-sm text-gray-700 font-semibold mb-2 block">Full Name *</label>
                                                    <input 
                                                        {...register('name', { required: 'Full name is required' })} 
                                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none transition-all text-gray-900" 
                                                        placeholder="Ravi Kumar" 
                                                    />
                                                    {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="text-sm text-gray-700 font-semibold mb-2 block">Email *</label>
                                                    <input 
                                                        {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} 
                                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none transition-all text-gray-900" 
                                                        placeholder="ravi@gmail.com" 
                                                    />
                                                    {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="text-sm text-gray-700 font-semibold mb-2 block">Phone Number *</label>
                                                    <div className="flex gap-3">
                                                        <span className="w-20 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center font-semibold text-gray-700">+91</span>
                                                        <input 
                                                            {...register('phone', { 
                                                                required: 'Phone number is required', 
                                                                pattern: { value: /^[6-9]\d{9}$/, message: 'Please enter a valid Indian mobile number.' } 
                                                            })} 
                                                            className="flex-1 px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none transition-all text-gray-900" 
                                                            placeholder="9876543210" 
                                                            maxLength={10} 
                                                        />
                                                    </div>
                                                    {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>}
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={validateAndNext} 
                                                className="mt-8 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 w-full text-lg"
                                            >
                                                Next: Delivery Details →
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 1: Delivery Details */}
                                {step === 1 && (
                                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                                    <FiMapPin className="text-white w-5 h-5" />
                                                </div>
                                                Delivery Address
                                            </h2>
                                            
                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                                        <p className="text-sm text-gray-700 font-semibold italic">📍 Search your area or click on map</p>
                                                        <div className="flex w-full sm:w-auto gap-2">
                                                            <input 
                                                                type="text"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress(e)}
                                                                placeholder="Search area (e.g. Gota, Satellite...)"
                                                                className="flex-1 sm:w-64 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-all text-sm"
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={handleSearchAddress}
                                                                disabled={isGeocoding}
                                                                className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-all text-sm flex items-center gap-2"
                                                            >
                                                                {isGeocoding ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Search'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="h-[300px] md:h-[400px] rounded-2xl overflow-hidden border-2 border-gray-200 relative z-0">
                                                        <MapContainer 
                                                            center={markerPos} 
                                                            zoom={13} 
                                                            style={{ height: '100%', width: '100%' }}
                                                            scrollWheelZoom={true}
                                                        >
                                                            <TileLayer
                                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                            />
                                                            <LocationMarker 
                                                                position={markerPos} 
                                                                setPosition={setMarkerPos} 
                                                                onLocationSelect={handleLocationSelect} 
                                                            />
                                                            <MapUpdater center={markerPos} />
                                                        </MapContainer>
                                                        {searching && (
                                                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                                                <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                                                                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                                                    <span className="font-bold text-gray-700">Finding address...</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg text-xs font-semibold text-gray-700 pointer-events-none z-10">
                                                            📍 Click anywhere on the map to set your delivery location
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                            <FiMapPin className="text-amber-500" /> Complete Delivery Address *
                                                        </label>
                                                        <textarea
                                                            {...register('address', { 
                                                                required: 'Full address is required',
                                                                minLength: { value: 15, message: 'Address must be at least 15 characters long.' }
                                                            })}
                                                            placeholder="Flat No, Floor, Landmark..."
                                                            rows={3}
                                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none focus:bg-white transition-all text-sm leading-relaxed"
                                                        />
                                                        <p className="text-[10px] text-gray-400 mt-2 italic px-1">
                                                            Tip: You can manually add your Flat No, Floor, or Wing to the address above.
                                                        </p>
                                                        {errors.address && <p className="text-red-500 text-sm mt-2 font-medium">{errors.address.message}</p>}
                                                    </div>

                                                    <div className="grid sm:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="text-sm text-gray-700 font-semibold mb-2 block">City / Town</label>
                                                            <input {...register('city')} className="w-full px-5 py-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-gray-600 focus:outline-none" readOnly />
                                                        </div>
                                                        <div>
                                                            <label className="text-sm text-gray-700 font-semibold mb-2 block">Pincode</label>
                                                            <input {...register('pincode')} className="w-full px-5 py-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-gray-600 focus:outline-none" readOnly />
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                                        <div className="flex-1">
                                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Latitude</p>
                                                            <p className="text-sm font-mono text-gray-600">{watch('lat').toFixed(6)}</p>
                                                        </div>
                                                        <div className="flex-1 border-l pl-4 border-gray-200">
                                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Longitude</p>
                                                            <p className="text-sm font-mono text-gray-600">{watch('lng').toFixed(6)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button type="button" onClick={() => setStep(0)} className="order-2 sm:order-1 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all text-lg w-full sm:min-w-[120px]">← Back</button>
                                            <button 
                                                type="button" 
                                                onClick={validateAndNext} 
                                                disabled={!deliveryStatus.available || searching}
                                                className="order-1 sm:order-2 flex-1 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full"
                                            >
                                                Continue to Review →
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: Review & Place */}
                                {step === 2 && (
                                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Review</h2>
                                            <div className="space-y-4">
                                                {items.map((item) => (
                                                    <div key={item.key} className="flex flex-col xs:flex-row justify-between items-start xs:items-center py-4 border-b-2 border-gray-100 last:border-0 gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0">
                                                                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl md:text-3xl flex items-center justify-center w-full h-full">🥭</span>}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm md:text-base font-bold text-gray-900">{item.name}</p>
                                                                <p className="text-xs md:text-sm text-gray-600">{item.boxSize} × {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-lg md:text-xl text-amber-600 font-bold">₹{item.price * item.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                                            <p className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">🎟️ Apply Coupon</p>
                                            <div className="flex gap-3">
                                                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="flex-1 px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none transition-all text-gray-900 uppercase" />
                                                <button type="button" onClick={applyCoupon} className="px-8 py-4 bg-white border-2 border-amber-500 text-amber-600 font-bold rounded-2xl hover:bg-amber-50 transition-all">Apply</button>
                                            </div>
                                            {couponData && <p className="text-green-600 text-base mt-3 font-semibold">✓ ₹{couponData.discountValue} discount applied!</p>}
                                        </div>

                                        <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl px-6 py-4">
                                            <FiShield className="w-6 h-6 text-green-600 flex-shrink-0" />
                                            <p className="text-sm text-green-700 font-medium">Safe & secure guest checkout. Addresses are verified for accuracy using OpenStreetMap.</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button type="button" onClick={() => setStep(1)} className="order-2 sm:order-1 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all text-lg w-full sm:min-w-[120px]">← Back</button>
                                            <button 
                                                type="submit" 
                                                disabled={placing || !deliveryStatus.available} 
                                                className="order-1 sm:order-2 flex-1 px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xl flex items-center justify-center gap-2 w-full"
                                            >
                                                {placing ? '🔄 Placing Order...' : '🥭 Place Order'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 h-fit lg:sticky lg:top-24 border-2 border-gray-100">
                            <h3 className="font-bold text-2xl text-gray-900 mb-6 pb-4 border-b-2 border-gray-200">Order Total</h3>
                            <div className="space-y-4 text-base">
                                <div className="flex justify-between text-gray-700 font-medium"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                                {couponDiscount > 0 && <div className="flex justify-between text-green-600 font-bold"><span>Coupon Discount</span><span>-₹{couponDiscount}</span></div>}
                                <div className="flex justify-between text-gray-700 font-medium"><span>Delivery</span><span className={delivery === 0 ? 'text-green-600 font-bold' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                                <div className="flex justify-between font-bold text-lg md:text-xl pt-4 border-t-2 border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">₹{finalTotal}</span>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <p className="text-sm text-amber-800 font-medium">
                                    Free delivery on orders above ₹500!
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-medium opacity-50 justify-center">
                                <span>Powered by</span>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Openstreetmap_logo.svg" alt="OSM" className="w-3 h-3 grayscale" />
                                <span>OpenStreetMap</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
