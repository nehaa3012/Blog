import Post from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
// create post
export const createPost = async (req, res) => {
    try {
        const {title, content, tags } = req.body;
        const image = req.file;
        if(!title || !content || !tags){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(!image){
            return res.status(400).json({ message: "Image is required" });
        }
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const imageurl = `data:${image.mimetype};base64,${base64Image}`;
        const result = await cloudinary.uploader.upload(imageurl);

        const post = await Post.create({ title, content, tags, image: result.secure_url, user: req.user.id });
        res.status(201).json(post);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user");
        res.status(200).json(posts);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get post by id
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// update post
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        post.title = req.body.title;
        post.content = req.body.content;
        post.image = req.body.image;
        post.tags = req.body.tags;
        await post.save();
        res.status(200).json(post);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// delete post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// delete all posts
export const deleteAllPosts = async (req, res) => {
    try {
        const posts = await Post.deleteMany();
        res.status(200).json(posts);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// like post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        post.likes.push(req.body.userId);
        await post.save();
        res.status(200).json(post);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// dislike post
export const dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        post.likes.pull(req.body.userId);
        await post.save();
        res.status(200).json(post);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};