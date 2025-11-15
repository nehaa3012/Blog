import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tags: {
        type: [String]
    }
}, {
    timestamps: true
});

const Post = mongoose.model("Post", postSchema);

export default Post;
