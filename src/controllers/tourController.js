const Tour = require("../models/tourModel");
const errorHandler = require("../utils/error");

const getAllTours = async (req, res, next) => {
	try {
		// Lấy các tham số từ query
		const startIndex = parseInt(req.query.startIndex) || 0; // Vị trí bắt đầu
		const limit = parseInt(req.query.limit) || 9; // Số lượng kết quả trả về
		const sortDirection = req.query.order === "asc" ? 1 : -1; // Sắp xếp tăng dần hoặc giảm dần

		// Xây dựng bộ lọc
		const filter = {};
		if (req.query.category) filter.category = req.query.category;
		if (req.query.slug) filter.slug = req.query.slug;
		if (req.query.searchTerm) {
			filter.$or = [
				{ title: { $regex: req.query.searchTerm, $options: "i" } },
				{ description: { $regex: req.query.searchTerm, $options: "i" } },
				{ location: { $regex: req.query.searchTerm, $options: "i" } },
			];
		}

		// Lấy danh sách tour từ cơ sở dữ liệu
		const tours = await Tour.find(filter)
			.sort({ updatedAt: sortDirection }) // Sắp xếp theo thời gian cập nhật
			.skip(startIndex) // Bỏ qua các kết quả trước đó
			.limit(limit); // Giới hạn số lượng kết quả

		// Đếm tổng số tour phù hợp với bộ lọc
		const totalTours = await Tour.countDocuments(filter);

		// Trả về kết quả
		res.status(200).json({
			tours,
			totalTours,
		});
	} catch (error) {
		next(error); // Gửi lỗi đến middleware xử lý lỗi
	}
};

const createTour = async (req, res, next) => {
	try {
		// Kiểm tra quyền admin
		if (!req.user.isAdmin) {
			return next(errorHandler(403, "You are not allowed to create a tour"));
		}

		// Kiểm tra các trường bắt buộc
		const {
			title,
			description,
			location,
			price,
			duration,
			participants,
			schedule,
			category,
			images,
		} = req.body;
		if (
			!title ||
			!description ||
			!location ||
			!price ||
			!duration ||
			!participants ||
			!schedule ||
			!category ||
			!images
		) {
			return next(errorHandler(400, "Please provide all required fields"));
		}

		// Tạo slug từ tiêu đề
		const slug = title
			.split(" ")
			.join("-")
			.toLowerCase()
			.replace(/[^a-zA-Z0-9-]/g, "");

		// Tạo tour mới
		const newTour = new Tour({
			...req.body,
			slug,
		});
		// Lưu tour vào cơ sở dữ liệu
		const savedTour = await newTour.save();
		res.status(201).json(savedTour);
	} catch (error) {
		next(error); // Gửi lỗi đến middleware xử lý lỗi
	}
};

// API cập nhật tour
const updateTour = async (req, res, next) => {
	try {
		// Kiểm tra quyền admin
		if (!req.user.isAdmin) {
			return next(errorHandler(403, "You are not allowed to update a tour"));
		}

		// Cập nhật tour
		const updatedTour = await Tour.findByIdAndUpdate(
			req.params.id, // Lấy ID từ params
			{ $set: req.body }, // Cập nhật các trường từ body
			{ new: true } // Trả về tài liệu đã cập nhật
		);

		// Nếu không tìm thấy tour
		if (!updatedTour) {
			return next(errorHandler(404, "Tour not found"));
		}

		res.status(200).json(updatedTour);
	} catch (error) {
		next(error); // Gửi lỗi đến middleware xử lý lỗi
	}
};

// API xóa tour
const deleteTour = async (req, res, next) => {
	try {
		// Kiểm tra quyền admin
		if (!req.user || !req.user.isAdmin) {
			return next(errorHandler(403, "You are not allowed to delete a tour"));
		}

		// Xóa tour
		const deletedTour = await Tour.findByIdAndDelete(req.params.id);

		// Nếu không tìm thấy tour
		if (!deletedTour) {
			return next(errorHandler(404, "Tour not found"));
		}

		res.status(200).json({ message: "Tour deleted successfully" });
	} catch (error) {
		next(error); // Gửi lỗi đến middleware xử lý lỗi
	}
};

module.exports = { getAllTours, createTour, updateTour, deleteTour };
