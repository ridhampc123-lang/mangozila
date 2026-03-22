import { motion } from 'framer-motion';
import { FaTruck, FaLeaf, FaCertificate, FaShieldAlt } from 'react-icons/fa';

const features = [
    {
        icon: FaLeaf,
        title: 'Farm Fresh',
        description: 'Directly sourced from premium orchards across India',
        color: 'text-green-600',
    },
    {
        icon: FaCertificate,
        title: 'Quality Checked',
        description: 'Every mango is handpicked and quality certified',
        color: 'text-amber-600',
    },
    {
        icon: FaTruck,
        title: 'Fast Delivery',
        description: 'Delivered fresh to your doorstep within 2-3 days',
        color: 'text-blue-600',
    },
    {
        icon: FaShieldAlt,
        title: '100% Natural',
        description: 'No artificial ripening, completely chemical-free',
        color: 'text-purple-600',
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-stone-900 mb-4"
                    >
                        Why Choose MangoZila?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-700 max-w-2xl mx-auto font-medium"
                    >
                        Experience the difference with our premium quality mangoes
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center group"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-700 font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
