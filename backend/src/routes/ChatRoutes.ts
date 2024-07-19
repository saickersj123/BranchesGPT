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
		 getCustomModels,
		 getModelbyId,
		 startNewConversationwith,
		 } from "../controllers/ChatController.js";
 
const chatRoutes = express.Router();

// test
chatRoutes.get("/", (req, res, next) => {
	console.log("hi");
	res.send("hello from chatRoutes");
});

// protected API
//new conversation
chatRoutes.get(
	"/c/new",
	verifyToken,
	startNewConversation,
);

//new conversation with msg
chatRoutes.post(
	"/c/new",
	validate(chatCompletionValidator),
	verifyToken,
	startNewConversationwith,
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
    "/c/:conversationId",
    verifyToken,
    deleteConversation,
)

//delete all conversations
chatRoutes.delete(
    "/all-c",
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
    "/g/:modelId",
    verifyToken,
    deleteCustomModel,
);

//get all custom models
chatRoutes.get(
    "/all-g",
    verifyToken,
	getCustomModels,
);

//get a custom model
chatRoutes.get(
    "/g/:modelId/",
    verifyToken,
	getModelbyId,
);


export default chatRoutes;
