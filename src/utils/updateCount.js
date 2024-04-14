const DatabaseHandler = require('../database/database');

async function updateMessageCount(userId, groupId, userName) {
    try {
        const dbHandler = new DatabaseHandler();
        await dbHandler.connect();
        await dbHandler.updateMessageCount(userId, groupId);
        await dbHandler.updateUserName(userId,userName);
        dbHandler.closeConnection();
    } catch (error) {
        console.error('Error updating message count:', error);
    }
}

module.exports = {updateMessageCount};
