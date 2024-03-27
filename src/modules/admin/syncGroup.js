// syncGroup.js

const { writeToLogFile } = require('../../utils/logs');
const DatabaseHandler = require('../../database/database');

async function syncGroup(whatsappBot, message) {
    try {
        const isMessageFromMe = message?.key?.fromMe;
        const groupId = message?.key?.remoteJid;

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

        if(isMessageFromMe)
        {
            userAllowed = !userAllowed;
        }

        if (!isMessageFromMe || !userAllowed) {
            const unauthorizedMsg = "Sorry, I can't let you do that. 🚫 -Zoro";
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: unauthorizedMsg }, { quoted: message });
            console.error('Unauthorized access: You are not allowed to perform this operation or missing extended text info.');
            writeToLogFile('Unauthorized access: You are not allowed to perform this operation or missing extended text info.');
            return;
        }

        // Get participants from the group
        const groupMetadata = groupId.endsWith("@g.us") ? await whatsappBot.groupMetadata(groupId) : null;
        const participants = groupMetadata.participants || [];

        // Iterate through participants
        for (const participant of participants) {
            const existingMember = await databaseHandler.findMember(participant.id);
            if (!existingMember) {
                // If not exists, add the member
                await databaseHandler.addMember(participant.id);
            }
        }

        // Close the database connection
        databaseHandler.closeConnection();

        const syncMsg = `Ahoy, Nakama! 🏴‍☠️
We've synced the crew with the Straw Hat Pirates! ⚓️
All members are now aboard the Thousand Sunny! 🌊
        `;
        
        // Send the sync message
        await whatsappBot.sendMessage(groupId, { text: syncMsg },{ quoted: message });

        console.log('Sync completed successfully.');
        writeToLogFile('Sync completed successfully.');
    } catch (error) {
        // Log and handle errors
        console.error('Error in syncGroup function:', error);
        writeToLogFile(`Error in syncGroup function: ${error}`);
        throw error;
    }
}

module.exports = syncGroup;
