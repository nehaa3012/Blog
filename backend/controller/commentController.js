import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

// add comment
export const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const postId = req.params.id;
        console.log(content, userId, postId);

        if (!content || !userId || !postId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const comment = await Comment.create({ content, user: userId, post: postId });

        // push comment to post
        await Post.findByIdAndUpdate(postId, {
            $push: { comment: comment._id },
            $inc: { commentCount: 1 }
        });

        return res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// get comments
export const getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId)
        const comments = await Comment.find({ post: postId }).populate("user");

        // Debugging: Check for old schema
        const oldComments = await Comment.find({ postId: postId });
        console.log(`Found ${comments.length} comments with new schema ('post')`);
        console.log(`Found ${oldComments.length} comments with old schema ('postId')`);

        return res.status(200).json({ comments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// delete comment
export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // remove comment from post
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comment: commentId },
            $inc: { commentCount: -1 }
        });
        return res.status(200).json({ message: "Comment deleted successfully", comment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// like and unlike comment
export const likeComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.likes.includes(req.user.id)) {
            comment.likes.pull(req.user.id);
        } else {
            comment.likes.push(req.user.id);
        }
        await comment.save();
        return res.status(200).json({ message: "Comment liked successfully", comment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// comments count
export const commentCount = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const commentCount = post.commentCount;
        return res.status(200).json({ commentCount });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};