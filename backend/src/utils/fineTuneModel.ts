import { configureOpenAI, Model } from "../config/openai.js";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

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

export const saveTrainingDataToFile = async (trainingData: string) => {
    const filePath = path.join(__dirname, 'training_data.jsonl');
    const jsonlData = trainingData.split('\n').map(item => JSON.stringify(JSON.parse(item))).join('\n');
    fs.writeFileSync(filePath, jsonlData);
    return filePath;
};

export const uploadTrainingData = async (filePath: string) => {
    const openai = new OpenAI(configureOpenAI());
    try {
        const response = await openai.files.create({
            purpose: 'fine-tune',
            file: fs.createReadStream(filePath),
        });
        return response.id;
    } catch (error) {
        console.error("Error uploading training data:", error);
        throw new Error(`Failed to upload training data: ${error.message}`);
    }
};