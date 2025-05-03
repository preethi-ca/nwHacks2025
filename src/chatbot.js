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

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    const profilePic = document.createElement('img');
    profilePic.classList.add('profile-pic');

    // Conditionally set the profile picture based on the sender (user or bot)
    if (className === 'user-message') {
        profilePic.src = '/resources/user.png';
    } else if (className === 'bot-message') {
        profilePic.src = '/resources/bot.png'; // Or use an SVG for the bot
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add(className);
    //messageDiv.textContent = message;
    messageDiv.innerHTML = message; // Use innerHTML to render the HTML content
    
    messageContainer.appendChild(profilePic);
    messageContainer.appendChild(messageDiv);

    chatbox.appendChild(messageContainer);
    //console.log("append message");

    // Scroll to the bottom of the chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
}