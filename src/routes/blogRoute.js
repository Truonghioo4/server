const express = require("express");
const {
	getBlogs,
	createBlog,
	updateBlog,
	deleteBlog,
} = require("../controllers/blogController");
const verifyToken = require("../utils/verifyUser");
const blogRouter = express.Router();

// Route lấy tất cả các blog
blogRouter.get("/get-blogs", getBlogs);

// Route tạo blog mới (chỉ admin)
blogRouter.post("/create-blog", createBlog);

// Route cập nhật blog (chỉ admin)
blogRouter.put("/update-blog/:blogId", verifyToken, updateBlog);

// Route xóa blog (chỉ admin)
blogRouter.delete("/delete-blog/:blogId", verifyToken, deleteBlog);

module.exports = blogRouter;
