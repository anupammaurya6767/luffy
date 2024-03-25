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

const { uploadToDrive } = require('./torrentUpload'); // Import the upload module
const path = require('path');
const fsExtra = require('fs-extra');
const fs = require('fs');
const scriptDirectory = __dirname;
async function execute(message, sock) {
    const response = await sock.sendMessage(message?.key?.remoteJid, { text: "Torrent Added" }, { quoted: message });

    return new Promise(async (resolve, reject) => {
        try {
            // Dynamic import of WebTorrent
            const { default: WebTorrent } = await import('webtorrent');
            const client = new WebTorrent();

            // Extract magnet URI from the message
            const magnetURI = extractMagnetURI(message);

            if (!magnetURI) {
                const errorMessage = 'Invalid magnet URI';
                await sock.sendMessage(message?.key?.remoteJid, { text: errorMessage, edit: response.key });
                reject(new Error(errorMessage));
                return;
            }

            // Specify the download path
            const downloadPath = path.resolve(scriptDirectory, 'downloads') ;

            // Add the torrent with the specified download path
            client.add(magnetURI, { path: downloadPath }, async torrent => {
                console.log('Torrent downloading:', torrent.name);

                // Interval for animation
                const interval = setInterval(async () => {
                    const percent = Math.floor(torrent.progress * 100);
                    const progressBar = getProgressBar(percent);
                    const progressMessage = `Downloading ${torrent.name}:\n${progressBar} ${percent}%\nSpeed: ${formatBytes(torrent.downloadSpeed)}/s\nSize Left: ${formatBytes(torrent.length - torrent.downloaded)}\nETA: ${formatETA(torrent.timeRemaining)}`;
                    await sock.sendMessage(message?.key?.remoteJid, { text: progressMessage, edit: response.key });
                }, 1000);

                // Listen for completion
                torrent.on('done', async () => {
                    console.log('Torrent download finished:', torrent.name);
                    clearInterval(interval); // Clear the interval
                    const completionMessage = `Download of ${torrent.name} completed`;
                    await sock.sendMessage(message?.key?.remoteJid, { text: completionMessage, edit: response.key });
                    const serviceAccountKeyPath = path.resolve(scriptDirectory, 'serviceAccountKey.json');
                    const filePath = path.resolve(downloadPath, torrent.name)
                    // Upload the downloaded file to Google Drive
                    const filelink = await uploadToDrive(serviceAccountKeyPath, filePath, sock, response, message);
                    await sock.sendMessage(message?.key?.remoteJid, { text: `File: ${torrent.name}\nStatus: Uploaded\nLink: ${filelink}`, edit: response.key });
                    resolve(torrent.files.map(file => file.name)); // Resolve with the downloaded files
                });

                // Listen for errors
                torrent.on('error', async err => {
                    console.error('Torrent error:', err);
                    clearInterval(interval); // Clear the interval
                    const errorMessage = 'Torrent download failed';
                    await sock.sendMessage(message?.key?.remoteJid, { text: errorMessage, edit: response.key });
                    reject(err); // Reject with the error
                });
            });
        } catch (error) {
            reject(error);
        }finally{
            fs.rmSync(path.resolve(scriptDirectory, 'downloads'), { recursive: true, force: true });
        }
    });
}

// Function to get progress bar
function getProgressBar(percent) {
    const length = 10; // Length of the progress bar
    const progress = Math.floor(percent / (100 / length));
    const progressBar = '▰'.repeat(progress) + '▱'.repeat(length - progress);
    return progressBar;
}

// Function to format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Function to format estimated time remaining
function formatETA(milliseconds) {
    if (milliseconds < 60000) {
        // Less than 1 minute
        return (milliseconds / 1000).toFixed(0) + ' seconds';
    } else if (milliseconds < 3600000) {
        // Less than 1 hour
        return (milliseconds / 60000).toFixed(0) + ' minutes';
    } else if (milliseconds < 86400000) {
        // Less than 1 day
        return (milliseconds / 3600000).toFixed(0) + ' hours';
    } else {
        // More than 1 day
        return (milliseconds / 86400000).toFixed(0) + ' days';
    }
}

// Function to extract magnet URI from the message
function extractMagnetURI(message) {
    // Your logic to extract the magnet URI from the message goes here
    // For example, you might extract it from the message text
    const messageText = message?.message?.conversation;
    const magnetURIPattern = /magnet:\?xt=urn:[a-zA-Z0-9:]+/g;
    const magnetURI = messageText.match(magnetURIPattern)?.[0];
    return magnetURI;
}

module.exports = { execute };
