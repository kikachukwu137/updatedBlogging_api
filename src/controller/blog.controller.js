import Blog from '../model/users.blog.js';
import  * as blogService from '../service/blog.service.js'

const calculateReadingTime = (text) => {
    const wordsPerMinute = 200; // Average reading speed of an adult.
    const textLength = text.split(' ').length;
    return Math.ceil(textLength / wordsPerMinute);
};
/*
export const createBlog = async (req, res) => {
    try {
        const blog = new Blog({ ...req.body, author: req.user._id, reading_time: calculateReadingTime(req.body.body) });
        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
*/



export const createBlog = async (req, res) => {
    const { success, blog, error } = await blogService.createBlog(req.body, req.user._id);

    if (success) {
        return res.status(201).json(blog);
    } else {
        return res.status(400).json({ error });
    }
};

/*
export const updateBlog = async (req, res) => {
    const { success, blog, error } = await blogService.updateBlog(req.params.id, req.user._id, req.body);

    if (success) {
        return res.json(blog);
    } else {
        return res.status(400).json({ error });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            { _id: req.params.id, author: req.user._id },
            { ...req.body, reading_time: calculateReadingTime(req.body.body)},
            { new: true }
        );
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
*/
export const updateBlog = async (req, res) => {
    try {
        // Log input values for debugging
        console.log("Blog ID to update:", req.params.blogId);
        console.log("User ID (author):", req.user._id);

        const blog = await Blog.findOneAndUpdate(
            { _id: req.params.blogId, author: req.user._id },  // Ensure correct query
            { ...req.body, reading_time: calculateReadingTime(req.body.body) },
            { new: true }  // Return the updated blog
        );

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Other blog controllers...


export const deleteBlog = async (req, res) => {
    const { success, blog, error } = await blogService.deleteBlog(req.params.id, req.user._id);

    if (success) {
        return res.json({ message: 'Blog deleted successfully', blog });
    } else {
        return res.status(400).json({ error });
    }
};
/*
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ _id: req.params.blogId, author: req.user._id });
        if (!blog) return res.status(404).json({ message: 'Blog not found or not authorized to delete' });
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
*/


export const allBlogs = async (req, res) => {
    // Extract query parameters for filtering, pagination, and sorting
    const filters = {};
    const pagination = {
        limit: req.query.limit,
        page: req.query.page,
    };
    const sorting = {};

    // Apply filters based on query parameters
    if (req.query.author) {
        filters.author = req.query.author;
    }
    if (req.query.state) {
        filters.state = req.query.state;
    }
    if (req.query.tags) {
        filters.tags = { $in: req.query.tags.split(',') };
    }
    if (req.query.title) {
        filters.title = { $regex: req.query.title, $options: 'i' }; // Case-insensitive search
    }

    // Apply sorting based on query parameters
    if (req.query.sortBy) {
        const sortFields = req.query.sortBy.split(',').map(field => field.trim());
        sortFields.forEach(field => {
            if (['read_count', 'reading_time', 'timestamp'].includes(field)) {
                sorting[field] = req.query.order === 'asc' ? 1 : -1; // Default to descending order
            }
        });
    }

    // Call the service
    const { success, data, error } = await blogService.allBlogs(filters, pagination, sorting);

    // Return the appropriate HTTP response
    if (success) {
        return res.json(data);
    } else {
        return res.status(400).json({ error });
    }
};

export const getBlog = async(req,res) => {
    try {
        const {blogId} = req.params;
        const user = await blogService.getBlog(blogId)
        res.status(200).json({message: user})
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({message: error.message})
        }}