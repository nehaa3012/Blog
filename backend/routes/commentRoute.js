import express from "express";
import { addComment, deleteComment, getCommentsByPostId, likeComment, commentCount } from "../controller/commentController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();
router.use(isAuth)

router.post("/add/:id", addComment);
router.get("/all/:id", getCommentsByPostId);
router.delete("/:id", deleteComment);
router.put("/:id", likeComment);
router.get("/count/:id", commentCount);

export default router;
