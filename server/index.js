import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import { contactRoutes } from "./routes/contactUsRoute";
import { courseRoutes } from "./routes/courseRoutes";
import { paymentRoutes } from "./routes/paymentRoutes";
import { profileRoutes } from "./routes/profileRoutes";
import { userRoutes } from "./routes/userRoutes";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(cookieParser())

app.use(cors({
	origin: "*",
	credentials: true
}))

app.use("api/v1/auth", userRoutes);
app.use("api/v1/profile", profileRoutes);
app.use("/api/v1/contact-us", contactRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/", paymentRoutes);

app.listen(PORT, () => {
	console.log(`App is running on port ${PORT}`)
});