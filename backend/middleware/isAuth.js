import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const isAuth = (req, res, next) => {

    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    });
};

export default isAuth;

