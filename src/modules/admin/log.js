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


const fs = require('fs');
const path = require('path');
const mime = require('mime-types')
async function logHandler(whatsappBot, message) {
    try {
        const isMessageFromMe = message?.key?.fromMe;
        // Check if the message is from you
        if (!isMessageFromMe) {
            const unauthorizedMsg = "Sorry, I can't let you do that. 🚫 -Zoro";
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: unauthorizedMsg }, { quoted: message });
            console.error('Unauthorized access: You are not allowed to perform this operation.');
            writeToLogFile('Unauthorized access: You are not allowed to perform this operation.');
            return;
        }
        const logFilePath = path.join(__dirname,'..', '..', '..', './Logs/luffy_log.txt'); // Path to the log file

        // Check if the log file exists
        if (!fs.existsSync(logFilePath)) {
            throw new Error('Log file not found at: ' + logFilePath);
        }

        const mimeType = mime.lookup(logFilePath);
        const fileName = 'log.txt';
        
        // Construct messageOptions object
        const messageOptions = {
            document: { url: logFilePath },
            mimetype: mimeType,
            fileName: fileName,

        };

        // Send message with document
        await whatsappBot.sendMessage(message?.key?.remoteJid, messageOptions,{ quoted: message });

        console.log('Log file sent successfully');
    } catch (error) {
        console.error('Error sending log file:', error);
        await whatsappBot.sendMessage(message?.key?.remoteJid, { text: 'Error sending log file: ' + error.message }, { quoted: message });
    }
}

module.exports = { logHandler };
