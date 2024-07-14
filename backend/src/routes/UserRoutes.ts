import express from "express";

import {
	getAllUsers,
	userSignUp,
	userLogin,
	verifyUserStatus,
    logoutUser,
	checkpassword,
	changename,
	changepassword,
	deleteuser,
	getChatboxes,
	saveChatbox,
	resetChatbox,
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

userRoutes.post("/mypage", verifyToken, checkpassword);

userRoutes.put("/update-name", verifyToken, changename);

userRoutes.put("/update-password", verifyToken, changepassword);

userRoutes.delete("/delete", verifyToken, deleteuser );

userRoutes.get("/cbox", verifyToken, getChatboxes);

userRoutes.put("/cbox", validate(chatboxValidator), verifyToken, saveChatbox);

userRoutes.post("/cbox", validate(chatboxValidator), verifyToken, saveChatbox);

userRoutes.put("/cbox/reset", verifyToken, resetChatbox);

export default userRoutes;
