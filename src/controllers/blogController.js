const Blog = require("../models/blogModel");
const errorHandler = require("../utils/error");
const createBlog = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, "You are not allowed to create a blog"));
	}
	if (!req.body.title || !req.body.content) {
		return next(errorHandler(400, "Please provide all required fields"));
	}
	const slug = req.body.title
		.split(" ")
		.join("-")
		.toLowerCase()
		.replace(/[^a-zA-Z0-9-]/g, "");
	const newBlog = new Blog({
		...req.body,
		slug,
	});
	try {
		const savedBlog = await newBlog.save();
		res.status(201).json(savedBlog);
	} catch (error) {
		next(error);
	}
};

const getBlogs = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.order === "asc" ? 1 : -1;
		const blogs = await Blog.find({
			...(req.query.userId && { userId: req.query.userId }),
			...(req.query.category && { category: req.query.category }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.blogId && { _id: req.query.blogId }),
			...(req.query.searchTerm && {
				$or: [
					{ title: { $regex: req.query.searchTerm, $options: "i" } },
					{ content: { $regex: req.query.searchTerm, $options: "i" } },
				],
			}),
		})
			.sort({ updatedAt: sortDirection })
			.skip(startIndex)
			.limit(limit);
		const totalBlogs = await Blog.countDocuments();

		const now = new Date();

		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);

		const lastMonthBlogs = await Blog.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		});

		res.status(200).json({
			blogs,
			totalBlogs,
			lastMonthBlogs,
		});
	} catch (error) {
		next(error);
	}
};
const deleteBlog = async (req, res, next) => {
	if (!req.user.isAdmin || req.user.id !== req.params.userId) {
		return next(errorHandler(403, "You are not allowed to delete this blog"));
	}
	try {
		await Blog.findByIdAndDelete(req.params.blogId);
		res.status(200).json("The blog has been deleted");
	} catch (error) {
		next(error);
	}
};

const updateBlog = async (req, res, next) => {
	if (!req.user.isAdmin || req.user.id !== req.params.userId) {
		return next(errorHandler(403, "You are not allowed to update this blog"));
	}
	try {
		const updatedBlog = await Blog.findByIdAndUpdate(
			req.params.blogId,
			{
				$set: {
					title: req.body.title,
					content: req.body.content,
					category: req.body.category,
					thumnail: req.body.thumnail,
				},
			},
			{ new: true }
		);
		res.status(200).json(updatedBlog);
	} catch (error) {
		next(error);
	}
};

module.exports = { getBlogs, createBlog, deleteBlog, updateBlog };
