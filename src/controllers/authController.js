const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

const signUp = async (req, res, next) => {
	const { name, email, password } = req.body;
	const validUser = await User.findOne({ email });
	if (
		!name ||
		!email ||
		!password ||
		name === "" ||
		email === "" ||
		password === ""
	) {
		return next(errorHandler(400, "All fields are required"));
	}
	if (validUser) {
		return next(errorHandler(400, "User already exists"));
	}
	const hashedPassword = bcryptjs.hashSync(password, 10);
	const newUser = new User({
		name,
		email,
		password: hashedPassword,
	});

	try {
		await newUser.save();
		res.json("Signup successful");
	} catch (error) {
		return next(error);
	}
};

const signIn = async (req, res, next) => {
	const { email, password } = req.body;
	if (email === "" || password === "" || !email || !password) {
		return next(errorHandler(400, "All fields are required"));
	}
	try {
		const validUser = await User.findOne({ email });
		if (!validUser) {
			return next(errorHandler(400, "User not found"));
		}
		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) {
			return next(errorHandler(400, "Invalid password"));
		}
		const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
		const { password: pass, ...rest } = validUser._doc;
		res
			.status(200)
			.cookie("access_token", token, {
				httpOnly: true,
			})
			.json(rest);
	} catch (error) {
		return next(error);
	}
};
module.exports = { signUp, signIn };
