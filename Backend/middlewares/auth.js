import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.cookies?.jwt_token;

        if (!token && req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else {
                token = req.headers.authorization;
            }
        }

        if (!token) {
            return res.status(401).json({ message: "You are not authenticated!" });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
            if (err) return res.status(403).json({ message: "Token is not valid!" });

            req.user = {
                id: payload.user_id,
                username: payload.username,
                role: payload.role,
                organization_id: payload.organization_id
            };
            next();
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const rbacMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You are not authorized to perform this action!" });
        }
        next();
    };
};
