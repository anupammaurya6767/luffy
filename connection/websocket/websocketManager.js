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

const { DisconnectReason } = require('../dependencies');
const { handleMessageUpdate } = require('../../handlers/updateMessage/messageUpdateHandler');
const { handleMessageUpsert } = require('../../handlers/upsertMessage/messageUpsertHandler');

async function setupWebSocket(sock, state, connectionLogic) {
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update || {};

        if (qr) {
            console.log(qr);
        }

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            if (shouldReconnect) {
                connectionLogic();
            }
        }
    });

    sock.ev.on("messages.update", messageInfo=>  handleMessageUpdate(messageInfo, sock));

    sock.ev.on("messages.upsert", messageInfoUpsert => handleMessageUpsert(messageInfoUpsert, sock));

    sock.ev.on("creds.update", state.saveCreds);
}

module.exports = { setupWebSocket };