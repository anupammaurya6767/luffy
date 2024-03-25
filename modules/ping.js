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

async function execute(message, sock) {
    const emojis = ['🏀', '⚾', '🎾', '🏈', '🏓', '🏸', '🏐', '🥏', '🏑', '🏒']; // Ball emojis
    const delay = 30; // Delay between each change in milliseconds

    // Function to send a message with the specified emoji
    const sendMessageWithEmoji = async (emoji) => {
        return await sock.sendMessage(message?.key?.remoteJid, { text: emoji }, { quoted: message });
    };

    // Send the initial message with the first emoji
    let response = await sendMessageWithEmoji(emojis[0]);

    // Loop to change emoji and send messages
    for (let i = 1; i < emojis.length; i++) {
        await new Promise(resolve => setTimeout(resolve, delay));
        response = await sock.sendMessage(message?.key?.remoteJid, {
            text: emojis[i],
            edit: response.key // Edit the previous message
        });
    }

    // Send "Pong!" after the animation completes
    await sock.sendMessage(message?.key?.remoteJid, { text: 'Pong!' ,edit:response.key});
}

module.exports = { execute };
