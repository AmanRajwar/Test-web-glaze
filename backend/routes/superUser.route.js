import express from "express";
import { isAuthenticated,authorizeRoles } from "../middleware/auth.js";
import { deleteAdmins, registerAdmin,getAllAdmins } from "../controller/superuser.controller.js";

const superUserRouter = express.Router();

superUserRouter.post('/register-admin',isAuthenticated, authorizeRoles("superuser"), registerAdmin);
superUserRouter.delete('/delete-admin/:adminId',isAuthenticated, authorizeRoles("superuser"), deleteAdmins);
superUserRouter.get('/get-all-admins',isAuthenticated, authorizeRoles("superuser"), getAllAdmins);


export default superUserRouter;
