// frontend

document.getElementById('chatForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    // Add user message to chatbox
    appendMessage('You: ' + userInput, 'user-message');

    // Send the message to the backend
    const response = await fetch('/chat', {
        method: 'POST',
        maxBodyLength: Infinity,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();
    console.log(data);
    const botMessage = data.botResponse || "Sorry, something went wrong.";

    // Add bot's response to chatbox
    appendMessage('Bot: ' + botMessage, 'bot-message');

    // Clear the input field
    document.getElementById('userInput').value = '';
});

// Function to append a message to the chatbox
function appendMessage(message, className) {
    const chatbox = document.getElementById('chatbox');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(className);
    messageDiv.textContent = message;
    chatbox.appendChild(messageDiv);

    // Scroll to the bottom of the chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
}