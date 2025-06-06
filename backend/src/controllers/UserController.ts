import { Request, Response, NextFunction } from "express";
import { hash, compare } from "bcrypt";

import User from "../models/User.js";
import { createToken } from "../utils/Token.js";
import { COOKIE_NAME } from "../utils/Constants.js";

export const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
		const users = await User.find();
		res.status(200).json({ message: "OK", users });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "ERROR", cause: error.message });
	}
};

export const userSignUp = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
		const { name, email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			res.status(409).json({
				message: "ERROR",
				cause: "User with same email already exists",
			});
			return;
		}

		const hashedPassword = await hash(password, 10);
		const user = new User({ name, email, password: hashedPassword });
		await user.save();

		// create token and store cookie

		res.cookie(COOKIE_NAME,'clear_token' ,
			{
				path: "/", //cookie directory in browser
				domain: process.env.DOMAIN, // our website domain
				maxAge: 0,
				httpOnly: true,
				signed: true,
				sameSite: 'lax',
				secure: true,
			});

		// create token
		const token = createToken(user._id.toString(), user.email, "7d");

		const expires = new Date();
		expires.setDate(expires.getDate() + 7);

		res.cookie(COOKIE_NAME, token, {
			path: "/", //cookie directory in browser
			domain: process.env.DOMAIN, // our website domain
			expires, // same as token expiration time
			httpOnly: true,
			signed: true,
			sameSite: 'lax',
			secure: true,
		});

		res.status(201).json({ message: "OK", name: user.name, email: user.email });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "ERROR", cause: error.message });
	}
};

export const userLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
		const { email, password } = req.body;
		console.log(email, password);

		const user = await User.findOne({ email });
		if (!user) {
			res.status(409).json({
				message: "ERROR",
				cause: "No account with given emailID found",
			});
			return;
		}

		const isPasswordCorrect = await compare(password, user.password);
		if (!isPasswordCorrect) {
			res.status(403).json({ message: "ERROR", cause: "Incorrect Password" });
			return;
		}

		// if user will login again we have to -> set new cookies -> erase previous cookies
		res.cookie(COOKIE_NAME,'clear_token' ,
			{
				path: "/", //cookie directory in browser
				domain: process.env.DOMAIN, // our website domain
				maxAge: 0,
				httpOnly: true,
				signed: true,
				sameSite: 'lax',
				secure: true,
			});

		// create token
		const token = createToken(user._id.toString(), user.email, "7d");

		const expires = new Date();
		expires.setDate(expires.getDate() + 7);

		res.cookie(COOKIE_NAME, token, {
			path: "/", //cookie directory in browser
			domain: process.env.DOMAIN, // our website domain
			expires, // same as token expiration time
			httpOnly: true,
			signed: true,
			sameSite: 'lax',
			secure: true,
		});

		res.status(200).json({ message: "OK", name: user.name, email: user.email });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "ERROR", cause: error.message });
	}
};

export const verifyUserStatus = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware

		if (!user) {
			res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
			return;
		}

		if (user._id.toString() !== res.locals.jwtData.id) {
			res.status(401).json({ message: "ERROR", cause: "Permissions didn't match" });
			return;
		}

		res.status(200).json({ message: "OK", name: user.name, email: user.email });
	} catch (err) {
		console.log(err);
		res.status(200).json({ message: "ERROR", cause: err.message});
	}
};

export const logoutUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware

		if (!user) {
			res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
			return;
		}

		if (user._id.toString() !== res.locals.jwtData.id) {
			res.status(401).json({ message: "ERROR", cause: "Permissions didn't match" });
			return;
		}

        res.cookie(COOKIE_NAME,'clear_token' ,
			{
				path: "/", //cookie directory in browser
				domain: process.env.DOMAIN, // our website domain
				maxAge: 0,
				httpOnly: true,
				signed: true,
				sameSite: 'lax',
				secure: true,
			});

		res.status(200).json({ message: "OK", name: user.name, email: user.email });
	} catch (err) {
		console.log(err);
		res.status(200).json({ message: "ERROR", cause: err.message});
	}
};

