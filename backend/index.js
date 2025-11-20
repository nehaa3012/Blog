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

app.use(express.json());
app.use(cookieParser());

// ✅ FIXED CORS CONFIG FOR RENDER
app.use(cors({
  origin: "https://blog-frontend-a8ze.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ IMPORTANT: handle preflight OPTIONS
app.options("*", cors({
  origin: "https://blog-frontend-a8ze.onrender.com",
  credentials: true
}));

// Routing
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
