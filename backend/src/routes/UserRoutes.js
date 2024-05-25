const express = require('express');

const {
	getAllUsers,
	userSignUp,
	userLogin,
	verifyUserStatus,
    logoutUser
} = require('../controllers/UserController');

const {
	loginValidator,
	signUpValidator,
	validate,
} = require('../utils/Validators');

const { verifyToken } = require('../utils/Token');

const userRoutes = express.Router(); 

userRoutes.get("/", getAllUsers);

userRoutes.post("/signup", validate(signUpValidator), userSignUp);

userRoutes.post("/login", validate(loginValidator), userLogin);

userRoutes.get("/auth-status", verifyToken, verifyUserStatus); // check if user cookies are valid so he doesn't have to login again

userRoutes.get("/logout", verifyToken, logoutUser);

module.exports = userRoutes;
