import express from "express";
import superUserRouter from './superUser.route.js'
import adminRoute from './admin.route.js'
import {login,activateAccount, getUserByToken, logoutUser} from '../controller/universal.controller.js'
import { isAuthenticated } from "../middleware/auth.js";

const routes = express.Router();

routes.post('/login',login)
routes.get('/logout',logoutUser)
routes.post('/activate-account',activateAccount)
routes.get('/get-user-by-token',isAuthenticated,getUserByToken)
routes.use('/super-user',superUserRouter)
routes.use('/admin',adminRoute)

export default routes;