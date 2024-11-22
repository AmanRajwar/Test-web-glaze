import sendMail from "../utils/sendMail.js";
import Admin from "../models/admin.model.js";
import Team from "../models/team.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import userModel from "../models/user.model.js";

// Get admin details with associated teams
export const getAdminWithTeams = CatchAsyncError(async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Find admin by user ID and populate teams
        const admin = await Admin.findOne({ user: userId }).populate("teams");
        if (!admin) {
            return next(new ErrorHandler("Admin not found", 404));
        }

        res.status(200).json({ success: true, admin });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Create a new team and associate it with the admin
export const createTeam = CatchAsyncError(async (req, res, next) => {
    try {
        const { teamName } = req.body;
        const admin = await Admin.findOne({ user: req.user._id });
        if (!admin) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized",
            });
        }

        const team = await Team.create({ name: teamName, admin: admin._id });
        admin.teams.push(team._id); // Link team to admin
        await admin.save();

        res.status(201).json({ success: true, team });
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});

// Register a new member and add them to a team
export const registerMember = CatchAsyncError(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const { teamId } = req.params;

        if (await userModel.findOne({ email })) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return next(new ErrorHandler("Team not found", 404));
        }

        const user = await userModel.create({ name, email, password, role: "user", team: teamId });
        team.users.push(user._id); // Add user to team's members
        await team.save();

        res.status(201).json({
            success: true,
            message: "User registered and added to the team successfully",
            user: { name: user.name, email: user.email, team: user.team },
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Delete a team member by admin
export const deleteMembers = CatchAsyncError(async (req, res, next) => {
    try {
        const { userId, teamId } = req.params;
        const admin = await Admin.findOne({ user: req.user._id }).populate("teams");

        if (!admin) {
            return next(new ErrorHandler("You are not authorized", 403));
        }

        const team = admin.teams.find((team) => team._id.toString() === teamId);
        if (!team || !team.users.includes(userId)) {
            return next(new ErrorHandler("Invalid team or user", 403));
        }

        team.users = team.users.filter((id) => id.toString() !== userId);
        await team.save();
        await userModel.findByIdAndDelete(userId); // Remove user from database

        res.status(200).json({ success: true, message: "User removed from team" });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Delete a team and all its members
export const deleteTeam = CatchAsyncError(async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const admin = await Admin.findOne({ user: req.user._id }).populate("teams");

        if (!admin) {
            return next(new ErrorHandler("You are not authorized", 403));
        }

        const team = admin.teams.find((team) => team._id.toString() === teamId);
        if (!team) {
            return next(new ErrorHandler("Team not found", 403));
        }

        await userModel.deleteMany({ team: teamId }); // Remove all users in the team
        admin.teams = admin.teams.filter((id) => id.toString() !== teamId);
        await admin.save();
        await Team.findByIdAndDelete(teamId); // Delete the team

        res.status(200).json({ success: true, message: "Team and its members deleted" });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get all members of a specific team
export const getTeamMembers = CatchAsyncError(async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const admin = await Admin.findOne({ user: req.user._id }).populate("teams");

        if (!admin) {
            return next(new ErrorHandler("You are not authorized", 403));
        }

        const isTeamValid = admin.teams.some((team) => team._id.toString() === teamId);
        if (!isTeamValid) {
            return next(new ErrorHandler("This team is not associated with the admin", 403));
        }

        const team = await Team.findById(teamId).populate("users", "name email role isVerified");
        if (!team) {
            return next(new ErrorHandler("Team not found", 404));
        }

        res.status(200).json({
            success: true,
            teamName: team.name,
            members: team.users,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
