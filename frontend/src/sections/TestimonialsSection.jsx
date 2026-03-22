import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const testimonials = [
    {
        name: 'Priya Shah',
        location: 'Ahmedabad, Gujarat',
        rating: 5,
        text: 'The Kesar mangoes are absolutely divine! Sweet, aromatic, and perfectly ripe. Best quality I\'ve found online. Will definitely order again!',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
        variety: 'Kesar'
    },
    {
        name: 'Rajesh Patel',
        location: 'Rajkot, Gujarat',
        rating: 5,
        text: 'Ordered Kach Kesar for the first time and I\'m blown away! The tangy-sweet balance is perfect. Fresh from the farm and delivered with care.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
        variety: 'Kach Kesar'
    },
    {
        name: 'Sneha Desai',
        location: 'Baroda, Gujarat',
        rating: 5,
        text: 'Being from Baroda, I know authentic Kesar mangoes! These taste like they came straight from my grandmother\'s farm. Excellent quality!',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
        variety: 'Kesar'
    },
    {
        name: 'Amit Joshi',
        location: 'Junagadh, Gujarat',
        rating: 5,
        text: 'Kach Kesar is my new favorite! The raw-ripe sweetness is addictive. Great for making chutneys too. Packaging was excellent.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
        variety: 'Kach Kesar'
    },
    {
        name: 'Meera Trivedi',
        location: 'Ahmedabad, Gujarat',
        rating: 5,
        text: 'Ordered 10kg Kesar box for a family function. Everyone praised the quality! Naturally ripened, no chemicals. Worth every rupee!',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
        variety: 'Kesar'
    },
    {
        name: 'Vikram Mehta',
        location: 'Rajkot, Gujarat',
        rating: 5,
        text: 'As a chef, I\'m very particular about ingredients. Their Kach Kesar mangoes are restaurant-quality. Perfect for desserts and chutneys!',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
        variety: 'Kach Kesar'
    },
    {
        name: 'Kavita Bhatt',
        location: 'Baroda, Gujarat',
        rating: 5,
        text: 'Best Kesar mangoes I\'ve had in years! The saffron color and aroma are authentic. My kids finished the whole box in 2 days!',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
        variety: 'Kesar'
    },
    {
        name: 'Arjun Pandya',
        location: 'Junagadh, Gujarat',
        rating: 5,
        text: 'Kach Kesar variety is unique and delicious! The sweet-tangy taste is refreshing. Being from Junagadh, I appreciate farm-fresh quality!',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
        variety: 'Kach Kesar'
    }
];

export default function TestimonialsSection() {
    return (
        <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Customer Reviews
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        Loved by thousands of mango enthusiasts across India
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border-2 border-amber-200">
                            <span className="text-2xl">✨</span>
                            <span className="font-bold text-amber-700">Kesar</span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-lime-100 rounded-full border-2 border-green-200">
                            <span className="text-2xl">🥭</span>
                            <span className="font-bold text-green-700">Kach Kesar</span>
                        </span>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ y: -8, scale: 1.03 }}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100"
                        >
                            {/* Author - Moved to top */}
                            <div className="flex items-center gap-3 mb-4">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-200 shadow-md"
                                />
                                <div>
                                    <div className="font-bold text-gray-900 text-base">{testimonial.name}</div>
                                    <div className="text-xs text-gray-500">{testimonial.location}</div>
                                </div>
                            </div>

                            {/* Variety Badge */}
                            <div className="mb-3">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                    testimonial.variety === 'Kesar' 
                                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200'
                                        : 'bg-gradient-to-r from-green-100 to-lime-100 text-green-700 border border-green-200'
                                }`}>
                                    {testimonial.variety}
                                </span>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-700 text-sm leading-relaxed">
                                "{testimonial.text}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}