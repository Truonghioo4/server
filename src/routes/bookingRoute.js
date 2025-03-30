const express = require("express");
const {
	createBooking,
	getAllBookings,
	getBookingById,
	updateBooking,
	deleteBooking,
} = require("../controllers/bookingController");
const verifyToken = require("../utils/verifyUser");
const router = express.Router();

// Route tạo booking
router.post("/", verifyToken, createBooking);

// Route lấy tất cả các booking
router.get("/", getAllBookings);
// Route cập nhật booking
router.put("/:id", verifyToken, updateBooking);
// Route xóa booking
router.delete("/:id", verifyToken, deleteBooking);

module.exports = router;
