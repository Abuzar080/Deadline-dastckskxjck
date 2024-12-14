const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    const car_id = req.query.car_id;

    if (!car_id) {
        return res.status(400).json({
            error: 'car_id is required',
            owner: '@AzRdev'
        });
    }

    const apiUrl = `https://api.takaincome.co/?car=${car_id}`;

    try {
        // Fetch data from the external API using Axios
        const response = await axios.get(apiUrl);

        let data = response.data;

        // Check if the "dev" field exists and remove it
        if (data.dev) {
            delete data.dev;
        }

        // Add the custom owner field
        data.owner = '@AzRdev';

        // Send the modified response
        res.status(200).json(data);
    } catch (error) {
        // Handle errors from Axios or the external API
        if (error.response) {
            // API responded with an error
            return res.status(500).json({
                error: 'Failed to fetch data from the external API',
                http_code: error.response.status,
                response: error.response.data,
                owner: '@AzRdev'
            });
        } else if (error.request) {
            // Request was made but no response received
            return res.status(500).json({
                error: 'No response from the external API',
                owner: '@AzRdev'
            });
        } else {
            // General error
            return res.status(500).json({
                error: `Error: ${error.message}`,
                owner: '@AzRdev'
            });
        }
    }
});

// Handle invalid request methods
app.use((req, res) => {
    res.status(405).json({
        error: 'Invalid request method',
        owner: '@AzRdev'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
