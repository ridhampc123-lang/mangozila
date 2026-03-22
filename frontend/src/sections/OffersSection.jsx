import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActiveOffers } from '../hooks/useOffers';
import { FaClock, FaTag } from 'react-icons/fa';

export default function OffersSection() {
    const { data: offers, isLoading } = useActiveOffers();

    if (isLoading || !offers || offers.length === 0) {
        return null;
    }

    const featuredOffers = offers.filter(o => o.isFeatured).slice(0, 3);
    if (featuredOffers.length === 0) return null;

    return (
        <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        Special Offers
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-700 max-w-2xl mx-auto font-medium"
                    >
                        Limited time deals on premium mangoes
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredOffers.map((offer, index) => (
                        <motion.div
                            key={offer._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            {offer.image && (
                                <div className="relative overflow-hidden h-48">
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2">
                                        <FaTag />
                                        {offer.discountType === 'percentage' 
                                            ? `${offer.discount}% OFF` 
                                            : `₹${offer.discount} OFF`}
                                    </div>
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-700 mb-4 line-clamp-2 font-medium">
                                    {offer.description}
                                </p>
                                {offer.endDate && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 font-medium">
                                        <FaClock />
                                        <span>
                                            Valid till {new Date(offer.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                <Link
                                    to={offer.product ? `/product/${offer.product.slug}` : '/store'}
                                    className="inline-block w-full text-center px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
