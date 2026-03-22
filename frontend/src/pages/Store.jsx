import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import MangoBoxCard from '../components/MangoBoxCard';

const VARIETIES = ['Alphonso', 'Kesar', 'Dasheri', 'Langra', 'Totapuri', 'Banganapali'];
const BOX_SIZES = ['5kg', '10kg', '20kg'];

export default function Store() {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        variety: searchParams.get('variety') || '',
        boxSize: searchParams.get('boxSize') || '',
        minPrice: '',
        maxPrice: '',
        search: searchParams.get('search') || '',
        sort: '-createdAt',
        page: 1,
    });
    const [showFilters, setShowFilters] = useState(false);

    const { data, isLoading } = useProducts(filters);
    const mangoes = data?.mangoes || [];
    const total = data?.total || 0;
    const pages = data?.pages || 1;

    const updateFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }));
    const clearFilters = () => setFilters({ variety: '', boxSize: '', minPrice: '', maxPrice: '', search: '', sort: '-createdAt', page: 1 });

    const activeFilterCount = [filters.variety, filters.boxSize, filters.minPrice, filters.maxPrice].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        🥭 <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Mango Store</span>
                    </h1>
                    <p className="text-xl text-gray-600">{total > 0 ? `${total} premium varieties available` : 'Browse our premium collection'}</p>
                </motion.div>

                {/* Search & Filter Bar */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search varieties..."
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-[1.5rem] shadow-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-gray-900 font-medium"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(true)}
                        className={`hidden md:flex items-center gap-2 px-6 py-4 rounded-[1.5rem] font-bold transition-all border-2 ${activeFilterCount > 0
                            ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                            : 'bg-white border-gray-100 text-gray-700 hover:border-amber-500/50 shadow-sm'
                            }`}
                    >
                        <FiFilter className="w-5 h-5" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeFilterCount > 0 ? 'bg-white text-amber-600' : ''}`}>
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className={`md:hidden p-4 rounded-[1.25rem] border-2 transition-all ${activeFilterCount > 0
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'bg-white border-gray-100 text-gray-700'
                            }`}
                    >
                        <FiFilter className="w-6 h-6" />
                    </button>
                </div>

                {/* Desktop Sort Bar (Subtle) */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest px-2">
                        {total} Results
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm font-bold hidden sm:block">Sort by:</span>
                        <select
                            value={filters.sort}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                            className="px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:border-amber-500 outline-none cursor-pointer"
                        >
                            <option value="-createdAt">Newest First</option>
                            <option value="boxOptions.price">Price: Low to High</option>
                            <option value="-boxOptions.price">Price: High to Low</option>
                            <option value="-rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                {/* Filters Drawer (Mobile & Desktop) */}
                <AnimatePresence>
                    {showFilters && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowFilters(false)}
                                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100]"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 bottom-0 w-[90%] max-w-md bg-white z-[110] shadow-2xl flex flex-col"
                            >
                                <div className="p-8 flex items-center justify-between border-b border-gray-100">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">Filters</h2>
                                        <p className="text-sm text-gray-500 font-medium">Refine your mango selection</p>
                                    </div>
                                    <button onClick={() => setShowFilters(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-900 transition-colors">
                                        <FiX className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                    {/* Variety */}
                                    <section>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 block">Variety</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['', ...VARIETIES].map((v) => (
                                                <button
                                                    key={v}
                                                    onClick={() => updateFilter('variety', v)}
                                                    className={`px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm ${filters.variety === v
                                                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                                                        : 'bg-white border-gray-100 text-gray-600 hover:border-amber-200'
                                                        }`}
                                                >
                                                    {v || 'All Varieties'}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Box Size */}
                                    <section>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 block">Box Size</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['', ...BOX_SIZES].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateFilter('boxSize', s)}
                                                    className={`px-5 py-3 rounded-xl border-2 transition-all font-bold text-sm ${filters.boxSize === s
                                                        ? 'bg-amber-500 border-amber-500 text-white'
                                                        : 'bg-white border-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {s || 'All Sizes'}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Price Range */}
                                    <section>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 block">Price Range (₹)</label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-1">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={filters.minPrice}
                                                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                                                    className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-amber-500 outline-none font-bold text-gray-900"
                                                />
                                            </div>
                                            <div className="w-4 h-[2px] bg-gray-200" />
                                            <div className="relative flex-1">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={filters.maxPrice}
                                                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                                                    className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-amber-500 outline-none font-bold text-gray-900"
                                                />
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="p-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={clearFilters}
                                        className="py-4 rounded-2xl border-2 border-red-50 text-red-600 font-black text-sm hover:bg-red-50 transition-colors"
                                    >
                                        Reset All
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="py-4 rounded-2xl bg-gray-900 text-white font-black text-sm shadow-xl shadow-gray-900/20 active:scale-95 transition-transform"
                                    >
                                        Show {total} Results
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] p-4 shadow-sm border-2 border-gray-50 space-y-4 animate-pulse">
                                <div className="aspect-square bg-gray-100 rounded-3xl" />
                                <div className="px-2 space-y-3">
                                    <div className="h-6 bg-gray-100 rounded-full w-3/4" />
                                    <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : mangoes.length > 0 ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-8"
                        >
                            {mangoes.map((m, index) => (
                                <motion.div
                                    key={m._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <MangoBoxCard mango={m} />
                                </motion.div>
                            ))}
                        </motion.div>
                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="flex justify-center flex-wrap gap-2 mt-16 pb-10">
                                {[...Array(pages)].map((_, i) => (
                                    <button key={i} onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                                        className={`w-14 h-14 rounded-2xl font-black transition-all ${filters.page === i + 1
                                            ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20'
                                            : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-amber-500/50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-32 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center text-6xl mb-8"
                        >
                            🥭
                        </motion.div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">No mangoes found</h2>
                        <p className="text-gray-500 font-medium mb-8 max-w-sm">We couldn't find any varieties matching your current filters. Try resetting them.</p>
                        <button onClick={clearFilters} className="px-10 py-5 bg-amber-500 text-white rounded-full font-black shadow-xl shadow-amber-500/20 hover:-translate-y-1 transition-all active:scale-95">
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
