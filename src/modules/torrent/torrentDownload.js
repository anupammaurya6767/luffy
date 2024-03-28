const path = require('path');
const fs = require('fs');
const { getProgressBar } = require('../../utils/getProgressbar.js');
const { formatBytes } = require('../../utils/formatBytes.js');
const { formatETA } = require('../../utils/formatETA.js');
const { extractMagnetURI } = require('../../utils/extractMagnetUrl.js');
const { writeToLogFile } = require('../../utils/logs.js');
const { uploadToDrive } = require('./torrentUpload.js');
const DatabaseHandler = require('../../database/database');
let WebTorrent; // Cached WebTorrent module


async function getWebTorrent() {
    if (!WebTorrent) {
        // Dynamic import of WebTorrent
        WebTorrent = (await import('webtorrent')).default;
    }
    return WebTorrent;
}

async function getTorrentSize(magnetURI) {
    return new Promise(async (resolve, reject) => {
        const WebTorrent = await getWebTorrent();
        const client = new WebTorrent();

        client.add(magnetURI, { 
            // Add options if needed
        }, (torrent) => {
            // Once the torrent is added, get its size
            const size = torrent.length;
            
            // Destroy the client and remove the torrent
            client.destroy(() => {
                resolve(size);
            });
        });

        // Handle errors
        client.on('error', (err) => {
            reject(err);
        });
    });
}

async function torrentHandler(whatsappBot, message) {
    try {
        const isMessageFromMe = message?.key?.fromMe;

        // Create an instance of DatabaseHandler
        const databaseHandler = new DatabaseHandler();

        // Connect to the database
        await databaseHandler.connect();

        // Get the allowed ID from the environment variable
        const allowedId = process.env.ALLOWED_ID;

        // Find the document with the allowed ID
        const allowedDocument = await databaseHandler.findAllowed(allowedId);

        if (!allowedDocument) {
            console.error('No document found with the allowedid:', allowedId);
            writeToLogFile(`No document found with the allowedid: ${allowedId}`);
            databaseHandler.closeConnection();
            return;
        }

        // Get the group ID and user ID from the message
        const groupId = message?.key?.remoteJid;
        const userId = message?.key?.fromMe ? message?.key?.fromMe : message?.key?.participant;

        // Check if the group is allowed
        const groupAllowed = allowedDocument.groups.includes(groupId);



        if (isMessageFromMe || groupAllowed) {
            // Get the WebTorrent module
            const WebTorrent = await getWebTorrent();
            const client = new WebTorrent();
            const magnetURI = extractMagnetURI(message);
            if (!magnetURI) {
                const errorMessage = 'Invalid magnet URI';
                await whatsappBot.sendMessage(message?.key?.remoteJid, { text: errorMessage, edit: response.key });
                writeToLogFile(errorMessage);
                throw new Error(errorMessage);
            }

            const torrentInDatabase = await databaseHandler.findTorrent(magnetURI);
            if (torrentInDatabase && torrentInDatabase.success) {
                const alreadyLeechedMsg = `The torrent has already been leeched and mirrored! 🔄`;
                await whatsappBot.sendMessage(message?.key?.remoteJid, { text: alreadyLeechedMsg }, { quoted: message });
                return;
            }

            const downloadPath = path.join(__dirname, '..', '..', '..', 'downloads');
            const leechLimit = parseInt(process.env.LEECH_LIMIT); 
            const torrentSize = await getTorrentSize(magnetURI); 
            console.log(leechLimit,torrentSize)
            if (torrentSize > leechLimit) {
                const errorMessage = 'Torrent size exceeds leech limit. Please try another.';
                await whatsappBot.sendMessage(message?.key?.remoteJid, { text: errorMessage }, { quoted: message });
                writeToLogFile(errorMessage);
                return;
            }

            const response = await whatsappBot.sendMessage(message?.key?.remoteJid, { text: "Aye aye! Chopper here! I've added the torrent to my inventory! 🐾" }, { quoted: message });
            writeToLogFile('Torrent Added');
            try {
                const torrent = client.add(magnetURI, { path: downloadPath });

                torrent.on('error', async err => {
                    console.error('Torrent error:', err);
                    const errorMessage = 'Yikes! Something went wrong with the download! 🐾';
                    await whatsappBot.sendMessage(message?.key?.remoteJid, { text: errorMessage, edit: response.key });
                    writeToLogFile('Torrent download failed');
                    throw new Error(errorMessage);
                });

                torrent.on('done', async () => {
                    clearInterval(interval);
                    const completionMessage = `Yahoo! I've successfully downloaded ${torrent.name}! 🎉`;
                    await whatsappBot.sendMessage(message?.key?.remoteJid, { text: completionMessage, edit: response.key });
                    writeToLogFile(`Download of ${torrent.name} completed`);

                    writeToLogFile('Uploading starting soon');

                    const filelink = await uploadToDrive(path.join(__dirname, '..', '..', '..', 'serviceAccountKey.json'), path.resolve(downloadPath, torrent.name), whatsappBot, response, message);
                    await whatsappBot.sendMessage(message?.key?.remoteJid, { text: `Aye aye, captain! The file ${torrent.name} is uploaded! Here's the link: ${filelink} ⚓`, edit: response.key });
                    if(filelink){
                        await databaseHandler.addTorrent(magnetURI, true);
                        console.log('Torrent added to the database successfully');
                        writeToLogFile('Torrent added to the database successfully');
                        writeToLogFile(`File ${torrent.name} uploaded. Link: ${filelink}`);
                    }else{
                        writeToLogFile('Torrent not uploaded successfully');
                    }
                    
                    // Close the database connection
                    databaseHandler.closeConnection();
                    writeToLogFile('Database Connection Closed!')
                });

                const interval = setInterval(async () => {
                    const percent = Math.floor(torrent.progress * 100);
                    const progressBar = getProgressBar(percent);
                    const progressMessage = `Ahoy!\n ☠️ Downloading ${torrent.name}: \n${progressBar} ${percent}% \n💨 Speed: ${formatBytes(torrent.downloadSpeed)}/s \n📦 Size Left: ${formatBytes(torrent.length - torrent.downloaded)} \n⏳ ETA: ${formatETA(torrent.timeRemaining)} ⏳`;
                    await whatsappBot.sendMessage(message?.key?.remoteJid, { text: progressMessage, edit: response.key });
                    writeToLogFile('Downloading progress');
                }, 2000);

                await new Promise(resolve => torrent.on('infoHash', resolve));
            } catch (error) {
                console.error('Error adding torrent:', error);
                const errorMessage = 'Failed to add torrent';
                await whatsappBot.sendMessage(message?.key?.remoteJid, { text: errorMessage, edit: response.key });
                writeToLogFile(errorMessage);
                throw new Error(errorMessage);
            }
        } else {
            // If the group or user is not allowed, send a message indicating so
            const notAllowedMessage = "Sorry, I'm afraid you don't have the authority to use this command! 🚫 - Chopper";
            await whatsappBot.sendMessage(message?.key?.remoteJid, { text: notAllowedMessage }, { quoted: message });
        }
    } catch (error) {
        console.error('Error:', error);
        writeToLogFile(`Error: ${error.message}`);
    } finally {
        fs.rmSync(path.join(__dirname, '..', '..', '..', 'downloads'), { recursive: true, force: true });
    }
}

module.exports = { torrentHandler };
