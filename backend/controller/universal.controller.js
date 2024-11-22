import { accessTokenOptions, sendToken, refreshTokenOptions, createActivationToken } from "../utils/jwt.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import userModel from "../models/user.model.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

const activationTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);

export const activationtokenOptions = {
    expires: new Date(Date.now() + activationTokenExpire * 60 * 60 * 1000),
    maxAge: activationTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};

// Login User
export const login = CatchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Find the user by email and include the password for comparison
    const user = await userModel.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    if (user.isVerified) {
        // Populate user with team, admin, and users, and send token
        const populatedUser = await userModel.findById(user._id).populate({
            path: "team",
            populate: [
                {
                    path: "admin",
                    select: "user",
                    populate: {
                        path: "user",
                        select: "name email",
                    },
                },
                {
                    path: "users",
                    select: "name email",
                },
            ],
        });

        sendToken(populatedUser, 200, res);
    } else {
        // Handle unverified users and send activation mail
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };

        await sendMail({
            email: user.email,
            subject: "Activate Your Account",
            template: "activation-mail.ejs",
            data,
        });

        res.cookie("activation_token", activationToken.token, activationtokenOptions);

        res.status(201).json({
            success: true,
            user,
        });
    }
});

// Activate User
export const activateAccount = CatchAsyncError(async (req, res, next) => {
    const { activation_code } = req.body;
    const { activation_token } = req.cookies;

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    // Verify activation code
    if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { email } = newUser.user;
    const existUser = await userModel.findOne({ email });

    if (existUser) {
        // Check if user is already verified
        if (existUser.isVerified) {
            return next(new ErrorHandler("Email is already verified", 400));
        }

        // Update user to verified and save
        existUser.isVerified = true;
        await existUser.save();
        sendToken(existUser, 200, res);
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid user",
        });
    }
});

// Logout User
export const logoutUser = CatchAsyncError(async (req, res, next) => {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});

// Update Access Token
export const updateAccessToken = CatchAsyncError(async (req, res, next) => {
    const refresh_token = req.cookies.refresh_token;

    // Verify refresh token
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler("Could not refresh token", 400));
    }

    // Find the user by ID
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
        return next(new ErrorHandler("Could not refresh token", 400));
    }

    // Generate new access and refresh tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "5m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: "3d" });

    req.user = user;
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    next();
});

// Get User By Token
export const getUserByToken = CatchAsyncError(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate({
        path: "team",
        populate: [
            {
                path: "admin",
                select: "user",
                populate: {
                    path: "user",
                    select: "name email",
                },
            },
            {
                path: "users",
                select: "name email",
            },
        ],
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No user found",
        });
    }

    res.status(200).json({
        success: true,
        user,
    });
});
