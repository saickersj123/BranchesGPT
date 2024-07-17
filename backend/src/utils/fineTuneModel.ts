import { configureOpenAI, ModelName } from "../config/openai.js";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fineTuneModel = async (trainingFileId: string) => {
    const openai = new OpenAI(configureOpenAI());
    try{
    const response = await openai.fineTuning.jobs.create({
        training_file: trainingFileId,
        model: ModelName,
    });
    return response;
    } catch (error) {
        throw new Error(`Failed to fine-tune model: ${error.message}`);
      }
};

export const saveTrainingDataToFile = async (trainingData: string) => {
    const filePath = path.join(__dirname, 'training-file.jsonl');
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