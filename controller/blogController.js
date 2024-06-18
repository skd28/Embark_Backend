const Blog = require("../models/Blog");
const cloudinary = require('../config/cloudinary');

const createBlog = async (req, res) => {
    try {
        const { title, descriptions } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path);
        const blog = new Blog({
            title,
            descriptions,
            imageurl: result.secure_url,
            cloudinary_id: result.public_id,
        });
        await blog.save();
        res.status(201).json({ message: 'Blog post created successfully', blog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllBlog = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const { title, descriptions } = req.body;

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        if (title !== undefined) {
            blog.title = title;
        }
        if (descriptions !== undefined) {
            blog.descriptions = descriptions;
        }

        blog.updatedAt = Date.now();
        await blog.save();
        res.json({ message: 'Blog post updated successfully', blog });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBlogId = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBlog,
    getAllBlog,
    updateBlog,
    deleteBlogId
};
