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
    // Send initial message
    const response = await sock.sendMessage(message?.key?.remoteJid, { text: "Executing speed test" }, { quoted: message });

    const NetworkSpeed = require('network-speed');
    const testNetworkSpeed = new NetworkSpeed();
    const baseUrl = 'https://eu.httpbin.org/stream-bytes/500000';
    const fileSizeInBytes = 500000;

    let speed;

    // Function to send a loading animation
    const sendLoadingAnimation = async () => {
        const loadingEmojis = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']; // Loading emojis
        let index = 0;

        // Update the loading animation every 100 milliseconds
        const interval = setInterval(async () => {
            await sock.sendMessage(message?.key?.remoteJid, { text: loadingEmojis[index], edit: response.key });
            index = (index + 1) % loadingEmojis.length;
        }, 100);

        // Return the interval object
        return interval;
    };

    // Function to stop the loading animation
    const stopLoadingAnimation = async (loadingInterval) => {
        clearInterval(loadingInterval);
    };

    // Run loading animation and download speed calculation simultaneously
    const loadingInterval = await sendLoadingAnimation();
    try {
        speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
    } catch (error) {
        console.error("Error calculating speed:", error);
    } finally {
        await stopLoadingAnimation(loadingInterval);
    }

    // Send the calculated speed
    if (speed) {
        await sock.sendMessage(message?.key?.remoteJid, { text: `Download speed: ${speed.mbps} Mbps`, edit: response.key });
    } else {
        // Handle case where speed calculation failed
        await sock.sendMessage(message?.key?.remoteJid, { text: "Failed to calculate download speed", edit: response.key });
    }
}

module.exports = { execute };
