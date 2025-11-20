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

app.use(cors({
  origin: "https://fascinating-melba-f9ff0c.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// This automatically handles OPTIONS → No need to define manually
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://fascinating-melba-f9ff0c.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
