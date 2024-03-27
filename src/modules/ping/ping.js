const { writeToLogFile } = require('../../utils/logs');
const DatabaseHandler = require('../../database/database');

async function pingCommandHandler(whatsappBot, message) {
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

        // If either the message is from me or the group or user is allowed, proceed with the command
        if (isMessageFromMe || groupAllowed || userAllowed) {
            const emojis = ['🏓']; // Ball emojis
            const delay = 2000; // Delay between each change in milliseconds

            // Function to send a message with the specified emoji
            const sendMessageWithEmoji = async (emoji) => {
                return await whatsappBot.sendMessage(message?.key?.remoteJid, { text: emoji }, { quoted: message });
            };

            // Send the initial message with the first emoji
            let response = await sendMessageWithEmoji(emojis[0]);

            // Loop to change emoji and send messages
            for (let i = 1; i < emojis.length; i++) {
                await new Promise(resolve => setTimeout(resolve, delay));
                response = await whatsappBot.sendMessage(message?.key?.remoteJid, {
                    text: emojis[i],
                    edit: response.key // Edit the previous message
                });
            }

            // Send "Pong!" after the animation completes
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: 'Pong!', edit: response.key });

            // Log success
            writeToLogFile('Ping-pong animation sent successfully.');
        } else {
            // If the group or user is not allowed, send a message indicating so
            const notAllowedMessage = "Sorry, I'm afraid you don't have the authority to use this command! 🚫 - Chopper";
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: notAllowedMessage }, { quoted: message });
        }
    } catch (error) {
        // Log and handle errors
        console.error('Error in execute function:', error);
        writeToLogFile(`Error in execute function: ${error}`);

        // Send error message
        await whatsappBot.sendMessage(message?.key?.remoteJid, { text: 'An error occurred. Please try again later.' }, { quoted: message });
    }
}

module.exports = { pingCommandHandler };
