// services/modelStorage.ts
import User from "../models/User.js";

export const saveModel = async (userId: string, modelData: any, modelName: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const existingModelIndex = user.CustomModels.findIndex((model) => model.modelName === modelName);
    if (existingModelIndex !== -1) {
      user.CustomModels[existingModelIndex].modelData = modelData;
    } else {
      user.CustomModels.push({
        modelId: modelData.id,
        modelName,
        modelData,
      });
    }

    await user.save();
  } catch (error) {
    throw new Error(`Failed to save model: ${error.message}`);
  }
};

export const loadModel = async (userId: string, modelId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const model = user.CustomModels.find((model) => model.modelId === modelId);
    if (!model) {
      throw new Error("Model not found");
    }

    return model;
  } catch (error) {
    throw new Error(`Failed to load model: ${error.message}`);
  }
};

export const deleteModel = async (userId: string, modelId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const modelIndex = user.CustomModels.findIndex((model) => model.modelId === modelId);
    if (modelIndex === -1) {
      throw new Error("Model not found");
    }

    user.CustomModels.splice(modelIndex, 1);
    await user.save();
  } catch (error) {
    throw new Error(`Failed to delete model: ${error.message}`);
  }
};
