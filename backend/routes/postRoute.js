import express from "express";
import { createPost, getAllPosts, getPostById, updatePost, deletePost, deleteAllPosts, likePost, dislikePost } from "../controller/postController.js";
import { isAuth } from "../middleware/isAuth.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/create",isAuth, upload.single("image"), createPost);
router.get("/all",isAuth, getAllPosts);
router.get("/:id",isAuth, getPostById);
router.put("/:id",isAuth, upload.single("image"), updatePost);
router.delete("/:id",isAuth, deletePost);
router.delete("/all",isAuth, deleteAllPosts);
router.put("/:id/like",isAuth, likePost);
router.put("/:id/dislike",isAuth, dislikePost);

export default router;