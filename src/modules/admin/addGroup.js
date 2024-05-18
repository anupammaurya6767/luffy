// addGroup.js

const { writeToLogFile } = require('../../utils/logs');
const DatabaseHandler = require('../../database/database');

async function addGroup(whatsappBot, message) {
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
        const userAllowed = allowedDocument?.users?.includes(userId);



        // Check if the message is from you
        if (!isMessageFromMe || !(message?.message?.senderKeyDistributionMessage?.groupId || !userAllowed)) {
            const unauthorizedMsg = "Sorry, I can't let you do that. 🚫 -Zoro";
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: unauthorizedMsg }, { quoted: message });
            console.error('Unauthorized access: You are not allowed to perform this operation.');
            writeToLogFile('Unauthorized access: You are not allowed to perform this operation.');
            return;
        }

        // Extract the group ID
        const groupId = message?.key?.remoteJid;
        const groupMetadata = await whatsappBot.groupMetadata(groupId) || [];
        const participants = groupMetadata.participants

        // Check if the group ID already exists in the database
        const existingGroup = await databaseHandler.findGroup(groupId);
        if (!existingGroup) {
        // Get participants from the group
            const name =  groupMetadata.subject;
            const welcomeMsg = "Welcome aboard the Thousand Sunny! 🌊 Set sail for adventure and camaraderie! 🏴‍☠️";
            const rules = `1. Respect your fellow crew members! ⚔️\n2. Obey the captain's orders at all times! 🦜\n3. No loot hoarding! Share the treasure with your nakama! 💰`;
            
        await databaseHandler.addGroup(groupId, name, welcomeMsg, rules);
        }

        // Add the group ID to the allowed groups
        if(allowedDocument?.groups?.includes(groupId))
        {
            writeToLogFile('Group already exists in the allowed groups.');
            return;
        }
        allowedDocument?.groups?.push(groupId);
        await databaseHandler.updateAllowedGroups(allowedId,allowedDocument.groups); // Update allowed groups

        console.log('Group added successfully to allowed groups.');
        writeToLogFile('Group added successfully to allowed groups.');

        


        // Add each participant to the user schema
        for (const participant of participants) {
            const existingMember = await databaseHandler.findMember(participant.id);
            if (!existingMember) {
                // If not exists, add the member
                await databaseHandler.addMember(participant.id);
            }
        }

        // Send success message if the message is from you
        const successMsg = 'Group added successfully to allowed groups! 🎉 -Zoro';
        await whatsappBot.sendMessage(message?.key?.remoteJid, { text: successMsg }, { quoted: message });


        // Close the database connection
        databaseHandler.closeConnection();
    } catch (error) {
        // Log and handle errors
        console.error('Error in addGroup function:', error);
        writeToLogFile(`Error in addGroup function: ${error}`);

        // Send error message
        await whatsappBot.sendMessage(message?.key?.remoteJid, { text: 'An error occurred. Please try again later.' }, { quoted: message });
        throw error;
    }
}

module.exports = addGroup;
