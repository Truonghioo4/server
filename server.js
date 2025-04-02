const express = require("express");
const connectDB = require("./src/config/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
// app config
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const port = process.env.PORT;

// connect to db
connectDB();

app.get("/", (req, res) => {
	res.send("API is running...");
});
// api endpoints
app.use("/api/user", require("./src/routes/userRoute"));
app.use("/api/auth", require("./src/routes/authRoute"));
app.use("/api/blog", require("./src/routes/blogRoute"));
app.use("/api/bookings", require("./src/routes/bookingRoute"));
app.use("/api/tour", require("./src/routes/tourRoute"));

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
