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
const { google } = require('googleapis');
const { writeToLogFile } = require('../../utils/logs');

async function getAuth(serviceAccountKeyPath) {
    try {
        const content = await fs.promises.readFile(serviceAccountKeyPath);
        const credentials = JSON.parse(content);
        const auth = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ['https://www.googleapis.com/auth/drive']
        );
        return auth;
    } catch (error) {
        console.error('❌ Error reading service account key:', error);
        writeToLogFile(`❌ Error reading service account key: ${error}`);
    }
}

module.exports = { getAuth };
