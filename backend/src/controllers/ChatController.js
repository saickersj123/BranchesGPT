const User = require('../models/User');
const { configureOpenAI } = require('../config/openai');
const OpenAI = require('openai');

module.exports = {
async generateChatCompletion(req, res){
	try {
		const { message } = req.body;

		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).json("User not registered / token malfunctioned");
		}

		// grab chats of users
		const chats = user.chats.map(({ role, content }) => ({
			role,
			content,
		}));
		chats.push({ content: message, role: "user" });

		// save chats inside real user object
		user.chats.push({ content: message, role: "user" });

		// send all chats with new ones to OpenAI API
		const config = configureOpenAI();
		const openai = new OpenAI(config);

		// make request to openAi
		// get latest response
		const chatResponse = await openai.completions.create({
			model: "gpt-3.5-turbo",
			messages: chats,
		});

		// push latest response to db
		user.chats.push(chatResponse.data.choices[0].message);
		await user.save();

		return res.status(200).json({ chats: user.chats });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
},

async getAllChats(req, res) {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        
		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res
				.status(401)
				.json({ message: "ERROR", cause: "Permissions didn't match" });
		}
		return res.status(200).json({ message: "OK", chats: user.chats });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
},

async deleteAllChats(req, res) {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        
		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res
				.status(401)
				.json({ message: "ERROR", cause: "Permissions didn't match" });
		}

        user.chats = [];
        await user.save();
		return res.status(200).json({ message: "OK", chats: user.chats });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
}
}