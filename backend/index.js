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

    app.use(cors({
    origin: "https://fascinating-melba-f9ff0c.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    }));

    app.options("*", cors({
    origin: "https://fascinating-melba-f9ff0c.netlify.app",
    credentials: true
}));
    

    // Routes
    app.use("/api/auth", authRoute);
    app.use("/api/posts", postRoute);
    app.use("/api/comments", commentRoute);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
