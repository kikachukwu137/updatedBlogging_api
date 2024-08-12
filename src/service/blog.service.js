/*Logged in and not logged in users should be able to get a list of published blogs created
Logged in and not logged in users should be able to to get a published blog
Logged in users should be able to create a blog.
When a blog is created, it is in draft state
The owner of the blog should be able to update the state of the blog to published
 The owner of a blog should be able to edit the blog in draft or published state
 The owner of the blog should be able to delete the blog in draft or published state*/

 import ErrorWithStatus from "../exception/errorwithstatus.js";
import Blog from "../model/users.blog.js"
 
 
 

 

export const allBlogs = async (filters = {}, pagination = { limit: 20, page: 1 }, sorting = {}) => {
    try {
        // Define the base query with filters
        const query = Blog.find(filters);

        // Apply pagination
        const limit = parseInt(pagination.limit, 10) || 20;
        const page = parseInt(pagination.page, 10) || 1;
        query.skip((page - 1) * limit).limit(limit);

        // Apply sorting
        if (sorting) {
            query.sort(sorting);
        }

        // Execute the query
        const blogs = await query.populate('author', 'first_name last_name email').exec();

        // Get total count for pagination
        const totalCount = await Blog.countDocuments(filters);

        return {
            success: true,
            data: {
                blogs,
                pagination: {
                    total: totalCount,
                    limit,
                    page,
                    pages: Math.ceil(totalCount / limit),
                }
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};



 

 



const calculateReadingTime = (text) => {
    const wordsPerMinute = 200; // Average reading speed of an adult.
    const textLength = text.split(' ').length;
    return Math.ceil(textLength / wordsPerMinute);
};


export const createBlog = async(blogData,userId) => {
    try {
        const reading_time = calculateReadingTime(blogData.body);
        const blog = new Blog({
            ...blogData,
            author: userId,
            reading_time

        })
        const savedBlog = await blog.save()
        return {success: true, blog: savedBlog}
    } catch (error) {
        return {success: false, error:error.message}
    }
}


export const updateBlog = async(blogId,userId,blogData) => {
    try {
        const reading_time = calculateReadingTime(blogData.body)
        const updatedBlog = await Blog.findOneAndUpdate(
            {_id: blogId,author: userId},{...blogData, reading_time},{new: true})
            if (!updatedBlog) {
                return { success: false, error: 'Blog not found' };
            }
            return { success: true, blog: updatedBlog };
        
    } catch (error) {
        return { success: false, error: error.message };
        
    }
}

export  const deleteBlog = async(blogId,userId) => {
    try {
        const deletedBlog = await Blog.findOneAndDelete({_id: blogId,author : userId})
        if(!deletedBlog){
            return {success: false, error: 'blog not found'}
        }
        return {success: true, Blog: deletedBlog}
    } catch (error) {
        return {
            success : false, error: error.message
        }
        
    }
}
export const getBlog = async(blogId) => {
    try {
    const blog = await Blog.findOne({_id: blogId});
    if(!blog){
        throw new ErrorWithStatus("BlogId is not corrrect",400)
    }
    return blog

        
    } catch (error) {
        const statusCode = 500;
        throw new ErrorWithStatus(error.message,statusCode)
        
    }

}































/*
exports.createBlog = async (req, res) => {
    try {
        const blog = new Blog({ ...req.body, author: req.user._id, reading_time: calculateReadingTime(req.body.body) });
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
*/



/*
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            { _id: req.params.id, author: req.user._id },
            { ...req.body, reading_time: calculateReadingTime(req.body.body) },
            { new: true }
        );
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Other blog controllers...

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;

//router for blog
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middlewares/auth');

router.post('/', auth, blogController.createBlog);
router.put('/:id', auth, blogController.updateBlog);

// Other blog routes...

module.exports = router;

// app
const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
require('dotenv').config();

const app = express();
app.use(express.json());

// Winston configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Routes
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
*/