// services/modelStorage.ts
import User from "../models/User.js";

export const saveModel = async (userId: string, modelData: any, modelName: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const existingModelIndex = user.findTunedModels.findIndex((model) => model.modelName === modelName);
    if (existingModelIndex !== -1) {
      user.findTunedModels[existingModelIndex].modelData = modelData;
    } else {
      user.findTunedModels.push({
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

export const loadModel = async (userId: string, modelName: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const model = user.findTunedModels.find((model) => model.modelName === modelName);
    if (!model) {
      throw new Error("Model not found");
    }

    return model;
  } catch (error) {
    throw new Error(`Failed to load model: ${error.message}`);
  }
};

export const deleteModel = async (userId: string, modelName: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const modelIndex = user.findTunedModels.findIndex((model) => model.modelName === modelName);
    if (modelIndex === -1) {
      throw new Error("Model not found");
    }

    user.findTunedModels.splice(modelIndex, 1);
    await user.save();
  } catch (error) {
    throw new Error(`Failed to delete model: ${error.message}`);
  }
};
