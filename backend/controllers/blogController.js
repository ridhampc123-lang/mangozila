const Blog = require('../models/Blog');
const slugify = require('slugify');
const fs = require('fs');

const formatImagePath = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

// GET all blogs with pagination and search
exports.getBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, published = 'true' } = req.query;
        
        const filter = {};
        if (published === 'true') filter.isPublished = true;
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [blogs, total] = await Promise.all([
            Blog.find(filter)
                .populate('author', 'name email')
                .sort('-publishedAt')
                .skip(skip)
                .limit(Number(limit)),
            Blog.countDocuments(filter),
        ]);

        const formattedBlogs = blogs.map(blog => ({
            ...blog.toObject(),
            image: formatImagePath(blog.image),
        }));

        res.json({ 
            blogs: formattedBlogs, 
            total, 
            pages: Math.ceil(total / limit), 
            currentPage: Number(page) 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single blog by slug
exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
            .populate('author', 'name email');
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Increment view count
        blog.viewCount += 1;
        await blog.save();

        const formattedBlog = {
            ...blog.toObject(),
            image: formatImagePath(blog.image),
        };

        res.json(formattedBlog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single blog by ID (admin)
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name email');
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const formattedBlog = {
            ...blog.toObject(),
            image: formatImagePath(blog.image),
        };

        res.json(formattedBlog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST create blog (admin)
exports.createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, isPublished } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Generate slug
        const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();

        // Handle image upload
        const image = req.file ? formatImagePath(req.file.path) : null;

        const blog = await Blog.create({
            title,
            slug,
            content,
            excerpt: excerpt || content.substring(0, 200),
            image,
            author: req.user._id,
            category,
            tags: tags ? JSON.parse(tags) : [],
            isPublished: isPublished === 'true',
        });

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update blog (admin)
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, isPublished } = req.body;
        
        const update = {};
        if (title) {
            update.title = title;
            update.slug = slugify(title, { lower: true, strict: true });
        }
        if (content) update.content = content;
        if (excerpt) update.excerpt = excerpt;
        if (category) update.category = category;
        if (tags) update.tags = JSON.parse(tags);
        if (isPublished !== undefined) update.isPublished = isPublished === 'true';
        if (req.file) update.image = formatImagePath(req.file.path);

        const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ message: 'Blog updated successfully', blog });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE blog (admin)
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Delete image file if it exists locally
        if (blog.image && blog.image.includes('/uploads/')) {
            const localPath = blog.image.split('/uploads/')[1];
            const fullPath = `uploads/${localPath}`;
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
