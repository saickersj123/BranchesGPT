import express from "express";

import {
	getAllUsers,
	userSignUp,
	userLogin,
	verifyUserStatus,
    logoutUser,
	getChatboxes,
	saveChatbox,
	resetChatbox,
	checkPassword,
	changeName,
	changePassword,
	deleteUser,
} from "../controllers/UserController.js";

import {
	loginValidator,
	signUpValidator,
	validate,
	chatboxValidator,
} from "../utils/Validators.js";

import { verifyToken } from "../utils/Token.js";

const userRoutes = express.Router(); 

userRoutes.get("/", getAllUsers);

userRoutes.post("/signup", validate(signUpValidator), userSignUp);

userRoutes.post("/login", validate(loginValidator), userLogin);

userRoutes.get("/auth-status", verifyToken, verifyUserStatus); // check if user cookies are valid so he doesnt have to login again

userRoutes.get("/logout", verifyToken, logoutUser);

userRoutes.post("/mypage", verifyToken, checkPassword);

userRoutes.put("/update-name", verifyToken, changeName);

userRoutes.put("/update-password", verifyToken, changePassword);

userRoutes.delete("/delete", verifyToken, deleteUser);

userRoutes.get("/cbox", verifyToken, getChatboxes);

userRoutes.put("/cbox", validate(chatboxValidator), verifyToken, saveChatbox);

userRoutes.post("/cbox", validate(chatboxValidator), verifyToken, saveChatbox);

userRoutes.put("/cbox/reset", verifyToken, resetChatbox);

export default userRoutes;
