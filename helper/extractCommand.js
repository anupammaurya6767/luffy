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
function extractCommand(message) {
    // Extract command from the message, considering command starts with "!" and ends with the first space
    const messageContent = message?.message?.conversation || '';
    const commandPattern = /^(\![^\s]+)/g; // Regex pattern for commands starting with "!" and until the first space
    const match = messageContent.match(commandPattern);
    return match ? match[0] : null; // Return the matched command or null if not found
}


module.exports = {extractCommand};