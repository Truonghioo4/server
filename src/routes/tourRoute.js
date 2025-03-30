const express = require("express");
const {
	getAllTours,
	createTour,
	updateTour,
	deleteTour,
} = require("../controllers/tourController");
const router = express.Router();
const verifyToken = require("../utils/verifyUser");
// Route lấy tất cả các tour
router.get("/", getAllTours);

// Route tạo tour mới (chỉ admin)
router.post("/", verifyToken, createTour);

// Route cập nhật tour (chỉ admin)
router.put("/:id", verifyToken, updateTour);

// Route xóa tour (chỉ admin)
router.delete("/:id", verifyToken, deleteTour);

module.exports = router;
