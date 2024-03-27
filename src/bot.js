const { writeToLogFile } = require('./utils/logs');
const WhatsAppHandler = require('./whatsapp/whatsapp');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

class Luffy {
    constructor() {
        this.whatsAppHandler = new WhatsAppHandler();
    }

    async run() {
        try {
            const app = express();
            const server = http.createServer(app);
            const io = new Server(server);

            // Pass the io instance to WhatsAppHandler
            this.whatsAppHandler = new WhatsAppHandler(io);

            // Connect WhatsAppHandler
            await this.whatsAppHandler.connect();

            server.listen(3001, () => {
                console.log("SERVER IS RUNNING");
            });
        } catch (error) {
            console.error('Error starting Luffy:', error);
            const logMessage = `Error starting Luffy: ${error.message}\n`;
            writeToLogFile(logMessage);
        }
    }

    stop() {
        this.whatsAppHandler.closeConnection();
    }
}

module.exports = Luffy;
