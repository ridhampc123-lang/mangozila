import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiPhone, FiMail } from 'react-icons/fi';

export default function BulkOrderCTA() {
    return (
        <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 font-medium mb-6">
                            <FiPackage className="inline mr-2" />
                            For Businesses & Events
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Need Mangoes in Bulk?
                        </h2>

                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Perfect for restaurants, hotels, events, corporate gifting, or family gatherings. 
                            Get special wholesale pricing on bulk orders.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                'Wholesale pricing for large quantities',
                                'Customized packaging available',
                                'Dedicated account manager',
                                'Flexible delivery schedules',
                                'Quality guarantee on every order'
                            ].map((benefit) => (
                                <li key={benefit} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-200">{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/bulk-order"
                                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg transition-all text-center"
                            >
                                Request Bulk Quote
                            </Link>
                            <a
                                href="tel:+919876543210"
                                className="px-8 py-4 bg-white/10 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-all text-center"
                            >
                                Call for Inquiry
                            </a>
                        </div>
                    </motion.div>

                    {/* Right Content - Contact Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                            <FiPhone className="w-12 h-12 text-amber-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Call Us</h3>
                            <p className="text-gray-300 mb-4">24/7 Available</p>
                            <a href="tel:+919586816799" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
                                +91 9586816799
                            </a>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                            <FiMail className="w-12 h-12 text-amber-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Email Us</h3>
                            <p className="text-gray-300 mb-4">We'll respond within 24 hours</p>
                            <a href="mailto:mangozila1@gmail.com" className="text-xl font-bold text-amber-400 hover:text-amber-300">
                                mangozila1@gmail.com
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}