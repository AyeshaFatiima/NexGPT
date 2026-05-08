import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        // 1. Pehle poora header nikaalein
        const authHeader = req.headers.authorization;
        
        // 2. "Bearer" aur "Token" ko alag karein
        // split(" ") karne se ["Bearer", "eyJhbG..."] ban jayega, hum [1] index uthayenge
        const token = authHeader && authHeader.split(" ")[1];

        console.log("Token being verified:", token); 
        console.log("Secret used:", process.env.JWT_SECRET);

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // 3. Ab sirf clean token verify hoga
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error details", error: err.message });
    }
};

export default auth;