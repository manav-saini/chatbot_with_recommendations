// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//     const [userMessage, setUserMessage] = useState('');
//     const [chatHistory, setChatHistory] = useState([]);
//     const [recommendedPrompts, setRecommendedPrompts] = useState([]);
//     const [sessionId] = useState(generateSessionId()); // Generate unique session ID per user
//     const [apiKey, setApiKey] = useState('');
//     const [websiteContent, setWebsiteContent] = useState('');

//     // Function to generate a random session ID
//     function generateSessionId() {
//         return '_' + Math.random().toString(36).substr(2, 9);
//     }

//     const handleSendMessage = async () => {
//         if (userMessage.trim() === '' || !apiKey || !websiteContent) return; // Ensure API key and website content are provided

//         const newChatHistory = [...chatHistory, { sender: 'user', message: userMessage }];
//         setChatHistory(newChatHistory);

//         try {
//             // Send the required information to the backend
//             const response = await axios.post('http://localhost:4345/chat', {
//                 apiKey,
//                 websiteContent,
//                 userMessage,
//                 sessionId
//             });

//             const assistantMessage = response.data.message;
//             const prompts = response.data.recommendedPrompts;

//             setChatHistory([...newChatHistory, { sender: 'assistant', message: assistantMessage }]);
//             setRecommendedPrompts(prompts);
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }

//         setUserMessage('');
//     };

//     const handlePromptClick = (prompt) => {
//         setUserMessage(prompt);
//     };

//     return (
//         <div className="App">
//             <div className="input-container">
//                 <input
//                     type="text"
//                     placeholder="Enter API Key"
//                     value={apiKey}
//                     onChange={(e) => setApiKey(e.target.value)}
//                 />
//                 <textarea
//                     placeholder="Enter Website Content"
//                     value={websiteContent}
//                     onChange={(e) => setWebsiteContent(e.target.value)}
//                 />
//             </div>
//             <div className="chat-container">
//                 <div className="chat-history">
//                     {chatHistory.map((chat, index) => (
//                         <div key={index} className={chat.sender === 'user' ? 'chat-user' : 'chat-assistant'}>
//                             {chat.message}
//                         </div>
//                     ))}
//                 </div>
//                 <div className="chat-input">
//                     <input
//                         type="text"
//                         value={userMessage}
//                         onChange={(e) => setUserMessage(e.target.value)}
//                         onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                     />
//                     <button onClick={handleSendMessage}>Send</button>
//                 </div>
//                 {recommendedPrompts.length > 0 && (
//                     <div className="recommended-prompts">
//                         <h4>Recommended Prompts:</h4>
//                         {recommendedPrompts.map((prompt, index) => (
//                             <button key={index} onClick={() => handlePromptClick(prompt)}>
//                                 {prompt}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default App;

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [recommendedPrompts, setRecommendedPrompts] = useState([]);
    const [sessionId] = useState(generateSessionId()); // Generate unique session ID per user
    const [apiKey, setApiKey] = useState('');
    const [websiteContent, setWebsiteContent] = useState('');

    // Function to generate a random session ID
    function generateSessionId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const handleSendMessage = async () => {
        if (userMessage.trim() === '' || !apiKey || !websiteContent) return; // Ensure API key and website content are provided

        const newChatHistory = [...chatHistory, { sender: 'user', message: userMessage }];
        setChatHistory(newChatHistory);

        try {
            // Send the required information to the backend
            const response = await axios.post('http://34.136.210.72:4345/chat', {
                apiKey,
                websiteContent,
                userMessage,
                sessionId
            });

            const assistantMessage = response.data.message;
            const prompts = response.data.recommendedPrompts;

            setChatHistory([...newChatHistory, { sender: 'assistant', message: assistantMessage }]);
            setRecommendedPrompts(prompts);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setUserMessage('');
    };

    const handlePromptClick = (prompt) => {
        setUserMessage(prompt);
    };

    return (
        <div className="App">
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <textarea
                    placeholder="Enter Website Content"
                    value={websiteContent}
                    onChange={(e) => setWebsiteContent(e.target.value)}
                />
            </div>
            <div className="chat-container">
                <div className="chat-history">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={chat.sender === 'user' ? 'chat-user' : 'chat-assistant'}>
                            {chat.message}
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
                {recommendedPrompts.length > 0 && (
                    <div className="recommended-prompts">
                        <h4>Recommended Prompts:</h4>
                        {recommendedPrompts.map((prompt, index) => (
                            <button key={index} onClick={() => handlePromptClick(prompt)}>
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
