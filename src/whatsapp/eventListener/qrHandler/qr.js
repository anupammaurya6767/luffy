// src/whatsapp/readyEventHandler.js
/**
 * Handles the 'ready' event for the WhatsApp client.
 * @param {object} client - The WhatsApp client object.
 */
function qr(qr) {
    console.log("QR RECEIVED", qr);
    qrcode.generate(qr, { small: true });
}

module.exports = qr;
