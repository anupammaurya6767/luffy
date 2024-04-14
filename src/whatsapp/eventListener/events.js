// src/whatsapp/EventListener.js
const qrHandler = require('./qrHandler/qr');
const readyEventHandler = require('./readyEventHandler/readyEventHandler');
const messageEventHandler = require('./messageEventHnadler/messageEventHandler');

/**
 * Represents an event listener for the WhatsApp client.
 * @class
 */
class EventListener {
    /**
     * Creates an instance of EventListener.
     * @constructor
     * @param {WhatsappClient} client - The WhatsApp client.
     */
    constructor(client) {
        this.client = client;
        this.whatsappBot = {};
    }

    /**
     * Sets up event listeners for the WhatsApp client.
     * @method
     */
    setupEventListeners() {
        // Listen for the 'qr' event
        this.client.on('qr', (qr) => {
            qrHandler(qr);
        });

        // Listen for the 'ready' event
        this.client.on('ready', () => {
            readyEventHandler(this.client);
            this.whatsappBot = { client: this.client };
        });

        // Listen for the 'message' event
        this.client.on('message_create', (msg) => {
            messageEventHandler(msg, this.whatsappBot);
        });

        // Add more event listeners as needed...
    }
}

module.exports = EventListener;
