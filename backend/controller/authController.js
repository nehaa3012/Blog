import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token);
        res.status(201).json({ token, user: newUser });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token);
        res.status(200).json({ token, user: user });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, user: user });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
