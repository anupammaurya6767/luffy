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
const { sendMessageWithLoader } = require('../../utils/sendMessageWithLoader.js');
const { uploadDirectory} = require('./uploadDirectory.js');
const {uploadFile} = require('./uploadFile.js')
const { writeToLogFile } = require('../../utils/logs.js');

async function uploadToDrive(serviceAccountKeyPath, filePath, whatsappBot, response, message) {
    const loaderMessage = '📤 Stand by for the upload! 📤';
    const stopLoader = sendMessageWithLoader(whatsappBot, message?.key?.remoteJid, response.key, loaderMessage);
    try {
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) {
            return await uploadDirectory(serviceAccountKeyPath, filePath, whatsappBot, response, message, stopLoader);
        } else {
            return await uploadFile(serviceAccountKeyPath, filePath, whatsappBot, response, message, stopLoader);
        }
    } catch (error) {
        console.error('❌ Error uploading to Google Drive:', error);
        writeToLogFile(`❌ Error uploading to Google Drive: ${error}`);
    }
}

module.exports = { uploadToDrive };
