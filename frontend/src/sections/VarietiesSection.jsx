import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const varieties = [
    {
        name: 'Kesar',
        description: 'Saffron-colored sweetness from Gujarat - Our premium signature variety with rich aroma and golden color',
        emoji: '✨',
        color: 'from-amber-400 to-orange-400',
        season: 'May-Jul',
        features: ['Sweet & Aromatic', 'Golden Color', 'Farm Fresh']
    },
    {
        name: 'Kach Kesar',
        description: 'Unique raw-ripe variety with perfect sweet-tangy balance - Ideal for eating fresh and making chutneys',
        emoji: '🥭',
        color: 'from-green-400 to-lime-500',
        season: 'Apr-Jun',
        features: ['Sweet-Tangy', 'Versatile Use', 'Premium Quality']
    }
];

export default function VarietiesSection() {
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
                        Explore Mango Varieties
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
                        We specialize in premium Kesar and Kach Kesar mangoes, handpicked from the finest farms in Gujarat
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-base shadow-lg">
                            <span className="text-2xl">🥭</span>
                            Only 2 Premium Varieties
                        </span>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto justify-items-center">
                    {varieties.map((variety, index) => (
                        <motion.div
                            key={variety.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group w-full max-w-sm"
                        >
                            <div className="relative bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-lg hover:shadow-amber-500/20 transition-all border-2 border-gray-200 h-full flex flex-col">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${variety.color} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />
                                
                                <div className="relative flex-1 flex flex-col">
                                    <div className="text-5xl mb-4 text-center">{variety.emoji}</div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                        {variety.name}
                                    </h3>
                                    <p className="text-gray-700 text-sm mb-4 flex-1 leading-relaxed text-center">
                                        {variety.description}
                                    </p>
                                    
                                    {/* Features */}
                                    <div className="mb-4 space-y-1.5">
                                        {variety.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center justify-center gap-2">
                                                <span className="text-amber-500 text-base">✓</span>
                                                <span className="text-gray-700 font-medium text-xs">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Link
                                        to={`/store?variety=${variety.name}`}
                                        className="inline-flex items-center justify-center gap-2 text-white font-bold transition-all text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        Shop {variety.name} Now
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}