const express = require("express");
const {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
} = require("../controllers/blogController");

const blogRouter = express.Router();

// Route lấy tất cả các blog
blogRouter.get("/", getAllBlogs);


// Route tạo blog mới (chỉ admin)
blogRouter.post("/", createBlog);

// Route cập nhật blog (chỉ admin)
blogRouter.put("/:id", updateBlog);

// Route xóa blog (chỉ admin)
blogRouter.delete("/:id", deleteBlog);

module.exports = blogRouter;