import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiShoppingBag, FiUsers, FiTag, FiStar, FiImage, FiArrowLeft, FiLogOut, FiPackage, FiMessageCircle, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
    { to: '/admin', label: 'Dashboard', icon: <FiGrid />, end: true },
    { to: '/admin/mangoes', label: 'Mangoes', icon: <span>🥭</span> },
    { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { to: '/admin/bulk-orders', label: 'Bulk Orders', icon: <FiPackage /> },
    { to: '/admin/contacts', label: 'Contact Messages', icon: <FiMessageCircle /> },
    { to: '/admin/customers', label: 'Customers', icon: <FiUsers /> },
    { to: '/admin/coupons', label: 'Coupons', icon: <FiTag /> },
    { to: '/admin/reviews', label: 'Reviews', icon: <FiStar /> },
    { to: '/admin/banners', label: 'Banners', icon: <FiImage /> },
];

export default function AdminLayout() {
    const { dbUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        toast.success('Admin logged out');
        navigate('/admin-login');
    };

    return (
        <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
            {/* Mobile Header Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-stone-900 border-b border-stone-800 z-[80] flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🥭</span>
                    <span className="font-display font-black text-mango-400">Admin</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-stone-800 rounded-lg text-mango-400"
                >
                    {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden fixed inset-0 bg-stone-950/60 backdrop-blur-md z-[60]"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar — always visible on desktop via CSS, slide-in on mobile */}
            <aside
                className={`w-[280px] lg:w-72 bg-stone-900 border-r border-stone-800 fixed left-0 top-0 bottom-0 flex flex-col z-[70] lg:z-40 transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                            {/* Brand */}
                            <div className="p-8 border-b border-stone-800">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">🥭</span>
                                    <div className="leading-tight">
                                        <h1 className="font-display font-black text-xl text-mango-400">AdminPanel</h1>
                                        <p className="text-[10px] uppercase tracking-widest text-stone-500 font-black">MangoZila Store</p>
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="p-4 mx-6 my-6 bg-stone-800/40 rounded-3xl border border-stone-700/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-mango-500 to-mango-600 rounded-2xl flex items-center justify-center text-stone-950 font-black text-xl">
                                        {dbUser?.name?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold truncate text-stone-100">{dbUser?.name || 'Administrator'}</p>
                                        <p className="text-[10px] text-stone-500 truncate lowercase font-medium">{dbUser?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="px-4 flex-1 space-y-1.5 overflow-y-auto custom-scrollbar-dark mb-4">
                                {NAV_ITEMS.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.end}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all duration-300 group ${isActive
                                                ? 'bg-mango-500 text-stone-950 font-black shadow-xl shadow-mango-500/20'
                                                : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-100'
                                            }`
                                        }
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-stone-800 space-y-3">
                                <button onClick={() => navigate('/')} className="flex items-center gap-4 w-full px-5 py-3.5 text-sm text-stone-400 hover:text-mango-400 hover:bg-stone-800 rounded-2xl transition-all font-bold">
                                    <FiArrowLeft className="text-xl" /> Back to Store
                                </button>
                                <button onClick={handleLogout} className="flex items-center gap-4 w-full px-5 py-3.5 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-2xl transition-all font-bold">
                                    <FiLogOut className="text-xl" /> Sign Out
                                </button>
                            </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 lg:ml-72 w-full min-h-screen transition-all duration-300 ${sidebarOpen ? 'blur-[2px] pointer-events-none lg:blur-none lg:pointer-events-auto' : ''}`}>
                <main className="p-4 sm:p-6 md:p-10 pb-12 pt-20 lg:pt-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
