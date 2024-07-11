import express from "express";
import { verifyToken } from "../utils/Token.js";
import { fineTuneValidator, chatCompletionValidator, validate } from "../utils/Validators.js";
import { deleteConversation, 
		 getConversation, 
		 deleteAllConversations, 
		 generateChatCompletion, 
		 getAllConversations, 
		 startNewConversation,
		 createCustomModel,
		 deleteCustomModel,
		 getCustomModelResponse,
		 getAllCustomModels,
		 getModelName,
		 } from "../controllers/ChatController.js";
 
const chatRoutes = express.Router();

// test
chatRoutes.get("/", (req, res, next) => {
	console.log("hi");
	res.send("hello from chatRoutes");
});

// protected API
//new conversation
chatRoutes.post(
	"/c/new",
	validate(chatCompletionValidator),
	verifyToken,
	startNewConversation,
	generateChatCompletion,
);

//resume conversation
chatRoutes.post(
	"/c/:conversationId",
	validate(chatCompletionValidator),
	verifyToken,
	generateChatCompletion,
);

//get all conversations
chatRoutes.get(
	"/all-c",
	verifyToken,
	getAllConversations,
);

//get a conversation
chatRoutes.get(
	"/c/:conversationId",
	verifyToken,
	getConversation,
);

//delete a conversation
chatRoutes.delete(
    "/delete-c/:conversationId",
    verifyToken,
    deleteConversation,
)

//delete all conversations
chatRoutes.delete(
    "/all-c/delete",
    verifyToken,
    deleteAllConversations,
)

//create custom model
chatRoutes.post(
    "/g/create",
	validate(fineTuneValidator),
    verifyToken,
    createCustomModel,
);

//delete custom model
chatRoutes.delete(
    "/g/delete/:modelName",
    verifyToken,
    deleteCustomModel,
);

//get response from customModel
chatRoutes.post(
    "/g/new/:modelName",
	validate(chatCompletionValidator),
    verifyToken,
	startNewConversation,
    getCustomModelResponse,
);

//resume conversation with custom model
chatRoutes.post(
	"/g/:modelName/:conversationId",
	validate(chatCompletionValidator),
	verifyToken,
	generateChatCompletion,
);

//get a model name
chatRoutes.get(
    "/g/:modelName",
    verifyToken,
	getModelName,
);

//get all custom models
chatRoutes.get(
    "/all-g",
    verifyToken,
	getAllCustomModels,
);

export default chatRoutes;
