import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
import { createTeam, deleteMembers, deleteTeam, getAdminWithTeams, getTeamMembers, registerMember } from "../controller/admin.controller.js";



const adminRoute = express.Router();

adminRoute.post('/create-team',isAuthenticated,authorizeRoles('admin'),createTeam);
adminRoute.post('/register-member/:teamId',isAuthenticated,authorizeRoles('admin'),registerMember);
adminRoute.get('/get-team-members/:teamId',isAuthenticated,authorizeRoles('admin'),getTeamMembers);
adminRoute.delete("/teams/:teamId/users/:userId",isAuthenticated,authorizeRoles('admin'),deleteMembers);
adminRoute.get("/get-details/:userId",isAuthenticated,authorizeRoles('admin'),getAdminWithTeams);
adminRoute.delete("/team/:teamId",isAuthenticated,authorizeRoles('admin'),deleteTeam);

export default adminRoute