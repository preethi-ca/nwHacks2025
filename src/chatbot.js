// frontend

// On clicking send or pressing Enter
document.getElementById('chatForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    // Add user message to chatbox
    appendMessage(userInput, 'user-message');

    // Show typing indicator
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'block';

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

    const botMessage = data.botResponse || "Sorry, something went wrong.";

    // Hide typing indicator
    typingIndicator.style.display = 'none';

    // Add bot's response to chatbox
    appendMessage(botMessage, 'bot-message');

    // Clear the input field
    document.getElementById('userInput').value = '';
});

// Function to append a message to the chatbox
function appendMessage(message, className) {
    const chatbox = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(className);
    messageDiv.textContent = message;
    chatbox.appendChild(messageDiv);
    //console.log("append message");

    // Scroll to the bottom of the chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
}