/**
 * Copyright (C) 2024.
 * Licensed under the GPL-3.0 License;
 * You may not use this file except in compliance with the License.
 * It is supplied in the hope that it may be useful.
 * @project_name : Luffy
 * @author : @anupammaurya6767 <https://github.com/anupammaurya6767>
 * @description : Luffy: Whatsapp torrent mirror leech bot.
 * @version 0.0.1
 */

const { writeToLogFile } = require('../../utils/logs');
const DatabaseHandler = require('../../database/database');
async function speedTestHandler(whatsappBot, message) {
    try {
        const isMessageFromMe = message?.key?.fromMe;

        // Create an instance of DatabaseHandler
        const databaseHandler = new DatabaseHandler();

        // Connect to the database
        await databaseHandler.connect();

        // Get the allowed ID from the environment variable
        const allowedId = process.env.ALLOWED_ID;

        // Find the document with the allowed ID
        const allowedDocument = await databaseHandler.findAllowed({ allowedid: allowedId });

        if (!allowedDocument) {
            console.error('No document found with the allowedid:', allowedId);
            writeToLogFile(`No document found with the allowedid: ${allowedId}`);
            databaseHandler.closeConnection();
            return;
        }

        // Get the group ID and user ID from the message
        const groupId = message?.key?.remoteJid;
        const userId = message?.key?.fromMe ? message?.key?.fromMe : message?.key?.participant;

        // Check if the group is allowed
        const groupAllowed = allowedDocument.groups.includes(groupId);

        // Check if the user is allowed
        const userAllowed = allowedDocument.users.includes(userId);

        // Close the database connection
        databaseHandler.closeConnection();
        if (isMessageFromMe || groupAllowed || userAllowed) {
            const response = await whatsappBot.sendMessage(message?.key?.remoteJid, { text: "Executing speed test" }, { quoted: message });

            const NetworkSpeed = require('network-speed');
            const testNetworkSpeed = new NetworkSpeed();
            const baseUrl = 'https://eu.httpbin.org/stream-bytes/500000';
            const fileSizeInBytes = 500000;
    
            let speed;
    
            // Function to send a loading animation
            const sendLoadingAnimation = async () => {
                const loadingEmojis = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']; // Loading emojis
                let index = 0;
    
                // Update the loading animation every 100 milliseconds
                const interval = setInterval(async () => {
                    await whatsappBot.sendMessage(message?.key?.remoteJid, { text: loadingEmojis[index], edit: response.key });
                    index = (index + 1) % loadingEmojis.length;
                }, 100);
    
                // Return the interval object
                return interval;
            };
    
            // Function to stop the loading animation
            const stopLoadingAnimation = async (loadingInterval) => {
                clearInterval(loadingInterval);
            };
    
            // Run loading animation and download speed calculation simultaneously
            const loadingInterval = await sendLoadingAnimation();
            try {
                speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
            } catch (error) {
                console.error("Error calculating speed:", error);
                writeToLogFile(`Error calculating speed: ${error}`);
            } finally {
                await stopLoadingAnimation(loadingInterval);
            }
    
            // Send the calculated speed
            if (speed) {
                await whatsappBot.sendMessage(message?.key?.remoteJid, { text: `Download speed: ${speed.mbps} Mbps`, edit: response.key });
            } else {
                // Handle case where speed calculation failed
                await whatsappBot.sendMessage(message?.key?.remoteJid, { text: "Failed to calculate download speed", edit: response.key });
            }
    
            // Log success
            writeToLogFile('Speed test completed successfully.');
        } else {
            // If the group or user is not allowed, send a message indicating so
            const notAllowedMessage = "Sorry, I'm afraid you don't have the authority to use this command! 🚫 - Chopper";
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: notAllowedMessage }, { quoted: message });
        }
    } catch (error) {
        // Log and handle errors
        console.error('Error in speedTestHandler function:', error);
        writeToLogFile(`Error in speedTestHandler function: ${error}`);

        // Send error message
        await whatsappBot.sendMessage(message?.key?.remoteJid, { text: 'An error occurred. Please try again later.' });
    }
}

module.exports = { speedTestHandler };
