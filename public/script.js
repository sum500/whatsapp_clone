const socket = io(); // Connect to the server

const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

// Store messages locally
let localMessages = [];

// Render messages in the UI
function renderMessages(messages) {
    messagesDiv.innerHTML = ''; // Clear current messages
    messages.forEach((msg) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.classList.add(msg.sender === socket.id ? 'user' : 'other');
        messageElement.innerHTML = `<p>${msg.text}</p>`;
        messagesDiv.appendChild(messageElement);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
}

// Load previous messages
socket.on('initial messages', (messages) => {
    localMessages = messages;
    renderMessages(localMessages);
});

// Add new message to the UI
socket.on('chat message', (msg) => {
    localMessages.push(msg);
    renderMessages(localMessages);
});

// Send a new message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (text) {
        // Emit message to the server
        socket.emit('chat message', { text });
        messageInput.value = ''; // Clear the input field
    }
});
