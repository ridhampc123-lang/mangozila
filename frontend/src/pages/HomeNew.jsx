import HeroSection from '../sections/HeroSection';
import MangoBoxSection from '../sections/MangoBoxSection';
import WhyChooseUs from '../sections/WhyChooseUs';
import OffersSection from '../sections/OffersSection';
import BlogPreview from '../sections/BlogPreview';
import SeasonCountdown from '../components/SeasonCountdown';

export default function HomeNew() {
    return (
        <div className="min-h-screen">
            {/* Hero with Banners */}
            <HeroSection />

            {/* Season Countdown */}
            <section className="py-12 bg-stone-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SeasonCountdown />
                </div>
            </section>

            {/* Featured Mango Boxes */}
            <MangoBoxSection />

            {/* Why Choose Us */}
            <WhyChooseUs />

            {/* Special Offers */}
            <OffersSection />

            {/* Blog Preview */}
            <BlogPreview />

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-amber-500 to-orange-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Experience Premium Mangoes?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of happy customers enjoying farm-fresh mangoes
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/store"
                            className="px-8 py-4 bg-white text-amber-600 rounded-full font-semibold hover:bg-stone-100 transition-colors shadow-lg text-lg"
                        >
                            Start Shopping
                        </a>
                        <a
                            href="/bulk-order"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-amber-600 transition-colors text-lg"
                        >
                            Bulk Order Inquiry
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