export const changeName = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
		const { name } = req.body;
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware

		if (!user) {
			res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
			return;
		}

		if (user._id.toString() !== res.locals.jwtData.id) {
			res.status(401).json({ message: "ERROR", cause: "Permissions didn't match" });
			return;
		}

		user.name = name;
		await user.save();

		res.status(200).json({ message: "OK", name: user.name, email: user.email });
	} catch (err) {
		console.log(err);
		res.status(200).json({ message: "ERROR", cause: err.message});
	}
};

export const changePassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
		const { password } = req.body;
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware

		if (!user) {
			res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
			return;
		}

		if (user._id.toString() !== res.locals.jwtData.id) {
			res.status(401).json({ message: "ERROR", cause: "Permissions didn't match" });
			return;
		}

		const hashedPassword = await hash(password, 10);
		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: "OK", name: user.name, email: user.email });
	} catch (err) {
		console.log(err);
		res.status(200).json({ message: "ERROR", cause: err.message});
	}
};

export const checkPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
		const { password } = req.body;
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware

		if (!user) {
			res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
			return;
		}

		if (user._id.toString() !== res.locals.jwtData.id) {
			res.status(401).json({ message: "ERROR", cause: "Permissions didn't match" });
			return;
		}

		const isPasswordCorrect = await compare(password, user.password);
		if (!isPasswordCorrect) {
			res.status(403).json({ message: "ERROR", cause: "Incorrect Password" });
			return;
		}

		res.status(200).json({ message: "OK", name: user.name, email: user.email });
	} catch (err) {
		console.log(err);
		res.status(200).json({ message: "ERROR", cause: err.message});
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware

		if (!user) {
			res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
			return;
		}

		if (user._id.toString() !== res.locals.jwtData.id) {
			res.status(401).json({ message: "ERROR", cause: "Permissions didn't match" });
			return;
		}

		await User.findByIdAndDelete(res.locals.jwtData.id);
		res.status(200).json({ message: "OK" });
	} catch (err) {
		console.log(err);
		res.status(200).json({ message: "ERROR", cause: err.message});
	}
};

export const saveChatbox = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
        const { cbox_x, cbox_y, cbox_w, cbox_h } = req.body;
        const userId = res.locals.jwtData.id;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { ChatBox: { cbox_x, cbox_y, cbox_w, cbox_h } } },
            { new: true, upsert: true } // new: return the modified document, upsert: create if doesn't exist
        );

        if (!updatedUser) {
            res.status(401).json("User not registered / token malfunctioned");
            return;
        }

        res.status(200).json({ message: "Chatbox saved or updated", chatbox: updatedUser.ChatBox });
    } catch (error) {
        console.error("Error saving or updating chatbox:", error);
        res.status(500).json({ message: error.message });
    }
  };

export const getChatboxes = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
	  	const user = await User.findById(res.locals.jwtData.id);

	  	if (!user) {
			res.status(401).json("User not registered / token malfunctioned");
			return;
	  	}
  
	  	res.status(200).json({ chatboxes: user.ChatBox });
	} catch (error) {
	  	console.log(error);
	  	res.status(500).json({ message: error.message });
	}
  };

  export const resetChatbox = async (
	req: Request,
	res: Response,
	next: NextFunction
) : Promise<void> => {
	try {
	  	const user = await User.findById(res.locals.jwtData.id);
	  	if (!user) {
			res.status(401).json("User not registered / token malfunctioned");
			return;
	 	 }
  
		user.ChatBox.push({ cbox_x: 2, cbox_y: 0.5, cbox_w: 8, cbox_h: 8 });
		await user.save();
  
	  	res.status(200).json({ message: "Chatbox resetted", chatbox: user.ChatBox });
	} catch (error) {
	  	console.log(error);
	  	res.status(500).json({ message: error.message });
	}
  };