const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAI } = require('openai');

// Initialize app and OpenAI
const app = express();
app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: "", 
});

// Movie booking website content and user chat history
// let websiteContent = `
// Welcome to MovieFlix - your ultimate destination for booking the latest movies! 
// We offer the latest blockbusters, indie films, and classics at theaters across the country. 
// You can easily browse showtimes, choose your preferred seats, and book your tickets instantly.
// We also provide options for 3D, IMAX, and 4DX experiences. 
// For food and drinks, we offer pre-ordering, allowing you to skip the queue when you arrive at the theater. 
// Enjoy discounts with our loyalty program, and don’t forget to check out our special offers for group bookings and family bundles.
// We also have a refund policy in case your plans change, and our customer support is available 24/7 to assist you with any issues.
// `;

let websiteContent = `
I am a board certified Licensed Professional Counselor (LPC) and TeleMental Health Provider. I am also a Certified Clinical Trauma Professional (CCTP) and Certified Yoga Teacher (CYT).

For over 18 years, I have successfully counseled groups, individuals, couples, families, and children. I am also an on-site counselor and  coach for Dow Jones’ employees at the Princeton campus. Previously I served as a Senior Clinician at Rutgers – UBHC Partial Hospital in New Jersey. I have a special interest in Psycho-Neuro therapy along with the effect of diet (internal echo system) on brain functioning. I earned my Master’s degree in Counseling from the University of Texas at San Antonio, and a Bachelor’s degree in Psychology from Punjab University, Chandigarh, India.

I practice functional therapy, which means when you meet me for a consult or for therapy, instead of giving you a diagnosis and starting treatment, I strive to first know you as a WHOLE person. Our minds and bodies are powerful self-regulating devices, and we can rely on their synchronicity to accommodate our fast-changing needs. To help you reach self-regulation, I’ll employ evidence-based techniques from Psychology (CBT, DBT, etc.), Neurosciences (neurotransmitters, gene impressions, brain cells, etc.), and Yoga Philosophy (mindfulness, mediation, mudras, and basic stretches). In addition, I’ll collaborate with psychiatrists and other doctors if necessary. Self-regulation is important for maintaining equilibrium, and it takes a committed effort to achieve it. I’ll work hard with you because input equals output, and I would like you to succeed.

I’ll focus on your strengths in order to help you manage your challenges. I’ll use my training and expertise in conjunction with your expertise regarding your life, and together we can make a long-lasting positive change. I’ll help you explore your emotional obstacles and old patterns that hinder your self-growth. Some of the many areas in which I can assist you are:

Reducing and overcoming stress, anxiety and depression
Increasing productivity in your personal and professional lives
Re-training your mind for mindful living to achieve your full potential
Managing relationship challenges in personal and professional lives

CHAT HISTORY:
Hey there! Welcome to Holistic Bonfire, I’m your Holistic chatbot - ask me anything or pick from options below
Popular Topics
User
do you also do home sessions?
07:21 PM
Chatbot
Chatbot
I am sorry I was not able to find that information. Please use the contact option and someone from the team will get back to you, feel free to ask me something else.

07:21 PM
User
Do you do group sessions?
07:21 PM
Chatbot
Chatbot
Yes, I do group sessions! Here are some details:

Types of Sessions: I see individuals, couples, and groups.
Focus Areas: Specializing in Anxiety, Depression, and Relationship Issues.
Workshops: Typically include centering meditation, mental health exercises, and guided meditation.
If you have more questions or need to sign up, feel free to ask!

07:22 PM
User
What is the average cost of a session?
07:23 PM
Chatbot
Chatbot
Here are the costs for sessions:

Individual Sessions: $150
Couple Sessions: $175
If you have any more questions or need further information, feel free to ask!
`;

let userChatHistory = [];

app.post('/chat', async (req, res) => {
    const { userMessage } = req.body;
    
    // Add user message to chat history
    userChatHistory.push(userMessage);

    // Prepare prompt based on website content and chat history
    const chatHistoryString = userChatHistory.join("\n");
    const prompt = `Website content and chat history: ${websiteContent}\nUser recent chat history: ${chatHistoryString}\nUser: ${userMessage}\nAssistant:`;

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": prompt }],
            max_tokens: 100, // Limit tokens for concise answers
        });
        const assistantMessage = chatCompletion.choices[0].message.content.trim();

        // Generate recommended prompts asynchronously
        const recommendedPrompts = await generateRecommendedPrompts(chatHistoryString);

        res.json({
            message: assistantMessage,
            recommendedPrompts: recommendedPrompts,
        });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).send('Error generating response.');
    }
});

const generateRecommendedPrompts = async (chatHistory) => {
    // Define the prompt to ask GPT to generate recommended prompts focusing on the website content
    const prompt = `Based on the following movie booking website content and chat history, suggest specific, relevant prompts the user might ask next related to booking movies, seat selection, offers, or other related services. Give the prompts in the tone of user:\n\nWebsite content and past chat history: ${websiteContent}\n\nRecent Chat history: ${chatHistory}\n\nRecommended Prompts:`;

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
app.listen(4345, () => {
    console.log('Server is running on port 4345');
});
