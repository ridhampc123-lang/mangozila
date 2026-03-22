import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function BannerCarousel() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/banners')
            .then(({ data }) => setBanners(data || []))
            .catch(err => console.error('Banner fetch failed:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-[400px] md:h-[600px] w-full bg-stone-900 animate-pulse rounded-3xl" />;
    if (banners.length === 0) return null;

    return (
        <section className="relative px-4 sm:px-6 lg:px-8 py-4">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect="fade"
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                className="rounded-3xl overflow-hidden h-[400px] md:h-[650px] group"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                        <div className="relative w-full h-full overflow-hidden">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                    console.error('Carousel Image Load Error:', banner.image);
                                    e.target.style.display = 'none';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                            <div className="absolute inset-0 flex items-center justify-start p-8 md:p-16">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="max-w-xl"
                                >
                                    {banner.title && (
                                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">
                                            {banner.title}
                                        </h2>
                                    )}
                                    {banner.subtitle && (
                                        <p className="text-lg md:text-xl text-stone-200 mb-8 max-w-lg">
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    {banner.link && (
                                        <Link to={banner.link} className="btn-primary">
                                            Discover Now <FiArrowRight />
                                        </Link>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style dangerouslySetInnerHTML={{
                __html: `
                .swiper-button-next, .swiper-button-prev {
                    color: white !important;
                    background: rgba(0,0,0,0.3);
                    width: 50px !important;
                    height: 50px !important;
                    border-radius: 99px;
                    backdrop-filter: blur(10px);
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
                    opacity: 1;
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 20px !important;
                }
                .swiper-pagination-bullet {
                    background: white !important;
                }
                .swiper-pagination-bullet-active {
                    background: #f59e0b !important;
                }
            `}} />
        </section>
    );
}
