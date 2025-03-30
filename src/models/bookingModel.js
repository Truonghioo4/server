const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Tour'},
  user: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'User'},
  checkIn: {type:Date, required:true},
  checkOut: {type:Date, required:true},
  participants: {type:Number, required:true, default:1},
  totalPrice: Number,
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;