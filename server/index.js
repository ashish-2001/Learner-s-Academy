import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import { router as contactUsRoutes } from "./routes/contactUsRoute.js";
import { router as courseRoutes } from "./routes/courseRoutes.js";
import { router as paymentRoutes } from "./routes/paymentRoutes.js";
import { router as profileRoutes } from "./routes/profileRoutes.js";
import { router as userRoutes } from "./routes/userRoutes.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import fileUpload from "express-fileupload";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(cookieParser());

app.use(cors({
	origin: "*",
	credentials: true
}));

app.use(
	fileUpload({
		useTempfiles: true,
		tempFileDir: "/temp/"
	})
);

cloudinaryConnect();

app.use("api/v1/auth", userRoutes);
app.use("api/v1/profile", profileRoutes);
console.log("It is running")
app.use("/api/v1/contact-us", contactUsRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running..."
	})
})

app.listen(PORT, () => {
	console.log(`App is running on port ${PORT}`)
});