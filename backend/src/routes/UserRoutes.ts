import express from "express";

import {
	getAllUsers,
	userSignUp,
	userLogin,
	verifyUserStatus,
    logoutUser
} from "../controllers/UserController.js";

import {
	loginValidator,
	signUpValidator,
	validate,
} from "../utils/Validators.js";

import { verifyToken } from "../utils/Token.js";

const userRoutes = express.Router(); 

userRoutes.get("/", getAllUsers);

userRoutes.post("/signup", validate(signUpValidator), userSignUp);

userRoutes.post("/login", validate(loginValidator), userLogin);

userRoutes.get("/auth-status", verifyToken, verifyUserStatus); // check if user cookies are valid so he doesnt have to login again

userRoutes.get("/logout", verifyToken, logoutUser)

export default userRoutes;
