// backend

require('dotenv').config();  // Load environment variables from .env
const express = require('express');
const axios = require('axios');
const path = require('path');  // This is for serving static files like HTML

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to serve static files like JavaScript, CSS
// app.use(express.static('src'));
// app.use(express.static('resources'));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

const allowedKeywords = ['password', 'cybersecurity', 'encryption', 'security', 'authentication', 'data breach'];

// Function to check if input is relevant
function isValidQuery(userInput) {
    return allowedKeywords.some(keyword => userInput.toLowerCase().includes(keyword));
}

// API endpoint to handle chatbot requests
app.post('/chat', async (req, res) => {
    const userInput = req.body.message;
    if (!userInput) {
        return res.status(400).send({ error: 'No input provided' });
    }

    if (!isValidQuery(userInput)) {
        return res.json({ botResponse: "Oops! I can only chat about passwords and keeping your online stuff safe. Ask me about those and I'll help you out!" });
    }

    try {
        let data = JSON.stringify({
            "contents": [
                {
                    "parts": [
                        {
                            "text": `Please use the simplest terms as if you're explaining to a kid. Here's the question: ${userInput}`
                        }
                    ]
                }
            ]
        });

        const apiKey = process.env.GEMINI_API_KEY;

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            headers: { 
                //'x-api-key': apiKey, 
                'Content-Type': 'application/json'
            },
            data : data
        };
          
        var botRes = "";

        axios.request(config)
        .then((response) => {
            // Send the response back to the frontend
            let botResponse = response.data.candidates[0].content.parts[0].text;

            // Replacing characters in botResponse to HTML tags
            // botResponse = botResponse.replace(/^\*\s+(.*?)$/gm, '<li>$1</li>');
            // if (botResponse.includes('<li>')) {
            //     botResponse = `<ul>${botResponse}</ul>`;
            // }

            botResponse = botResponse.replace(/(?:^|\n)\*\s+(.*?)(?=\n|$)/g, '<li>$1</li>');
            if (botResponse.includes('<li>')) {
                botResponse = botResponse.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
            }

            botResponse = botResponse.replace(/\n\n/g, '<br>');
            botResponse = botResponse.replace(/\n/g, '<br>');
            botResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
            botResponse = botResponse.replace(/\*(.*?)\*/g, '<i>$1</i>'); 
            botResponse = botResponse.replace(/\_(.*?)\_/g, '<i>$1</i>'); 

            let testRes = "* test";
            testRes = testRes.replace(/^\*\s+(.*?)$/gm, '<li>$1</li>');

            res.json({ botResponse: botResponse });
        })
        .catch((error) => {
            //console.log(error);
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
            } else {
                console.error('Error message:', error.message);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});