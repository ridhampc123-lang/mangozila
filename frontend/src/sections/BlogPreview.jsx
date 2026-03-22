import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogs } from '../hooks/useBlogs';
import { FaArrowRight, FaCalendar } from 'react-icons/fa';

export default function BlogPreview() {
    const { data, isLoading } = useBlogs({ limit: 3, published: true });

    if (isLoading || !data?.blogs || data.blogs.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        From Our Blog
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-700 max-w-2xl mx-auto font-medium"
                    >
                        Discover mango recipes, health benefits, and cultivation tips
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {data.blogs.map((blog, index) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            {blog.image && (
                                <div className="relative overflow-hidden h-48">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 font-medium">
                                    <FaCalendar />
                                    <span>
                                        {new Date(blog.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <Link to={`/blog/${blog.slug}`}>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-amber-600 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-700 mb-4 line-clamp-3 font-medium">
                                    {blog.excerpt}
                                </p>
                                <Link
                                    to={`/blog/${blog.slug}`}
                                    className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
                                >
                                    Read More
                                    <FaArrowRight />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                        View All Blogs
                        <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}
