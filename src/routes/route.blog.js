import  * as blogController from '../controller/blog.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { Router } from 'express';
const blogRouter = Router();

blogRouter.get("/", blogController.allBlogs)
blogRouter.get("/:blogId", blogController.getBlog)

blogRouter.post("/", authMiddleware,blogController.createBlog)
blogRouter.put("/:blogId",authMiddleware, blogController.updateBlog)
blogRouter.delete("/:blogId", authMiddleware,blogController.deleteBlog)


export default blogRouter;