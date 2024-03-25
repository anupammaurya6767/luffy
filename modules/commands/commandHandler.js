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
const speedtestHandler = require('../speedtest');
const pingHandler = require('../ping');
const torrentHandler = require('../torrentDownload'); // Import the torrent handler module
const commands = require('./commands');

const commandToHandler = {
    [commands.SPEEDTEST]: speedtestHandler,
    [commands.PING]: pingHandler,
    [commands.TORRENT]: torrentHandler, // Add the torrent handler to the command to handler mapping
    // Add more commands and their respective handler modules here
};

function handleCommand(command, message, sock) {
    if (command && commandToHandler.hasOwnProperty(command)) {
        const handler = commandToHandler[command];
        handler.execute(message, sock);
    } else {
        console.log("No handler found for command:", command);
    }
}

module.exports = { handleCommand };
