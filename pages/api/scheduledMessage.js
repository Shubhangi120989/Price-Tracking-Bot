import { databases } from "../../appwrite"; // Adjust the import path as needed
import axios from 'axios';
import { sendMessage } from "../../lib/telegram"; // Adjust the import path as needed

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' }); // Only allow POST requests
    }

    try {
        const existingDocs = await databases.listDocuments('test', 'product');
        console.log(existingDocs);

        if (existingDocs.documents.length === 0) {
            return res.status(404).json({ message: 'No products found in the database.' });
        }

        const results = [];

        for (const item of existingDocs.documents) {
            const url = item.url; // Access the `url` attribute
            const chatId = item.chatId; // Access the `chatId` attribute

            try {
                // Fetch product details asynchronously
                const response = await axios.post(apiUrl, { url: url }, {
                    headers: {
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json'
                    }
                });

                const productName = response.data.product_name || "Unknown Product"; // Check for missing values
                const price = response.data.price || "Price not available";

                // Prepare the message to send
                const message = `Product: ${productName}\nUpdated Price: ${price}`;

                // Send the message to the specified chat ID
                await sendMessage(chatId, message);

                // Store the result for each item
                results.push({ chatId, message });
            } catch (error) {
                console.error(`Error fetching details for URL: ${url}`, error);
                // Optionally, you can inform the user about the error
                const errorMessage = `Error fetching details for: ${url}`;
                await sendMessage(chatId, errorMessage);
                results.push({ chatId, message: errorMessage });
            }
        }

        // Send a success response with the results
        res.status(200).json({ message: 'Messages sent successfully.', results });
    } catch (error) {
        console.error('Error in sendScheduledMessages:', error);
        res.status(500).json({ message: 'An error occurred while sending messages.', error: error.message });
    }
}
