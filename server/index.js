import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import { contactRoutes } from "./routes/contactUsRoute";
import { courseRoutes } from "./routes/courseRoutes";
import { paymentRoutes } from "./routes/paymentRoutes";
import { profileRoutes } from "./routes/profileRoutes";
import { userRoutes } from "./routes/userRoutes";
import dotenv from "dotenv";
import { cloudinaryConnect } from "./config/cloudinary";
import fileUpload from "express-fileupload";

dotenv.config();

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
app.use("/api/v1/contact-us", contactRoutes);
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