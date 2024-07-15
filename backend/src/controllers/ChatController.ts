import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { configureOpenAI, Model } from "../config/openai.js";
import OpenAI from "openai";
import { saveModel, loadModel, deleteModel } from "../utils/modelStorage.js";
import { fineTuneModel, saveTrainingDataToFile, uploadTrainingData } from "../utils/fineTuneModel.js"

 
export const generateChatCompletion = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { message } = req.body;

		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).json("User not registered / token malfunctioned");
		}

		// Add the user's message to the conversation
		const conversation = user.conversations[user.conversations.length - 1];

		// Prepare messages for OpenAI API
		const chats = conversation.chats.map(({ role, content }) => ({
			role,
			content,
		})) ;
		chats.push({ content: message, role: "user" });

		conversation.chats.push({ content: message, role: "user" });
		// send all chats with new ones to OpenAI API
		const config = configureOpenAI();
		const openai = new OpenAI(config);

		// make request to openAi
		// get latest response
		const chatResponse = await openai.chat.completions.create({
			model: Model,
			messages: chats as OpenAI.Chat.ChatCompletionMessageParam[],
		});

		// push latest response to db
		conversation.chats.push(chatResponse.choices[0].message);
		await user.save();

		return res.status(200).json({ chats: conversation.chats });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export const getAllConversations = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
		return res.status(200).json({ message: "OK", conversations: user.conversations });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};

export const deleteAllConversations = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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

        //@ts-ignore
        user.conversations = [];
        await user.save()
		return res.status(200).json({ message: "OK", conversations: user.conversations });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};

export const startNewConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id);

		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		user.conversations.push({ chats: [] });
		await user.save();

		return res.status(200).json({ message: "New conversation started", conversations: user.conversations });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const getConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id);
		const { conversationId } = req.params;

		if (!user) {
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
		}

		const conversation = user.conversations.id(conversationId);
		if (!conversation) {
			return res.status(404).json({
				message: "ERROR",
				cause: "Conversation not found",
			});
		}

		return res.status(200).json({ message: "OK", conversation });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const deleteConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id);
		const { conversationId } = req.params;

		if (!user) {
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
		}

		const conversation = user.conversations.id(conversationId);
		if (!conversation) {
			return res.status(404).json({
				message: "ERROR",
				cause: "Conversation not found",
			});
		}

		// Remove the conversation
		user.conversations.pull(conversationId);
		await user.save();

		return res.status(200).json({ message: "OK", conversations: user.conversations });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const createCustomModel = async (
	req: Request,
	res: Response,
	next: NextFunction) => {
	try {
		const userId = res.locals.jwtData.id;
		const { trainingData, modelName } = req.body;
        const trainingFilePath = await saveTrainingDataToFile(trainingData);
        const trainingFileId = await uploadTrainingData(trainingFilePath);
	  	const fineTunedModel = await fineTuneModel(trainingFileId);
  
	  	saveModel(userId, fineTunedModel, modelName);
  
	  	res.status(201).json({ message: "Model fine-tuned and saved", model: fineTunedModel, trainingFileId });
	} catch (err) {
	  	res.status(500).json({ error: err.message });
	}
  };

export const deleteCustomModel = async (
	req: Request,
	res: Response,
	next: NextFunction) => {
	try {
		const userId = res.locals.jwtData.id;
	  	const { modelId } = req.params;
	  	deleteModel(userId, modelId);

	  	res.status(200).json({ message: "Model deleted" });
	} catch (err) {
	  	res.status(500).json({ error: err.message });
	}
  };

export const generateModelChatCompletion = async (
	req: Request,
	res: Response,
	next: NextFunction
  ) => {
	try {
	  	const userId = res.locals.jwtData.id;
	  	const { message } = req.body;
		const { modelId } = req.params;
  
	  	//Load custom model
	  	const model = await loadModel(userId, modelId);
  
		// Prepare messages for OpenAI API
		const conversation = model.conversations[model.conversations.length - 1];
	  	const chats = conversation.chats.map(({ role, content }) => ({
			role,
			content,
		}));
	  	chats.push({ content: message, role: "user" });
  
	  	conversation.chats.push({ content: message, role: "user" });
  
	  	//configure OpenAI
	  	const configuration = configureOpenAI();
	  	const openai = new OpenAI(configuration);
  
	  	//Chat complietion from custom model
	  	const response = await openai.chat.completions.create({
			model: model.modelData.id,
			messages: chats as OpenAI.Chat.ChatCompletionMessageParam[],
			max_tokens: 150,
	  	});
  
		// push latest response to db
	  	conversation.chats.push(response.choices[0].message);
	  	await model.save();
  
	  	return res.status(200).json({ chats: conversation.chats });
	} catch (error) {
	  	console.log(error);
	  	return res.status(500).json({ message: error.message });
	}
  };

export const getCustomModels = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
		return res.status(200).json({ message: "OK", CustomModels: user.CustomModels });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};

export const getModelConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = res.locals.jwtData.id;
		const { conversationId, modelId } = req.params;
		const model = await loadModel(userId, modelId);

		const conversation = model.conversations.id(conversationId);
		if (!conversation) {
			return res.status(404).json({
				message: "ERROR",
				cause: "Conversation not found",
			});
		}

		return res.status(200).json({ message: "OK", conversation });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const deleteModelConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = res.locals.jwtData.id;
		const { modelId, conversationId } = req.params;
		const model = await loadModel(userId, modelId);

		const conversation = model.conversations.id(conversationId);
		if (!conversation) {
			return res.status(404).json({
				message: "ERROR",
				cause: "Conversation not found",
			});
		}

		// Remove the conversation
		model.conversations.pull(conversationId);
		await model.save();

		return res.status(200).json({ message: "OK", conversations: model.conversations });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const startModelConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = res.locals.jwtData.id;
		const { modelId } = req.params;
		const model = await loadModel(userId, modelId);
		model.conversations.push({ chats: [] });
		await model.save();

		return res.status(200).json({ message: "New conversation started", conversations: model.conversations });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const getModel = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = res.locals.jwtData.id;
		const { modelId } = req.params;
		const model = await loadModel(userId, modelId);

		return res.status(200).json({ message: "OK", model });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const getModelConversations = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { modelId } = req.params;
		const userId = res.locals.jwtData.id; // get variable stored in previous middleware
        const model = await loadModel(userId, modelId);
		const conversations = model.conversations;
		if(!conversations){
			return res.status(404).json({ message: "ERROR", cause: "Conversations not found" });
		}

		return res.status(200).json({ message: "OK", conversations });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};

export const deleteModelConversations = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { modelId } = req.params;
		const userId = res.locals.jwtData.id; // get variable stored in previous middleware
        const model = await loadModel(userId, modelId);

        //@ts-ignore
        model.conversations = [];
        await model.save()
		return res.status(200).json({ message: "OK", conversations: model.conversations });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};