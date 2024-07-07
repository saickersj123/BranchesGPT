import fs from "fs";
import path from "path";

const modelsDirectory = path.resolve(__dirname, "../customModels");

if (!fs.existsSync(modelsDirectory)) {
  fs.mkdirSync(modelsDirectory);
}

export const saveModel = (modelData: any, fileName: string) => {
  try {
    const data = JSON.stringify(modelData);
    fs.writeFileSync(path.join(modelsDirectory, `${fileName}.json`), data, "utf8");
  } catch (error) {
    throw new Error(`Failed to save model: ${error.message}`);
  }
};

export const loadModel = (fileName: string) => {
  try {
    const rawData = fs.readFileSync(path.join(modelsDirectory, `${fileName}.json`), "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    throw new Error(`Failed to load model: ${error.message}`);
  }
};