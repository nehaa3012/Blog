import Post from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
// create post
export const createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const image = req.file;

        // Validate required fields
        if (!title || !content || !tags) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }

        console.log("Received data:", { title, content, tags, hasFile: !!image });

        // Convert image buffer to base64
        const base64Image = Buffer.from(image.buffer).toString('base64');
        const imageUrl = `data:${image.mimetype};base64,${base64Image}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: 'blog-posts' // Optional: specify a folder in Cloudinary
        });
        console.log(result)

        // Parse tags if it's a string (from JSON.stringify)
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

        // Create post
        const post = await Post.create({ 
            title, 
            content, 
            tags: parsedTags, 
            image: result.secure_url, 
            user: req.user.id 
        });

        res.status(201).json(post);
    } catch (error) {
        console.error("Error in createPost:", error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
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
        const post = await Post.findById(req.params.id).populate("user");
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
    console.log(req.body)
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        // Only the owner of the post can update it
        if (!req.user || post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: you are not the owner of this post" });
        }
        post.title = req.body.title;
        post.content = req.body.content;
        post.image = req.body.image;
        // remove previous image if new image is uploaded
        if(req.file){
            // console.log(public_id)
            if(post.image){
                const public_id = post.image.split('/').pop().split('.')[0];
            console.log(public_id)
            await cloudinary.uploader.destroy(public_id);
            }
             const base64Image = Buffer.from(req.file.buffer).toString('base64');
        const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
            const result = await cloudinary.uploader.upload(imageUrl, {
                folder: 'blog-posts' // Optional: specify a folder in Cloudinary
            });
            post.image = result.secure_url;
        }
        const parsedTags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
        post.tags = parsedTags;

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
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        // Only the owner can delete
        if (!req.user || post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: you are not the owner of this post" });
        }
        await post.remove();
        res.status(200).json({ message: "Post deleted successfully" });
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