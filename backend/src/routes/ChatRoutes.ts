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
		 generateModelChatCompletion,
		 startModelConversation,
		 getModel,
		 getModelConversation,
		 getModelConversations,
		 deleteModelConversations,
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
    "/g/:modelName",
    verifyToken,
    deleteCustomModel,
);

//new model conversation
chatRoutes.post(
    "/g/:modelId/new",
	validate(chatCompletionValidator),
    verifyToken,
	startModelConversation,
    generateModelChatCompletion,
);

//resume conversation with custom model
chatRoutes.post(
	"/g/:modelId/:conversationId",
	validate(chatCompletionValidator),
	verifyToken,
	generateModelChatCompletion,
);

//get a model converstation
chatRoutes.get(
    "/g/:modelId/:conversationId",
    verifyToken,
	getModelConversation,
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
	getModel,
);

//get all model conversations
chatRoutes.get(
    "/all-g/:modelId",
    verifyToken,
	getModelConversations,
);

//delete all model conversations
chatRoutes.delete(
    "/all-g/:modelId",
    verifyToken,
    deleteModelConversations,
)

export default chatRoutes;
