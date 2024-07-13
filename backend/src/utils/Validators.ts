import { Request, Response, NextFunction } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		for (let validation of validations) {
			const result = await validation.run(req);
			if (!result.isEmpty()) {
				break;
			}
		}
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}
		res.status(422).json({ errors: errors.array() });
	};
};

export const loginValidator = [
	body("email").trim().isEmail().withMessage("Email is not valid"),
	body("password")
		.trim()
		.isLength({ min: 8, max: 15 })
		.withMessage("Password should contain minimum 8 and maximum 15 characters")
];

export const signUpValidator = [
	body("name").trim().notEmpty().withMessage("Name is required"),
	body("email").trim().isEmail().withMessage("Email is not valid"),
	body("password")
		.trim()
		.isLength({ min: 8, max: 15 })
		.withMessage("Password should contain minimum 8 and maximum 15 characters")
];

export const chatCompletionValidator = [
	body("message").notEmpty().withMessage("Message is required"),
];

export const fineTuneValidator = [
	body("modelName").trim().notEmpty().withMessage("Model name is required"),
	body("trainingData").trim().notEmpty().withMessage("Training data is required"),
];

export const chatboxValidator = [
	body("cbox_x").isNumeric().withMessage("cbox_x must be a number"),
	body("cbox_y").isNumeric().withMessage("cbox_y must be a number"),
	body("cbox_w").isNumeric().withMessage("cbox_w must be a number"),
	body("cbox_h").isNumeric().withMessage("cbox_h must be a number"),
  ];