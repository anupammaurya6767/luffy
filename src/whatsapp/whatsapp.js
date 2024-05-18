const { makeWASocket, DisconnectReason } = require('@whiskeysockets/baileys');
const { writeToLogFile } = require('../utils/logs');
const DatabaseHandler = require('../database/database');
const { handleCommand } = require('./commandHandler/commandHandler');
const {getGroupEvent} = require("./eventListener/groupHandler/getGroupEvent");

class WhatsAppHandler {
    constructor(io) {
        this.databaseHandler = new DatabaseHandler();
        this.io = io;
    }

    async connect() {
        try {
            await this.databaseHandler.connect();
            const whatsappBot = makeWASocket({
                printQRInTerminal: true,
                auth: this.databaseHandler.getState(),
            });

            whatsappBot.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update || {};

                if (qr) {
                    console.log(qr);
                    // Emit the QR code to the client
                    this.io.emit('qr', { qr });
                }

                if (connection === 'close') {
                    const shouldReconnect =
                        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

                    if (shouldReconnect) {
                        this.connect();
                    }
                }
            });

            whatsappBot.ev.on('messages.update', messageInfo => {
                console.log(messageInfo);
            });

            whatsappBot.ev.on('messages.upsert', messageInfoUpsert => {
                handleCommand(whatsappBot, messageInfoUpsert);
                // Emit message info to the client
                this.io.emit('message', { messageInfoUpsert });
            });

            whatsappBot.ev.on('creds.update', async () => {
                await this.databaseHandler.saveCreds();
            });

            whatsappBot.ev.on('group-participants.update', async (event) => {
              await getGroupEvent(whatsappBot,event);
            });
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            const logMessage = `Error connecting to MongoDB: ${error.message}\n`;
            writeToLogFile(logMessage);
        }
    }

    closeConnection() {
        this.databaseHandler.closeConnection();
    }
}

module.exports = WhatsAppHandler;
