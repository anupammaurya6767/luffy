const { writeToLogFile } = require('../../utils/logs');
const DatabaseHandler = require('../../database/database');

async function removePseudo(whatsappBot, message) {
    try {
        const isMessageFromMe = message?.key?.fromMe;

        // Check if the message is from you and if it has extended text info
        if (!isMessageFromMe || !(message?.message?.extendedTextMessage)) {
            const unauthorizedMsg = "Sorry, I can't let you do that. 🚫 -Zoro";
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: unauthorizedMsg }, { quoted: message });
            console.error('Unauthorized access: You are not allowed to perform this operation or missing extended text info.');
            writeToLogFile('Unauthorized access: You are not allowed to perform this operation or missing extended text info.');
            return;
        }

        // Extract the user ID from the extended text info
        const userId = message.message.extendedTextMessage.contextInfo.participant;

        // Create an instance of DatabaseHandler
        const databaseHandler = new DatabaseHandler();

        // Connect to the database
        await databaseHandler.connect();

        // Get the allowed ID from the environment variable
        const allowedId = process.env.ALLOWED_ID;

        // Find the document with the allowed ID
        const allowedDocument = await databaseHandler.findAllowed(allowedId);

        if (!allowedDocument) {
            console.error('No document found with the allowedid:', allowedId);
            writeToLogFile(`No document found with the allowedid: ${allowedId}`);
            databaseHandler.closeConnection();
            return;
        }

        // Remove the user ID from the allowed users if it exists
        const index = allowedDocument.users.indexOf(userId);
        if (index !== -1) {
            allowedDocument.users.splice(index, 1);
            await databaseHandler.updateAllowedUsers(allowedId, allowedDocument.users);

            console.log('User removed successfully from allowed users.');
            writeToLogFile('User removed successfully from allowed users.');

            // Send success message if the message is from you
            const successMsg = 'User removed successfully from allowed users! 🎉 -Zoro';
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: successMsg }, { quoted: message });
        } else {
            console.error('User not found in allowed users:', userId);
            writeToLogFile(`User not found in allowed users: ${userId}`);
        }

        // Close the database connection
        databaseHandler.closeConnection();
    } catch (error) {
        // Log and handle errors
        console.error('Error in removePseudo function:', error);
        writeToLogFile(`Error in removePseudo function: ${error}`);

        // Send error message
        await whatsappBot.sendMessage(message?.key?.remoteJid, { text: 'An error occurred. Please try again later.' }, { quoted: message });
        throw error;
    }
}

module.exports = removePseudo;
