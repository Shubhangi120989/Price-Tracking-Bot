import { sendMessage } from './telegram';
import {getAmazonProductDetails} from '../webscrap'
import { databases } from '@/appwrite';

import { Query } from 'node-appwrite';
export async function handleCommand(chatId, text) {
    console.log("i m inside handleCommand")
    if (text.startsWith('/ask')) {
        await sendMessage(chatId, 'Service Unavailable');
    } else if (text.startsWith('/start') || text.startsWith('/help')) {
        console.log("saare commands yaha print hone chahiye")
        const msg = `The following commands are available:
/start - Start the bot.
/help - Get help from the bot.
/track - Followed by the link of the Amazon webpage to keep track of price.
/list - To view the list of product items to track.
/delete - Followed by index of item to be deleted.
This is an echo bot.`;
        await sendMessage(chatId, msg);
    } else if (text.startsWith('/track')) {
        console.log(chatId)
        const args = text.split(' ');
        const command = args[0]; // "/product"
        const link = args[1];    // "https://www.example.com/some-page"

        const existing=await databases.listDocuments("test","product",[
            Query.equal('chatId',String(chatId)),
            Query.equal('url',link)

        ])
        if(existing.total==0){
            const newDocument = await databases.createDocument("test", "product", 'unique()', {
                "chatId":String(chatId),
                "url":link,
              });

        }
        
        let msg  = await getAmazonProductDetails(link)
        const productName=msg.product_name
        const price=msg.price
        msg=`Product Name: ${productName}
Current Price: Rs. ${price}`
        await sendMessage(chatId, msg);
    }
    else if(text.startsWith('/list')){
        try {
            const existingItems = await databases.listDocuments("test", "product", [
                Query.equal('chatId', String(chatId)),
            ]);
    
            if (existingItems.documents.length > 0) {
                // Initialize the response message
                let responseMessage = "Here is your tracked product list:\n";
    
                // Loop through each item to access the url and other attributes
                for (let [index, item] of existingItems.documents.entries()) {
                    const url = item.url; // Access the `url` attribute
    
                    try {
                        // Fetch product details asynchronously
                        const details = await getAmazonProductDetails(url);
                        const productName = details.product_name || "Unknown Product"; // Check for missing values
                        const price = details.price || "Price not available";
    
                        // Append each item to the response message
                        responseMessage += `${index + 1}. ${url} - ${productName} \n **(Current Price: Rs. ${price})**\n`;
                    } catch (error) {
                        console.error(`Error fetching details for URL: ${url}`, error);
                        responseMessage += `${index + 1}. ${url} - Error fetching details\n`;
                    }
                }
    
                // Send the formatted message back to the user
                await sendMessage(chatId, responseMessage,{ parse_mode: "Markdown" });
            } else {
                await sendMessage(chatId, "No products found in your list.");
            }
        } catch (error) {
            console.error("Error fetching product list:", error);
            await sendMessage(chatId, "An error occurred while fetching your product list.");
        }

    }else if(text.startsWith("/delete")){
        const args = text.split(' '); // Split the command to get the index
    const indexToDelete = parseInt(args[1], 10) - 1; // Convert to zero-based index

    if (isNaN(indexToDelete) || indexToDelete < 0) {
        await sendMessage(chatId, "Please provide a valid index to delete.");
        return;
    }

    try {
        // Fetch the list of products for the user
        const existingItems = await databases.listDocuments("test", "product", [
            Query.equal('chatId', String(chatId)),
        ]);

        if (existingItems.documents.length === 0) {
            await sendMessage(chatId, "No products found in your list.");
            return;
        }

        if (indexToDelete >= existingItems.documents.length) {
            await sendMessage(chatId, `Invalid index. You have ${existingItems.documents.length} items in your list.`);
            return;
        }

        // Get the document ID of the item at the specified index
        const documentIdToDelete = existingItems.documents[indexToDelete].$id;

        // Delete the item from the database
        await databases.deleteDocument("test", "product", documentIdToDelete);

        await sendMessage(chatId, `Item #${indexToDelete + 1} has been successfully deleted.`);
    } catch (error) {
        console.error("Error deleting product:", error);
        await sendMessage(chatId, "An error occurred while trying to delete the product.");
    }

    }
    else {
        await sendMessage(chatId, text);
    }
}




