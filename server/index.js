import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as contactUsRoutes } from "./routes/contactUsRoute.js";
import { router as courseRoutes } from "./routes/courseRoutes.js";
import { router as paymentRoutes } from "./routes/paymentRoutes.js";
import { router as profileRoutes } from "./routes/profileRoutes.js";
import { router as userRoutes } from "./routes/userRoutes.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import fileUpload from "express-fileupload";
import { connect } from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5500;

connect();

app.use(cors({
	origin: "https://learner-s-academy.vercel.app/",
	credentials: true
}));

app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: "/temp"
}));

app.use(express.json());

app.use(express.urlencoded({
	extended: true
}));

app.use(cookieParser());

cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
console.log("It is running")
app.use("/api/v1/contact", contactUsRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req, res) => {
	return res.status(200).json({
		success: true,
		message: "Welcome to the API"
	})
});

app.listen(PORT, () => {
	console.log(`App is running on port ${PORT}`)
});