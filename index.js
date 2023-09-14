const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post('/generate-content', async (req, res) => {
    try {
        const { contentType, keyword } = req.body;
        let prompt;

        // Determine the prompt based on the selected contentType
        switch (contentType) {
            case 'shayari':
                prompt = `Generate a beautiful shayari about ${keyword}.`;
                break;
            case 'joke':
                prompt = `Tell me a funny joke about ${keyword}.`;
                break;
            case 'quote':
                prompt = `Provide an inspiring quote related to ${keyword}.`;
                break;
            case 'poem':
                prompt = `Write a poem about ${keyword}.`;
                break;
            default:
                return res.status(400).json({ error: 'Invalid content type' });
        }

        const response = await axios.post(
            'https://api.openai.com/v1/engines/text-davinci-002/completions',
            {
                prompt: prompt,
                max_tokens: 50, // Adjust this based on your needs
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const content = response.data.choices[0].text;
        res.json({ content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
