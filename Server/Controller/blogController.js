const multer = require("multer");
const Blog = require("../Models/blogModel");
const { default: mongoose } = require("mongoose");

// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/blogs");
    },
    filename: (req, file, cb) => {
        const prefix = "blog-";
        const fullName = file.originalname;
        const extension = file.originalname.split(".").pop();
        const fileName = prefix + fullName.substring(0, fullName.lastIndexOf(".")) + Date.now() + "." + extension;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage }).single("image");

// Add a new blog
const addBlog = async (req, res) => {
    try {
        const { title, description, creatorType } = req.body;
        const creatorId = req.user.id; // Assuming user ID is available from auth middleware

        const newBlog = new Blog({
            title,
            description,
            image: req.file || null,
            creatorType,
            creatorId
        });

        await newBlog.save();
        
        // Populate creator details
        const populatedBlog = await Blog.findById(newBlog._id)
            .populate({
                path: 'creatorId',
                select: 'name email profilePic'
            });

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog: populatedBlog
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Edit an existing blog
const editBlog = async (req, res) => {
    try {
        const { title, description } = req.body;
        const blogId = req.params.id;
        const userId = req.user.id; // Assuming user ID is available from auth middleware

        // Find the blog and verify ownership
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (blog.creatorId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to edit this blog"
            });
        }

        // Update blog
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.image = req.file ? req.file : blog.image;

        await blog.save();

        // Populate creator details
        const populatedBlog = await Blog.findById(blog._id)
            .populate({
                path: 'creatorId',
                select: 'name email profilePic'
            });

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog: populatedBlog
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Fetch all blogs with pagination
const fetchAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'creatorId',
                select: 'name email profilePic'
            })
            .populate({
                path: 'likes',
                select: 'name email profilePic'
            });

        const totalBlogs = await Blog.countDocuments();

        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            blogs,
            currentPage: page,
            totalPages: Math.ceil(totalBlogs / limit),
            totalBlogs
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Fetch a specific blog by ID
const fetchBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        const blog = await Blog.findById(blogId)
            .populate({
                path: 'creatorId',
                select: 'name email profilePic'
            })
            .populate({
                path: 'likes',
                select: 'name email profilePic'
            });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            blog
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Add like to a blog
const addLike = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id; // Assuming user ID is available from auth middleware

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Check if user already liked the blog
        if (blog.likes.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You already liked this blog"
            });
        }

        blog.likes.push(userId);
        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog liked successfully",
            likesCount: blog.likes.length
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Remove like from a blog
const removeLike = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id; // Assuming user ID is available from auth middleware

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Check if user has liked the blog
        if (!blog.likes.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You haven't liked this blog yet"
            });
        }

        blog.likes = blog.likes.filter(id => id.toString() !== userId);
        await blog.save();

        res.status(200).json({
            success: true,
            message: "Like removed successfully",
            likesCount: blog.likes.length
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const removeBlog = async (req, res) => {
    try {
        const blogId = req.params.id

        const blog = await Blog.findByIdAndDelete(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
module.exports = {
    upload,
    addBlog,
    editBlog,
    fetchAllBlogs,
    fetchBlogById,
    addLike,
    removeLike,
    removeBlog
};