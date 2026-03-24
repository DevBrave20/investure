import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import RevokedToken from "../models/revoke-token-model.js";
import Admin from "../models/admin-model.js";



export const authenticate = async (req, res, next) => {
    try {
        const hasAuthorization = req.headers["authorization"]
        if (!hasAuthorization) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }

        const token = hasAuthorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }
        const isTokenRevoked = await RevokedToken.exists({ token });

        if (isTokenRevoked) {
            return res.status(401).json({
                message: "Oops! Access denied. Your session has expired. Please sign in again."
            });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        if(!decodedToken){
            return res.status(401).json({
                message: "Oops! Access denied. Your session has expired. Please sign in againcvcv."
            });
        }
        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.status(404).json({
                message: 'Authentication Failed: User not found'
            });
        }

        req.user = decodedToken;

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Oops! Access denied. Your session has expired. Please sign in    tcf  fagain."
            });
        }
        res.status(500).json({
            Error: error.message
        });
    }
};


export const authenticateAdmin = async (req, res, next) => {
    try {
        const hasAuthorization = req.headers["authorization"]
        if (!hasAuthorization) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }

        const token = hasAuthorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }
        const isTokenRevoked = await RevokedToken.exists({ token });

        if (isTokenRevoked) {
            return res.status(401).json({
                message: "Oops! Access denied. Your session has expired. Please sign in again."
            });
        }

        const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN);
        const admin = await Admin.findById(decodedToken._id);
        if (!admin) {
            return res.status(404).json({
                message: 'Authentication Failed: admin not found'
            });
        }

        req.admin = decodedToken;

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Oops! Access denied. Your session has expired. Please sign in again."
            });
        }
        res.status(500).json({
            Error: error.message
        });
    }
};

