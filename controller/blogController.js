const Blog = require("../models/Blog");


const createBlog = async (req, res) => {
    try {
        const { title, descrptions } = req.body;
        const blog = new Blog({ title, descrptions });
        await blog.save();
        res.status(201).json({ message: 'Blog post created successfully', blog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getAllBlog = async (req,res) => {

    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateBlog = async (req, res) => {
    try {
        
        const blog = await Blog.findById(req.params.id);
        const { title, descrptions } = req.body;
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        blog.title = title || blog.title;
        blog.descrptions = title || blog.descrptions;
        blog.updatedAt = Date.now();
        await blog.save();
        res.json({ message: 'Blog post updated successfully', blog });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    createBlog,
    getAllBlog,
    updateBlog
}