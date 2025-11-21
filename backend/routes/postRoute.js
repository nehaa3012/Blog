import express from "express";
import { createPost, getAllPosts, getPostById, updatePost, deletePost, deleteAllPosts, likePost } from "../controller/postController.js";
import { isAuth } from "../middleware/isAuth.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/create",isAuth, upload.single("image"), createPost);
router.get("/all", getAllPosts); // Public route
router.get("/:id", getPostById); // Public route
router.put("/:id",isAuth, upload.single("image"), updatePost);
router.delete("/:id",isAuth, deletePost);
router.delete("/all",isAuth, deleteAllPosts);
router.put("/:id/like",isAuth, likePost);

export default router; 