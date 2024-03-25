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
const { Readable } = require('stream');
const folderID = require('../constants/variables/variables')

async function uploadToDrive(serviceAccountKeyPath, filePath, sock, response, message) {
    try {
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) {
            return await uploadDirectory(serviceAccountKeyPath, filePath, sock, response, message);
        } else {
            return await uploadFile(serviceAccountKeyPath, filePath, sock, response, message);
        }
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
    }
}


async function uploadDirectory(serviceAccountKeyPath, directoryPath, sock, response, message) {
    try {
        const auth = await getAuth(serviceAccountKeyPath);
        const drive = google.drive({ version: 'v3', auth });

        const folderName = path.basename(directoryPath);

        // Create the folder in Google Drive
        const folderMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [folderID] // Specify the parent folder ID
        };
        const folderResponse = await drive.files.create({
            requestBody: folderMetadata,
            fields: 'id, webViewLink' // Change 'webContentLink' to 'webViewLink'
        });
        const folderId = folderResponse.data.id;

        const files = await fs.promises.readdir(directoryPath);
        const totalFiles = files.length;
        let uploadedFiles = 0;

        for (const file of files) {
            if (file.endsWith('.pad')) {
                console.log(`Skipping file ${file} with .pad extension.`);
                continue;
            }
            const filePath = path.join(directoryPath, file);
            await uploadFile(serviceAccountKeyPath, filePath, folderId, sock, response, message);
            uploadedFiles++;
            const progress = Math.floor((uploadedFiles / totalFiles) * 100);
            const progressMessage = `Uploading ${file} (${uploadedFiles}/${totalFiles}): ${progress}%`;
            await sock.sendMessage(message?.key?.remoteJid, { text: progressMessage, edit: response.key });
        }

        // Get the web view link of the folder
        const folderLink = folderResponse.data.webViewLink; // Change from 'webContentLink' to 'webViewLink'
        console.log(`Folder uploaded successfully. Folder link: ${folderLink}`);

        return folderLink;
    } catch (error) {
        console.error('Error uploading directory to Google Drive:', error);
    }
}

async function uploadFile(serviceAccountKeyPath, filePath, parentFolderId, sock, response, message) {
    try {
        const auth = await getAuth(serviceAccountKeyPath);
        const drive = google.drive({ version: 'v3', auth });

        const stats = await fs.promises.stat(filePath);
        if (!stats.isFile()) {
            throw new Error(`${filePath} is not a valid file.`);
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
                const progressMessage = `Uploading ${path.basename(filePath)}: ${progress}%`;
                await sock.sendMessage(message?.key?.remoteJid, { text: progressMessage, edit: response.key });
            }
        });

        const fileId = driveResponse.data.id;
        const fileLink = driveResponse.data.webContentLink;
        console.log(`File uploaded successfully. File ID: ${fileLink}`);
        return fileLink;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
    }
}

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
        console.error('Error reading service account key:', error);
    }
}



module.exports = { uploadToDrive };
