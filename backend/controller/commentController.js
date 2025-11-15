import Comment from "../models/comment.model.js";

// add comment
export const addComment = async (req, res) => {
    try {
        const { content, post } = req.body;
        if(!content || !post){
            return res.status(400).json({ message: "All fields are required" });
        }
        const comment = await Comment.create({ content, post });
        res.status(201).json(comment);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get all comments by post
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id });
        res.status(200).json(comments);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// update comment
export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if(!comment){
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.content = req.body.content;
        await comment.save();
        res.status(200).json(comment);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// delete comment
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if(!comment){
            return res.status(404).json({ message: "Comment not found" });
        }
        res.status(200).json(comment);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

