import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t-4 border-amber-500 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-4xl">🥭</span>
                            <span className="font-display font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">MangoZila</span>
                        </div>
                        <p className="text-gray-600 text-base leading-relaxed mb-6">
                            Farm-fresh mangoes delivered to your doorstep. Direct from the orchards, zero middlemen.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: FiInstagram, href: 'https://www.instagram.com/mangozila/' },
                                { Icon: FiFacebook, href: 'https://www.facebook.com/share/1HNwMz6giy/' },
                                { Icon: FiTwitter, href: '#' }
                            ].map((social, i) => (
                                <a 
                                    key={i} 
                                    href={social.href} 
                                    target={social.href !== '#' ? "_blank" : undefined}
                                    rel={social.href !== '#' ? "noopener noreferrer" : undefined}
                                    className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:text-amber-600 hover:border-amber-500 hover:shadow-lg transition-all transform hover:scale-110"
                                >
                                    <social.Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { to: '/store', label: 'Shop Mangoes' },
                                { to: '/contact', label: 'Contact Us' },
                                { to: '/bulk-order', label: 'Bulk Orders' },
                                { to: '/cart', label: 'My Cart' },
                            ].map((l) => (
                                <li key={l.to}>
                                    <Link to={l.to} className="text-gray-700 text-base hover:text-amber-600 transition-colors font-medium">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-6">Support</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-700 text-base hover:text-amber-600 transition-colors font-medium">Track Order</a></li>
                            <li><a href="#" className="text-gray-700 text-base hover:text-amber-600 transition-colors font-medium">Delivery Info</a></li>
                            <li><a href="#" className="text-gray-700 text-base hover:text-amber-600 transition-colors font-medium">Returns & Refunds</a></li>
                            <li><a href="#" className="text-gray-700 text-base hover:text-amber-600 transition-colors font-medium">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-6">Contact Us</h3>
                        <div className="space-y-4">
                            <a href="mailto:mangozila1@gmail.com" className="flex items-center gap-3 text-gray-700 text-base hover:text-amber-600 transition-colors font-medium">
                                <FiMail className="w-5 h-5 flex-shrink-0" /> mangozila1@gmail.com
                            </a>
                            <a href="tel:+919586816799" className="flex items-center gap-3 text-gray-700 text-base hover:text-amber-600 transition-colors font-medium">
                                <FiPhone className="w-5 h-5 flex-shrink-0" /> +91 9586816799
                            </a>
                        </div>
                        <div className="mt-8">
                            <p className="text-sm font-bold text-gray-900 mb-3">Newsletter</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500" />
                                <button className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold rounded-xl hover:shadow-lg transition-all transform hover:scale-105">→</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t-2 border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-base font-medium">© {new Date().getFullYear()} MangoZila. All rights reserved.</p>
                    <div className="flex gap-6 text-gray-600 text-sm">
                        <a href="#" className="hover:text-amber-600 transition-colors font-medium">Privacy Policy</a>
                        <a href="#" className="hover:text-amber-600 transition-colors font-medium">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
