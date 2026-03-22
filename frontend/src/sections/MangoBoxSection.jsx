import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MangoBoxCard from '../components/MangoBoxCard';
import { useProducts } from '../hooks/useProducts';
import { FaArrowRight } from 'react-icons/fa';

export default function MangoBoxSection() {
    const { data, isLoading } = useProducts({ limit: 6, isFeatured: true });

    if (isLoading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        🥭 Premium Mango Boxes
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl h-80 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const mangoes = data?.mangoes || [];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-stone-900 mb-4"
                    >
                        Premium Mango Boxes
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-700 max-w-2xl mx-auto font-medium"
                    >
                        Handpicked, farm-fresh mangoes delivered to your doorstep. Select your favorite variety and box size.
                    </motion.p>
                </div>

                {mangoes.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {mangoes.map((mango) => (
                            <MangoBoxCard key={mango._id} mango={mango} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-700 py-12 text-lg font-medium">
                        No mangoes available right now. Check back soon!
                    </p>
                )}

                <div className="text-center">
                    <Link
                        to="/store"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                        View All Mangoes
                        <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}
