const { writeToLogFile } = require('../../utils/logs');
const DatabaseHandler = require('../../database/database');

async function removeGroup(whatsappBot, message) {
    try {
        const isMessageFromMe = message?.key?.fromMe;

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

        const userId = message?.key?.fromMe ? message?.key?.fromMe : message?.key?.participant;

        // Check if the user is allowed
        let userAllowed = allowedDocument.users.includes(userId);

        if (isMessageFromMe) {
            userAllowed = !userAllowed;
        }

        // Check if the message is from you
        if (!isMessageFromMe || !(message?.message?.senderKeyDistributionMessage?.groupId) || !userAllowed) {
            console.log(isMessageFromMe, (message?.message?.senderKeyDistributionMessage?.groupId), userAllowed)
            const unauthorizedMsg = "Sorry, I can't let you do that. 🚫 -Zoro";
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: unauthorizedMsg }, { quoted: message });
            console.error('Unauthorized access: You are not allowed to perform this operation.');
            writeToLogFile('Unauthorized access: You are not allowed to perform this operation.');
            return;
        }

        // Extract the group ID from the message
        const groupId = message.message.senderKeyDistributionMessage.groupId;

        // Remove the group ID from the allowed groups if it exists
        const index = allowedDocument.groups.indexOf(groupId);
        if (index !== -1) {
            allowedDocument.groups.splice(index, 1);
            await databaseHandler.updateAllowedGroups(allowedId, allowedDocument.groups);

            console.log('Group removed successfully from allowed groups.');
            writeToLogFile('Group removed successfully from allowed groups.');

            // Send success message if the message is from you
            const successMsg = 'Group removed successfully from allowed groups! 🎉 -Zoro';
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: successMsg }, { quoted: message });
        } else {
            console.error('Group not found in allowed groups:', groupId);
            writeToLogFile(`Group not found in allowed groups: ${groupId}`);
        }

        // Close the database connection
        databaseHandler.closeConnection();
    } catch (error) {
        // Log and handle errors
        console.error('Error in removeGroup function:', error);
        writeToLogFile(`Error in removeGroup function: ${error}`);

        // Send error message
        await whatsappBot.sendMessage(message?.key?.remoteJid, { text: 'An error occurred. Please try again later.' }, { quoted: message });
        throw error;
    }
}

module.exports = removeGroup;
