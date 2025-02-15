import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./Constants.js";

type ExpiresIn = `${number}d` | `${number}h` | `${number}m` | `${number}s`;

export const createToken = (id: string, email: string, expiresIn: ExpiresIn) => {
	const payload = { id, email };
  
	if (!process.env.JWT_SECRET) {
	  throw new Error("JWT_SECRET environment variable is not defined.");
	}
  
	const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
	  expiresIn
	});
  
	return token;
  };

export const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const token = req.signedCookies[COOKIE_NAME];

	if (!token || token.trim() === "") {
		res.status(401).json({ message: "Token Not Received" });
		return; // Terminate the function early
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
		res.locals.jwtData = decoded;
		next(); // Proceed to the next middleware or route handler
	} catch (err) {
		res.status(401).json({ message: "Token Expired" });
	}
};
