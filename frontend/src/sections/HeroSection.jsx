import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useHeroBanners } from '../hooks/useBanners';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function HeroSection() {
    const { data: banners, isLoading } = useHeroBanners();

    if (isLoading) {
        return (
            <div className="w-full h-[60vw] max-h-[600px] min-h-[280px] bg-gradient-to-br from-amber-100 to-orange-100 animate-pulse" />
        );
    }

    /* ─── Banner Carousel ─── */
    if (banners && banners.length > 0) {
        return (
            <section className="relative w-full overflow-hidden">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation
                    loop={banners.length > 1}
                    className="hero-swiper"
                    style={{ height: 'clamp(280px, 75vw, 720px)' }}
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner._id}>
                            {({ isActive }) => (
                                <div className="relative w-full h-full overflow-hidden">

                                    {/* Full-bleed image */}
                                    <motion.img
                                        src={banner.image}
                                        alt={banner.title || 'Banner'}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        initial={{ scale: 1 }}
                                        animate={isActive ? { scale: 1.06 } : { scale: 1 }}
                                        transition={{ duration: 8, ease: 'linear' }}
                                    />

                                    {/* Mobile gradient — much subtler at the bottom only */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />

                                    {/* Desktop gradient — removed the white wash, using subtle dark contrast if needed */}
                                    <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/20 via-transparent to-transparent" />

                                    {/* ── Mobile content — pinned to bottom ── */}
                                    <motion.div
                                        initial="hidden"
                                        animate={isActive ? 'visible' : 'hidden'}
                                        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }, hidden: {} }}
                                        className="md:hidden absolute inset-x-0 bottom-0 px-5 pb-10 pt-6"
                                    >
                                        {banner.label && (
                                            <motion.span
                                                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                                className="inline-block text-xs font-bold text-emerald-300 uppercase tracking-[0.25em] mb-2 drop-shadow-md"
                                            >
                                                {banner.label}
                                            </motion.span>
                                        )}
                                        {banner.title && (
                                            <motion.h1
                                                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
                                                className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                                            >
                                                {banner.title}
                                            </motion.h1>
                                        )}
                                        {banner.subtitle && (
                                            <motion.p
                                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
                                                className="text-sm text-white/90 mb-5 leading-relaxed max-w-xs drop-shadow-md"
                                            >
                                                {banner.subtitle}
                                            </motion.p>
                                        )}
                                        {/* Removed Shop Now & Bulk Order buttons as per request */}
                                    </motion.div>

                                    {/* ── Desktop content — vertically centered, left-aligned ── */}
                                    <motion.div
                                        initial="hidden"
                                        animate={isActive ? 'visible' : 'hidden'}
                                        variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } }, hidden: {} }}
                                        className="hidden md:flex absolute inset-0 items-center"
                                    >
                                        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                                            <div className="max-w-xl">
                                                {banner.label && (
                                                    <motion.span
                                                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
                                                        className="inline-block text-sm font-bold text-stone-100 uppercase tracking-[0.3em] mb-4 drop-shadow-lg"
                                                    >
                                                        {banner.label}
                                                    </motion.span>
                                                )}
                                                {banner.title && (
                                                    <motion.h1
                                                        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
                                                        className="text-5xl lg:text-7xl font-black text-white mb-4 leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                                                    >
                                                        {banner.title}
                                                    </motion.h1>
                                                )}
                                                {banner.subtitle && (
                                                    <motion.p
                                                        variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
                                                        className="text-lg text-white/90 mb-8 leading-relaxed font-medium drop-shadow-lg"
                                                    >
                                                        {banner.subtitle}
                                                    </motion.p>
                                                )}
                                                {/* Removed Shop Now & Bulk Order buttons as per request */}
                                            </div>
                                        </div>
                                    </motion.div>

                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                <style>{`
                    .hero-swiper .swiper-pagination {
                        bottom: 16px;
                    }
                    .hero-swiper .swiper-pagination-bullet {
                        background: #fff;
                        opacity: 0.5;
                        width: 8px;
                        height: 8px;
                    }
                    .hero-swiper .swiper-pagination-bullet-active {
                        opacity: 1;
                        width: 28px;
                        border-radius: 4px;
                        background: #22c55e;
                    }
                    .hero-swiper .swiper-button-next,
                    .hero-swiper .swiper-button-prev {
                        color: #fff;
                        background: rgba(0,0,0,0.3);
                        width: 44px;
                        height: 44px;
                        border-radius: 99px;
                        backdrop-filter: blur(4px);
                        display: none;
                    }
                    @media (min-width: 768px) {
                        .hero-swiper .swiper-button-next,
                        .hero-swiper .swiper-button-prev {
                            display: flex;
                        }
                        .hero-swiper .swiper-pagination-bullet {
                            background: #059669;
                        }
                    }
                    .hero-swiper .swiper-button-next:after,
                    .hero-swiper .swiper-button-prev:after {
                        font-size: 16px;
                        font-weight: bold;
                    }
                `}</style>
            </section>
        );
    }

    /* ─── Default Hero (no banners) ─── */
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="grid md:grid-cols-2 gap-8 items-center">

                    {/* Text content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center md:text-left order-2 md:order-1"
                    >
                        <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                            🥭 Farm Fresh
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight">
                            Get Flat <span className="text-green-600">10% OFF</span>
                            <br />On Every Mango Box
                        </h1>
                        <p className="text-lg sm:text-xl font-bold text-orange-600 mb-2">
                            USE CODE: <span className="bg-orange-100 px-3 py-1 rounded-lg">JUICY10</span>
                        </p>
                        <p className="text-base text-gray-600 mb-2">
                            Extra <span className="font-bold text-green-600">₹50 OFF</span> on orders over ₹2000
                        </p>
                        <p className="text-base font-bold text-orange-600 mb-8">
                            USE CODE: <span className="bg-orange-100 px-3 py-1 rounded-lg">FLAT50</span>
                        </p>
                        {/* Removed Shop Now & Bulk Order buttons as per request */}
                    </motion.div>

                    {/* Mango image — visible on all screens */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="order-1 md:order-2 flex justify-center"
                    >
                        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-full md:h-[420px]">
                            <img
                                src="https://images.unsplash.com/photo-1605521209688-61c5cd0bf7fe?auto=format&fit=crop&w=600&q=80"
                                alt="Premium Mangoes"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl"
                            />
                            {/* floating badge */}
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-amber-100">
                                <p className="text-xs text-gray-500 font-medium">Starting from</p>
                                <p className="text-xl font-black text-amber-600">₹399</p>
                            </div>
                            <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-2xl shadow-xl px-4 py-3">
                                <p className="text-xs font-bold">Farm Direct</p>
                                <p className="text-base font-black">Zero Middlemen</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
