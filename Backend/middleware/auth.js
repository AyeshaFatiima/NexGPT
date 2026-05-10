import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const userId = verified.id || verified._id || verified.userId || verified.sub;

        if (!userId) {
            return res.status(401).json({ message: "Invalid token payload: user id missing" });
        }

        req.user = { ...verified, id: userId };
        next();
        
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        res.status(401).json({ 
            message: "Invalid or expired token", 
            error: err.message 
        });
    }
};

export default auth;
