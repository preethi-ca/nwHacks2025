// backend

require('dotenv').config();  // Load environment variables from .env
const express = require('express');
const axios = require('axios');
const path = require('path');  // This is for serving static files like HTML

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to serve static files like JavaScript, CSS
app.use(express.static('src'));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// API endpoint to handle chatbot requests
app.post('/chat', async (req, res) => {
    const userInput = req.body.message;
    if (!userInput) {
        return res.status(400).send({ error: 'No input provided' });
    }

    try {
        // const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBnEXuH8ZbCzBrbBdYYshS4tbzvsD6WWDM', {
        // message: userInput
        // }, {
        // headers: {
        //     'API-KEY': process.env.GEMINI_API_KEY,  // Using the Gemini API key from .env
        // },
        // });

        let data = JSON.stringify({
            "contents": [
                {
                    "parts": [
                        {
                            "text": userInput
                        }
                    ]
                }
            ]
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBnEXuH8ZbCzBrbBdYYshS4tbzvsD6WWDM',
            headers: { 
              'x-api-key': 'AIzaSyBnEXuH8ZbCzBrbBdYYshS4tbzvsD6WWDM', 
              'Content-Type': 'application/json'
            },
            data : data
        };
          
        var botRes = "";

        axios.request(config)
        .then((response) => {
            //console.log(response.data);
            //console.log("PART 1");
            //console.log(response.data.candidates[0].content.parts[0].text);

            // Send the response back to the frontend
            res.json({ botResponse: response.data.candidates[0].content.parts[0].text });
            //console.log(typeof botRes);
            //console.log(typeof botRes);
        })
        .catch((error) => {
            console.log(error);
        });

        // const botResponse = botRes;

        // console.log("PART 2");
        // console.log(botRes);  
        // console.log("PART 3");
        // console.log(botResponse);        

        // // Send the response back to the frontend
        // res.json({ botResponse });
        //console.log(botRes);
    } catch (error) {
        console.error(error);
        //console.log(process.env.GEMINI_API_KEY);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});