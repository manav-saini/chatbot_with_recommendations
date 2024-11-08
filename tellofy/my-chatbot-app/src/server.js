const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = {
    origin: 'https://my-chatbot-7lo4filr1-manavs-projects-b6da2a2a.vercel.app',
    optionsSuccessStatus: 200,
};
const { Configuration, OpenAI } = require('openai');

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

let userChatHistory = [];

app.post('/chat', async (req, res) => {
    const { apiKey, websiteContent, userMessage } = req.body;

    // Validate API key and other required inputs
    if (!apiKey || !websiteContent || !userMessage) {
        return res.status(400).json({ error: 'Missing required fields: apiKey, websiteContent, or userMessage.' });
    }

    // Initialize OpenAI with dynamic API key
    const openai = new OpenAI({
        apiKey: apiKey,
    });

    // Add user message to chat history
    userChatHistory.push(userMessage);

    // Prepare the prompt with explicit instructions
    const chatHistoryString = userChatHistory.join("\n");
    const prompt = `The following is the provided website content and chat history. You are an assistant that only responds with information that is explicitly provided in the website content. Do not generate any new information that is not present in the website content, even if asked by the user. Only answer using the facts or details provided below. For questions not covered in the content, you can provide a generic response like contact support.

Website content: ${websiteContent}
User chat history: ${chatHistoryString}
User: ${userMessage}
Assistant (respond only based on provided website content):`;

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": prompt }],
            max_tokens: 100, // Limit tokens for concise answers
        });
        const assistantMessage = chatCompletion.choices[0].message.content.trim();

        // Generate recommended prompts asynchronously
        const recommendedPrompts = await generateRecommendedPrompts(openai, websiteContent, chatHistoryString);

        res.json({
            message: assistantMessage,
            recommendedPrompts: recommendedPrompts,
        });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).send('Error generating response.');
    }
});

const generateRecommendedPrompts = async (openai, websiteContent, chatHistory) => {
    // Define the prompt to ask GPT to generate recommended prompts based only on the website content
    const prompt = `Based on the following website content and chat history, suggest specific, relevant prompts the user might ask next. ONLY generate suggestions related to the content provided. Do not suggest anything outside of this context.

Website content: ${websiteContent}
Chat history: ${chatHistory}
Recommended Prompts (only generate prompts that match the provided information):`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ "role": "user", "content": prompt }],
            max_tokens: 150, // Limit tokens to keep recommendations concise
        });

        const generatedText = response.choices[0].message.content.trim();

        // Split the generated text into individual prompt suggestions
        const recommendedPrompts = generatedText.split("\n").filter(p => p).slice(0, 4); // Limit to top 4 prompts

        return recommendedPrompts;
    } catch (error) {
        console.error('Error generating recommended prompts:', error);
        return [];
    }
};

// Start the server
app.listen(4345,() => {
    console.log('Server is running on port 4345');
});
