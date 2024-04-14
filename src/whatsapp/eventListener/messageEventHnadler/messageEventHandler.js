const {handleCommand} = require('../../commandHandler/commandHandler')
/**
 * Handles the 'message' event for the WhatsApp client.
 * @param {object} msg - The message object received.
 * @param {object} whatsappBot - The WhatsApp bot object.
 */
function handleMessageEvent(msg, whatsappBot) {
    handleCommand(msg,whatsappBot)
}

module.exports = handleMessageEvent;
