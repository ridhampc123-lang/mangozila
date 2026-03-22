import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiMenu, FiX, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

export default function Navbar() {
    const { dbUser, logout } = useAuth();
    const cartCount = useCartStore(state => state.getCartCount());
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const links = [
        { to: '/', label: 'Home' },
        { to: '/store', label: 'Store' },
        { to: '/my-orders', label: 'My Orders' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/track/search', label: 'Track Order' },
    ];

    const userLinks = [];

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 pt-4 mobile-nav-space">
                <nav className={`max-w-7xl mx-auto transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-2xl shadow-amber-900/5' : 'bg-white shadow-xl shadow-gray-200/50'
                    } rounded-[2rem] border border-gray-100/50 overflow-hidden`}>
                    <div className="px-6 sm:px-8">
                        <div className="flex items-center justify-between h-20 md:h-22">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-3 group">
                                <span className="text-4xl transform group-hover:rotate-12 transition-transform duration-500">🥭</span>
                                <div className="leading-tight">
                                    <span className="font-display font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
                                        MangoZila
                                    </span>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hidden sm:block">
                                        Premium Orchards
                                    </p>
                                </div>
                            </Link>

                            {/* Desktop Nav */}
                            <div className="hidden lg:flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl">
                                {[...links, ...userLinks].map((l) => (
                                    <NavLink
                                        key={l.to}
                                        to={l.to}
                                        className={({ isActive }) =>
                                            `px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                                                ? 'bg-white text-amber-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900'
                                            }`
                                        }
                                    >
                                        {l.label}
                                    </NavLink>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 md:gap-4">
                                <Link to="/bulk-order" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-500 text-white hover:bg-forest-600 transition-all shadow-lg shadow-forest-500/20 font-bold text-sm">
                                    <FiPackage className="w-4 h-4" />
                                    <span>Bulk Order</span>
                                </Link>

                                <div className="flex items-center gap-1">
                                    <Link to="/cart" className="relative p-3 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
                                        <FiShoppingCart className="w-6 h-6" />
                                        {cartCount > 0 && (
                                            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Admin Quick Link */}
                                    {dbUser?.role === 'admin' && (
                                        <Link to="/admin" className="p-3 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
                                            <FiSettings className="w-6 h-6" />
                                        </Link>
                                    )}

                                    {/* Mobile Menu Toggle */}
                                    <button
                                        onClick={() => setMobileOpen(true)}
                                        className="lg:hidden p-3 text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all ml-1"
                                    >
                                        <FiMenu className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 flex items-center justify-between border-b border-gray-100">
                                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                                    <span className="text-3xl">🥭</span>
                                    <span className="font-display font-black text-xl text-gray-900">MangoZila</span>
                                </Link>
                                <button onClick={() => setMobileOpen(false)} className="p-3 bg-gray-50 rounded-xl text-gray-900">
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-2">
                                {[...links, ...userLinks].map((l) => (
                                    <NavLink
                                        key={l.to}
                                        to={l.to}
                                        onClick={() => setMobileOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center justify-between px-6 py-4 rounded-2xl text-lg font-bold transition-all ${isActive ? 'bg-amber-50 text-amber-600' : 'text-gray-700 hover:bg-gray-50'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {l.label}
                                                <div className={`w-2 h-2 rounded-full bg-amber-500 scale-0 transition-transform ${isActive ? 'scale-100' : ''}`} />
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                                <Link
                                    to="/bulk-order"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-between px-6 py-4 rounded-2xl text-lg font-bold bg-forest-500 text-white mt-4 shadow-xl shadow-forest-500/20"
                                >
                                    <span>Bulk Order</span>
                                    <FiPackage />
                                </Link>
                            </div>

                            <div className="p-8 border-t border-gray-100 bg-gray-50">
                                {dbUser ? (
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-xl uppercase">
                                            {dbUser.name?.[0]}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-bold text-gray-900 truncate">{dbUser.name}</p>
                                            <p className="text-sm text-gray-500 truncate lowercase">{dbUser.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full py-4 text-center font-bold text-gray-700 hover:text-amber-600 mb-4">
                                        Sign In
                                    </Link>
                                )}
                                {dbUser && (
                                    <button
                                        onClick={() => { handleLogout(); setMobileOpen(false); }}
                                        className="w-full py-4 rounded-2xl bg-white border-2 border-red-50 text-red-600 font-bold shadow-sm"
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
