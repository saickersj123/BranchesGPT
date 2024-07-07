import { configureOpenAI, Model } from "../config/openai.js";
import OpenAI from "openai";

export const fineTuneModel = async (trainingData: string) => {
    const openai = new OpenAI(configureOpenAI());
    try{
    const response = await openai.fineTuning.jobs.create({
        training_file: trainingData,
        model: Model,
    });
    return response;
    } catch (error) {
        throw new Error(`Failed to fine-tune model: ${error.message}`);
      }
};