const bcryptjs = require("bcryptjs");
const errorHandler = require("../utils/error.js");
const User = require("../models/userModel"); // Import User model
const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.userId) {
		return next(errorHandler(403, "You are not allowed to update this user"));
	}
	if (req.body.password) {
		if (req.body.password.length < 6) {
			return next(
				errorHandler(400, "Password must be at least 6 characters long")
			);
		}
		req.body.password = await bcryptjs.hash(req.body.password, 10);
	}
	if (req.body.name) {
		if (req.body.name.length < 7 || req.body.name.length > 20) {
			return next(
				errorHandler(400, "Name must be between 7 and 20 characters long")
			);
		}
		if (!req.body.name.match(/^[a-zA-Z0-9]+$/)) {
			return next(
				errorHandler(400, "Username can only contain letters and numbers")
			);
		}
		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.params.userId,
				{
					$set: {
						name: req.body.name,
						email: req.body.email,
						password: req.body.password,
						gender: req.body.gender, // Giới tính
						phone: req.body.phone, // Số điện thoại
						address: req.body.address, // Địa chỉ
						
					},
				},
				{ new: true }
			);
			const { password, ...rest } = updatedUser._doc;
			res.status(200).json(rest);
		} catch (error) {
			next(error);
		}
	}
};

const signout = async (req, res, next) => {
	try {
		res
			.clearCookie("access_token")
			.status(200)
			.json("User signed out successfully");
	} catch (error) {
		next(error);
	}
};

const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUser, signout, getUsers, getUserProfile };
