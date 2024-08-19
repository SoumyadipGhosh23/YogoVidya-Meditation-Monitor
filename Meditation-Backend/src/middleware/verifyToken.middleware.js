import jwt from 'jsonwebtoken'
import { User } from '../models/users/user.models.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyToken = async (req, res, next) => {
    const authToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!authToken) {
        throw new ApiError(403, "Please authenticate using a valid token!")
    }

    try {
        const decodedToken = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(403, "Please authenticate using a valid token!")
        }

        req.user = user;
        next()

    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(error.toJSON());
        } else {
            return res.status(403).send({ error: "Please authenticate using a valid token!" })
        }
    }
}