import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [recommendedPrompts, setRecommendedPrompts] = useState([]);

    const handleSendMessage = async () => {
        if (userMessage.trim() === '') return;

        const newChatHistory = [...chatHistory, { sender: 'user', message: userMessage }];
        setChatHistory(newChatHistory);
        
        try {
            const response = await axios.post('http://localhost:4345/chat', { userMessage });
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
