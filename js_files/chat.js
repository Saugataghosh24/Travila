const chatButton = document.getElementById('chat-button');
const chatInterface = document.getElementById('chat-interface');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const closeChat = document.getElementById('close-chat');
const sendMessage = document.getElementById('send-message');

chatButton.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);
userInput.addEventListener('keypress', handleUserInput);
sendMessage.addEventListener('click', sendUserMessage);

function toggleChat() {
    chatInterface.classList.toggle('hidden');
}

function handleUserInput(event) {
    if (event.key === 'Enter') {
        sendUserMessage();
    }
}

function sendUserMessage() {
    const message = userInput.value.trim();
    if (message) {
        appendMessage('user', message);
        userInput.value = '';
        getBotResponse(message);
    }
}


function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex', sender === 'user' ? 'justify-end' : 'justify-start', 'mb-2');
    messageElement.innerHTML = `
        <div class="${sender === 'user' ? 'user-message' : 'bot-message'}">
            ${message}
        </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getBotResponse(message) {
    const API_KEY = 'AIzaSyDQP0dLJApqSBshnfRBLWny3gEIMFYn0kM';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "You are a helpful travel assistant. Provide concise, travel-focused responses. User query: " + message
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                },
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Log the entire response for debugging

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            const botMessage = data.candidates[0].content.parts[0].text;
            appendMessage('bot', botMessage);
        } else {
            throw new Error('Unexpected response structure from the API');
        }
    } catch (error) {
        console.error('Error:', error);
        appendMessage('bot', 'Sorry, I encountered an error. Please try again later.');
    }
}