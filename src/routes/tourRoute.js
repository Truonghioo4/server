const express = require("express");
const {
	getTours,
	createTour,
	updateTour,
	deleteTour,
} = require("../controllers/tourController");
const router = express.Router();
const verifyToken = require("../utils/verifyUser");
// Route lấy tất cả các tour
router.get("/get-tours", getTours);

// Route tạo tour mới (chỉ admin)
router.post("create-tour", verifyToken, createTour);

// Route cập nhật tour (chỉ admin)
router.put("/update-tour/:id", verifyToken, updateTour);

// Route xóa tour (chỉ admin)
router.delete("/delete-tour/:id", verifyToken, deleteTour);

module.exports = router;
