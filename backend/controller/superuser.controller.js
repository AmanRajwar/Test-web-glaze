import userModel from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Team from "../models/team.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Register a new admin
export const registerAdmin = CatchAsyncError(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email already exists
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        // Create a new user with the admin role
        const user = await userModel.create({ email, password, name, role: "admin" });

        // Create an admin record associated with the user
        const admin = await Admin.create({ user: user._id });

        res.status(201).json({ success: true, admin });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Delete an admin and all associated teams and users
export const deleteAdmins = CatchAsyncError(async (req, res, next) => {
    try {
        const { adminId } = req.params;

        // Check if the admin exists
        const admin = await Admin.findById(adminId).populate("teams");
        if (!admin) {
            return next(new ErrorHandler("Admin not found", 404));
        }

        // Collect IDs of all teams managed by this admin
        const teamIds = admin.teams.map((team) => team._id);

        // Delete all users associated with the admin's teams
        await userModel.deleteMany({ team: { $in: teamIds } });

        // Delete all teams managed by this admin
        await Team.deleteMany({ _id: { $in: teamIds } });

        // Delete the admin's user and admin record
        await userModel.findByIdAndDelete(admin.user);
        await Admin.findByIdAndDelete(adminId);

        res.status(200).json({
            success: true,
            message: `Admin with ID ${adminId} has been deleted, along with ${admin.teams.length} teams and all associated users.`,
            deletedAdmin: {
                id: admin._id,
                user: admin.user,
                teams: admin.teams.map((team) => team._id),
            },
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 404));
    }
});

// Get all admins with their teams and users
export const getAllAdmins = CatchAsyncError(async (req, res, next) => {
    try {
        // Fetch all admins, populate user details and their associated teams and users
        const admins = await Admin.find({})
            .populate({
                path: "user", 
                select: "name email role",
            })
            .populate({
                path: "teams", 
                populate: {
                    path: "users", 
                    select: "name email",
                },
            });

        // Handle case when no admins are found
        if (!admins || admins.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No admins found",
            });
        }

        // Format the response with structured admin data
        res.status(200).json({
            success: true,
            admins: admins.map((admin) => ({
                id: admin._id,
                user: admin.user, // Admin's user details
                teams: admin.teams.map((team) => ({
                    id: team._id,
                    name: team.name,
                    users: team.users, // Users in the team
                })),
            })),
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 404));
    }
});
