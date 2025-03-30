const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");
const errorHandler = require("../utils/error");

// API tạo booking
const createBooking = async (req, res, next) => {
  try {
      const { tour, user, checkIn, checkOut, participants } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!tour || !user || !checkIn || !checkOut || !participants) {
          return next(errorHandler(400, "Please provide all required fields"));
      }

      // Kiểm tra xem tour có tồn tại không
      const existingTour = await Tour.findById(tour);
      if (!existingTour) {
          return next(errorHandler(404, "Tour not found"));
      }

      // Tính tổng giá (giả sử giá mỗi người là giá của tour)
      const totalPrice = existingTour.price * participants;

      // Tạo booking mới
      const newBooking = new Booking({
          tour,
          user,
          checkIn,
          checkOut,
          participants,
          totalPrice,
      });

      // Lưu booking vào cơ sở dữ liệu
      const savedBooking = await newBooking.save();
      res.status(201).json(savedBooking);
  } catch (error) {
      next(error); // Gửi lỗi đến middleware xử lý lỗi
  }
};

// API lấy tất cả các booking
const getAllBookings = async (req, res, next) => {
  try {
      const bookings = await Booking.find()
          .populate("tour", "title price") // Lấy thông tin tour (chỉ lấy title và price)
          .populate("user", "name phone email"); // Lấy thông tin user (bao gồm name, phone, và email)
      res.status(200).json(bookings);
  } catch (error) {
      next(error);
  }
};


// API cập nhật booking
const updateBooking = async (req, res, next) => {
  try {
      const updatedBooking = await Booking.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
      )
          .populate("tour", "title price")
          .populate("user", "name phone email");

      if (!updatedBooking) {
          return next(errorHandler(404, "Booking not found"));
      }

      res.status(200).json(updatedBooking);
  } catch (error) {
      next(error);
  }
};

// API xóa booking
const deleteBooking = async (req, res, next) => {
  try {
      const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

      if (!deletedBooking) {
          return next(errorHandler(404, "Booking not found"));
      }

      res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
      next(error);
  }
};

module.exports = {
    createBooking,
    getAllBookings,
    updateBooking,
    deleteBooking,
};