// New redesigned homepage according to comprehensive prompt
import HeroSection from '../sections/HeroSection';
import QuickOrderSection from '../sections/QuickOrderSection';
import MangoBoxSection from '../sections/MangoBoxSection';
import VarietiesSection from '../sections/VarietiesSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import TrustSection from '../sections/TrustSection';
import OffersSection from '../sections/OffersSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import BlogPreview from '../sections/BlogPreview';
import BulkOrderCTA from '../sections/BulkOrderCTA';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Dynamic Banners */}
            <HeroSection />

            {/* Quick Mango Box Order - 30 Second Checkout */}
            <QuickOrderSection />

            {/* Featured Mango Boxes */}
            <MangoBoxSection />

            {/* Mango Varieties */}
            <VarietiesSection />

            {/* How Ordering Works */}
            <HowItWorksSection />

            {/* Trust Section - Why Choose Us */}
            <TrustSection />

            {/* Seasonal Offers */}
            <OffersSection />

            {/* Customer Reviews */}
            <TestimonialsSection />

            {/* Blog Preview */}
            <BlogPreview />

            {/* Bulk Order CTA */}
            <BulkOrderCTA />
        </div>
    );
}
