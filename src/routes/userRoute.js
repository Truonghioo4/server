const express = require("express");
const verifyToken = require("../utils/verifyUser");
const userRouter = express.Router();
const {
	updateUser,
	signout,
	getUsers,
	getUserProfile,
} = require("../controllers/userController");

userRouter.get("/test", (req, res) => res.json({ success: true }));
userRouter.put("/update/:userId", verifyToken, updateUser);
userRouter.post("/signout", signout);
userRouter.get("/getusers", verifyToken, getUsers);
userRouter.get("/:userId", getUserProfile);

module.exports = userRouter;
