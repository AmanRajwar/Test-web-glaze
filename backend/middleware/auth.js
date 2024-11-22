import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import { CatchAsyncError } from './catchAsyncErrors.js';
import { updateAccessToken } from '../controller/universal.controller.js';


export const isAuthenticated = CatchAsyncError(async (req, res, next) => {

    const access_token = req.cookies.access_token;

    if (!access_token) {
        return next(new ErrorHandler("Please login to access this resource", 400));
    }

    let decoded;
    let expired = false;
    try {
        decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            expired = true;
        } else {
            return next(new ErrorHandler("Access token is not valid", 400));
        }
    }

    if (expired) {
        console.log('expired')
        updateAccessToken(req, res, next)

    } else {
        if (!decoded) {
            return next(new ErrorHandler("Access token is not valid", 400));
        }

        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        req.user = user;  // Attach the user to the request object
        next()
    }

});


// Authorize Roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log("undefined", req.user)
        if (!roles.includes(req.user?.role || "")) {
            return next(
                new ErrorHandler(
                    `Role:${req.user?.role} is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};
