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

const { MongoClient, makeWASocket } = require('../dependencies');
const { useMongoDBAuthState } = require('../database/authState');
const { connectToMongoDB } = require('../utils/mongoConnection');
const { setupWebSocket } = require('../websocket/websocketManager');
const { mongoURL, dbName, collectionName } = require('../../constants/variables/variables');

async function connectionLogic() {
    const mongoClient = new MongoClient(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await mongoClient.connect();

    const collection = await connectToMongoDB(mongoURL, dbName, collectionName);
    const { state, saveCreds } = await useMongoDBAuthState(collection);
    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state,
    });

    await setupWebSocket(sock, { state, saveCreds }, connectionLogic);

    // Export mongoClient as a property of the module
    module.exports.mongoClient = mongoClient;
}

module.exports.connectionLogic = connectionLogic;
