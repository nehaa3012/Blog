import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import commentRoute from "./routes/commentRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config();
const app = express();

connectDB();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
console.log(allowedOrigins)

app.use(cors({
    origin: (origin, callback) => {
        console.log(origin);
        // Allow all origins including Postman (no origin) and deployed frontend
        callback(null, true);
    },

    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
