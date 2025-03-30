const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		duration: {
			type: String,
			required: true,
		},
		images: {
			type: [String],
			required: true,
			default: [],
		},
		category: {
			type: [String],
			required: true,
			default: [],
		},
		schedule: {
			type: [
				{
					time: {
						type: String,
						required: true,
					},
					activity: {
						type: String,
						required: true,
					},
				},
			],
			required: true,
			default: [],
		},
		participants: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			unique: true,
		},
	},
	{ timestamps: true }
);
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
