const {extractCommand} = require('../../utils/extractCommand')
const {pingCommandHandler} = require('../../modules/ping/ping');
const { speedTestHandler } = require('../../modules/speedTest/speedTest');
const { torrentHandler } = require('../../modules/torrent/torrentDownload');
const addGroup = require('../../modules/admin/addGroup');
const addPseudo = require('../../modules/admin/addPseudo');
const removeGroup = require('../../modules/admin/remGroup');
const removePseudo = require('../../modules/admin/remPseudo');
const syncGroup = require('../../modules/admin/syncGroup');
const { logHandler } = require('../../modules/admin/log');
const { updateMessageCount } = require('../../utils/updateCount');
const {topHandler} = require('../../modules/user/topHandler')

/**
 * Handles incoming messages and routes them to the appropriate command module.
 * @param {object} message - The message object received.
 * @param {object} whatsappBot - The WhatsApp bot object.
 */
async function handleCommand(whatsappBot,incomingMessage) {
    incomingMessage.messages.forEach(async message => {
    const msgBody = message?.message?.conversation || message?.message?.extendedTextMessage?.text ||''
    const groupId = message?.key?.remoteJid;
    const userId = message?.key?.fromMe ? message?.key?.fromMe : message?.key?.participant;
    const userName = message?.pushName;
    await updateMessageCount(userId,groupId,userName);
    const command = extractCommand(msgBody);

    // Route messages to different command modules based on extracted command
    switch (command) {
        case 'ping':
            await pingCommandHandler(whatsappBot,message);
            break;

        case 'speedtest':
            await speedTestHandler(whatsappBot,message);
            break;

        case 'torrent':
            await torrentHandler(whatsappBot,message);
            break;

        case 'addgroup':
            await addGroup(whatsappBot,message);
            break;

        case 'addpseudo':
        await addPseudo(whatsappBot,message);
        break;

        case 'remgroup':
        await removeGroup(whatsappBot,message);
        break;

        case 'rempseudo':
        await removePseudo(whatsappBot,message);
        break;

        case 'sync':
        await syncGroup(whatsappBot,message);
        break;

        case 'logs':
        await logHandler(whatsappBot,message);
        break;

        case 'top':
        await topHandler(whatsappBot,message);
        break;
        default:
            console.log("no command")
    }
    });
    
}





module.exports = {handleCommand}