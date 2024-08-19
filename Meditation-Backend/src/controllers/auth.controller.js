import { validationResult } from "express-validator";
import { User } from "../models/users/user.models.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        console.log(accessToken);
        console.log(refreshToken);

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }) //it validate the data is following schema validation or not, we're keeping it false as, we don't want to run it now

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const loginUser = async (req, res) => {
    // Check whether the data is valid or not
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new ApiError(400, "Validation Error", result.array())
        }
        const { email, password } = req.body;

        // Check whether the user with the entered email id exists or not
        let user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(401, "Please, login with correct credentials!")
        }

        // Checking the password
        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            throw new ApiError(401, "Please, login with correct credentials!")
        }

        // Generating auth-token using jsonwebtoken
        const { accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const response = {
            user: loggedInUser,
            accessToken : accessToken,
            refreshToken : refreshToken,
        };

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    response,
                    "User logged In Successfully"
                )
            )

    } catch (error) {
        console.log(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(error.toJSON());
        } else {
            res.status(500).json({ error: "Something went wrong while logging you in" });
        }
    }
}


const registerUser = async (req, res) => {
    // Check whether the data is valid or not
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new ApiError(401, "Validation Error", result.array())
        }

        const { userName, email, password } = req.body;

        // Check whether the email already exists or not
        let user = await User.findOne({ email });
        if (user) {
            throw new ApiError(402, "User already exists")
        }

        // Hash the password using bcrypt js
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);

        // Create the user using User model
        user = await User.create({
            userName,
            email,
            password: secPassword,
        })

        //verifying the user is created successfully or not
        const createdUser = await User.findById(user._id).select(
            "-password -refreshtoken" //removing the unwanted parameters from the response
        )

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user in db")
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        )

    } catch (error) {
        console.log(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(error.toJSON());
        } else {
            res.status(500).json({ error: "Internal serevr error.." });
        }
    }
}


const getUser = async (req, res) => {
    try {
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                req.user,
                "User fetched successfully"
            ))
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Can not get user.." });
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!incomingRefreshToken) {
            return res.status(403).json({
                error: "Can't get refresh token in your cookies or request body"
            })
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(403, "Invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(403, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
        
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken : accessToken || "Can't Generate", refreshToken: refreshToken || "Can't generate"},
                    "Access token refreshed"
                )
            )

    } catch (error) {
        console.log(error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(error.toJSON());
        } else {
            res.status(500).json({
                error: "Can not refresh your authorization token! It's not your fault"
            })
        }
    }
}
export { registerUser, loginUser, getUser, refreshAccessToken }