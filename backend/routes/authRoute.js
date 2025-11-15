import express from "express";
import { register, login, logout, updateProfile, me } from "../controller/authController.js";
import { isAuth } from "../middleware/isAuth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me",isAuth, me);
router.post("/updateProfile", updateProfile);

export default router;
