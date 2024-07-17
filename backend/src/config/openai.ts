export const configureOpenAI = () => {
    const config = {
        apiKey: process.env.OPEN_AI_SECRET_KEY,
        organization: process.env.OPEN_AI_ORG
    };
    return config;
};
export const ModelName = "gpt-3.5-turbo";