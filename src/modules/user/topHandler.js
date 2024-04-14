const DatabaseHandler = require('../../database/database');
const {getMonth} = require('../../utils/getMonth')
async function topHandler(whatsappBot, receivedMessage) {
    try {
        const isMessageFromMe = receivedMessage?.key?.fromMe;
        const dbHandler = new DatabaseHandler();
        await dbHandler.connect();

        // Get the allowed ID from the environment variable
        const allowedId = process.env.ALLOWED_ID;

        // Find the document with the allowed ID
        const allowedDocument = await dbHandler.findAllowed(allowedId);

        if (!allowedDocument) {
            console.error('No document found with the allowedid:', allowedId);
            writeToLogFile(`No document found with the allowedid: ${allowedId}`);
            dbHandler.closeConnection();
            return;
        }

        // Get the group ID and user ID from the receivedMessage
        const groupId = receivedMessage?.key?.remoteJid;
        const userId = receivedMessage?.key?.fromMe ? receivedMessage?.key?.fromMe : receivedMessage?.key?.participant;

        // Check if the group is allowed
        const groupAllowed = allowedDocument.groups.includes(groupId);

        // Check if the user is allowed
        const userAllowed = allowedDocument.users.includes(userId);

        // Close the database connection
        dbHandler.closeConnection();

        const currentMonth = getMonth(new Date()); // Assuming getMonth returns the month number (1 for January, 2 for February, etc.)

        // Check if the current month is different from the last recorded month in the database
        const lastRecordedMonth = await dbHandler.getLastRecordedMonth(groupId);

        if (lastRecordedMonth !== currentMonth) {
            // Reset message counts for all users in the group
            await dbHandler.resetMessageCounts(groupId, currentMonth);
        }

        // Construct the message
        let messageContent = "🎉 Top Users in the Group 🎉\n\n";

        if (topUsers.length > 0) {
            topUsers.forEach((user, index) => {
                if (user && user.userid && user.messageCounts && user.messageCounts[groupId]) {
                    const userName = user.name;
                    const messageCount = user.messageCounts[groupId];
                    messageContent += `${index + 1}. *${userName}* - ${messageCount} messages\n`;
                }
            });

            // Add some humor and references to Luffy from One Piece
            messageContent += "\nKeep going, crew! 🏴‍☠️\n";
            messageContent += "Remember, it's not about the number of messages, but the adventures we share! 🌊⛵️\n";
            messageContent += "And always remember: 'kaizoku ni orewa naru' 🏴‍☠️🍖🍺";
        } else {
            messageContent = "No top users found for the group.";
        }

        // Send the message
        if (isMessageFromMe || groupAllowed || userAllowed) {
            await whatsappBot.sendMessage(groupId, {
                text: messageContent
            });
        }

        return topUsers;
    } catch (error) {
        console.error('Error fetching and sending top users:', error);
        return [];
    }
}



module.exports = { topHandler };
