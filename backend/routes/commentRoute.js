import express from "express";
import { addComment, getAllComments, updateComment, deleteComment } from "../controller/commentController.js";

const router = express.Router();

router.post("/add", addComment);
router.get("/all/:id", getAllComments);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;