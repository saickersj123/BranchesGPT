import express from "express";

const Routes = express.Router();

// test
Routes.get("/", (req, res, next) => {
	console.log("main page");
	res.send("this is main page");
});

export default Routes;
