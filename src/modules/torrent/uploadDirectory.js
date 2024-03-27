require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { getAuth } = require('./getAuth');
const { uploadFile } = require('./uploadFile');
const { writeToLogFile } = require('../../utils/logs');

async function uploadDirectory(serviceAccountKeyPath, directoryPath, whatsappBot, response, message, stopLoader) {
    try {
        const auth = await getAuth(serviceAccountKeyPath);
        const drive = google.drive({ version: 'v3', auth });

        const folderName = path.basename(directoryPath);

        // Get folderId from .env file
        const folderID = process.env.GOOGLE_DRIVE_FOLDER_ID;

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
        let totalBytesUploaded = 0;
        let totalBytesToUpload = 0;

        // Calculate total bytes to upload
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const stats = await fs.promises.stat(filePath);
            if (stats.isFile() && !file.endsWith('.pad')) {
                totalBytesToUpload += stats.size;
            }
        }

        // Send initial message with loader

        for (const file of files) {
            if (file.endsWith('.pad')) {
                console.log(`⚠️ Skipping file ${file} with .pad extension.`);
                continue;
            }
            const filePath = path.join(directoryPath, file);
            await uploadFile(serviceAccountKeyPath, filePath, folderId, whatsappBot, response, message, stopLoader, totalFiles, uploadedFiles); // Pass totalFiles and uploadedFiles here
            uploadedFiles++;
        }

        // Get the web view link of the folder
        const folderLink = folderResponse.data.webViewLink; // Change from 'webContentLink' to 'webViewLink'
        console.log(`✅ Folder uploaded successfully. Folder link: ${folderLink}`);
        writeToLogFile(`✅ Folder uploaded successfully. Folder link: ${folderLink}`);

        // Stop the loader animation
        stopLoader();

        return folderLink;
    } catch (error) {
        console.error('❌ Error uploading directory to Google Drive:', error);
        writeToLogFile(`❌ Error uploading directory to Google Drive: ${error}`);
    }
}

module.exports = { uploadDirectory };
