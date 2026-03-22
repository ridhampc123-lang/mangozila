import { motion } from 'framer-motion';
import { FiShield, FiTruck, FiAward, FiStar, FiCheckCircle, FiHeart } from 'react-icons/fi';

const features = [
    {
        icon: FiShield,
        title: '100% Quality Assured',
        description: 'Every mango is handpicked and quality checked before delivery'
    },
    {
        icon: FiTruck,
        title: 'Fast Delivery',
        description: 'Express delivery across India with temperature-controlled packaging'
    },
    {
        icon: FiAward,
        title: 'Premium Varieties',
        description: 'Sourced from certified farms known for authentic mangoes'
    },
    {
        icon: FiStar,
        title: '4.9★ Rated',
        description: 'Trusted by 10,000+ happy customers nationwide'
    },
    {
        icon: FiCheckCircle,
        title: 'Natural Ripening',
        description: 'No artificial ripening agents, 100% naturally ripened'
    },
    {
        icon: FiHeart,
        title: 'Farm Direct',
        description: 'Connect directly with farmers, ensuring fair prices and freshness'
    }
];

export default function TrustSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Why Choose MangoZila?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We're committed to delivering the finest mangoes with unmatched quality and service
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 hover:border-amber-300 transition-all"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl text-white mb-4">
                                    <Icon className="w-7 h-7" />
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center max-w-4xl mx-auto"
                >
                    {[
                        { number: '10K+', label: 'Happy Customers' },
                        { number: '25+', label: 'Farm Partners' },
                        { number: '4.9★', label: 'Rating' }
                    ].map((stat) => (
                        <div key={stat.label} className="p-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl text-white">
                            <div className="text-4xl font-bold mb-2">{stat.number}</div>
                            <div className="text-amber-100">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}