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
const { google } = require('googleapis');
const { getAuth } = require('./getAuth');
const { writeToLogFile } = require('../../utils/logs');

async function uploadFile(serviceAccountKeyPath, filePath, parentFolderId, whatsappBot, response, message, stopLoader, totalFiles, uploadedFiles) {
    try {
        const auth = await getAuth(serviceAccountKeyPath);
        const drive = google.drive({ version: 'v3', auth });
        stopLoader();
        const stats = await fs.promises.stat(filePath);
        if (!stats.isFile()) {
            throw new Error(`❌ ${filePath} is not a valid file.`);
        }
        
        const fileSize = stats.size;

        const media = {
            mimeType: 'application/octet-stream',
            body: fs.createReadStream(filePath),
        };

        const driveResponse = await drive.files.create({
            requestBody: {
                name: path.basename(filePath),
                parents: [parentFolderId], // Specify the parent folder ID
            },
            media: media,
            fields: 'id, webContentLink',
            onUploadProgress: async evt => {
                const progress = Math.round((evt.bytesRead / fileSize) * 100);
                const progressBar = getProgressBar(progress);
                const filesLeft = totalFiles - uploadedFiles - 1; // Subtract 1 because the current file is being uploaded
                const uploadSpeed = formatBytes(evt.bytesRead / (Date.now() - evt.startTime) * 1000) + '/s';
                const overallProgress = Math.round((totalBytesUploaded / totalBytesToUpload) * 100);
                const progressMessage = `📥 Uploaded: ${uploadedFiles + 1}, Files Left: ${filesLeft}, ETA: ${formatETA((totalBytesToUpload - totalBytesUploaded) / uploadSpeed)}, Speed: ${uploadSpeed}, Progress: ${progress}%\n${progressBar} ${progress}%`;
                await whatsappBot.sendMessage(message?.key?.remoteJid, { text: progressMessage, edit: response.key });
            }
        });

        const fileId = driveResponse.data.id;
        const fileLink = driveResponse.data.webContentLink;
        console.log(`✅ File uploaded successfully. File ID: ${fileLink}`);
        writeToLogFile(`✅ File uploaded successfully. File ID: ${fileLink}`);
        return fileLink;
    } catch (error) {
        console.error('❌ Error uploading file to Google Drive:', error);
        writeToLogFile(`❌ Error uploading file to Google Drive: ${error}`);
    }
}

module.exports = { uploadFile };
