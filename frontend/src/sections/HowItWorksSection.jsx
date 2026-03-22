import { motion } from 'framer-motion';

const steps = [
    {
        step: '01',
        title: 'Choose Your Mango',
        description: 'Select from premium varieties like Alphonso, Kesar, Chaunsa and more',
        icon: '🥭'
    },
    {
        step: '02',
        title: 'Pick Box Size',
        description: 'Select 3kg, 5kg, or 10kg boxes based on your family needs',
        icon: '📦'
    },
    {
        step: '03',
        title: 'Add Delivery Details',
        description: 'Enter your address and choose a convenient delivery slot',
        icon: '📍'
    },
    {
        step: '04',
        title: 'Receive Fresh Mangoes',
        description: 'Get farm-fresh mangoes delivered safely to your doorstep',
        icon: '🚚'
    }
];

export default function HowItWorksSection() {
    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        How Ordering Works
                    </h2>
                    <p className="text-lg text-gray-600">
                        Four simple steps to get fresh mangoes at your door
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((item, index) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-amber-300 to-orange-300 -z-10" />
                            )}

                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full text-white text-2xl font-bold mb-4">
                                    {item.step}
                                </div>
                                
                                <div className="text-5xl mb-4">{item.icon}</div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {item.title}
                                </h3>
                                
                                <p className="text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}