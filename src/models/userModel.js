const mongoose = require("mongoose");
// declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			maxLength: 150,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
		},
		phoneNumber: {
			type: String,
			unique: true,
			sparse: true,
			trim: true,
		},
		gender: {
			type: String,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		tourFavourite: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);
const User = mongoose.model("User", userSchema);
module.exports = User;
