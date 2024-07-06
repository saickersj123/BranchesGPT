import express from "express";

const Routes = express.Router();

// test
Routes.get("/", (req, res, next) => {
	console.log("This is Main Page");
	res.send("hello from Routes");
});

export default Routes;
