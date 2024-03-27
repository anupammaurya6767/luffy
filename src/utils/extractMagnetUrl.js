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

// Function to extract Magnet URI from a message
function extractMagnetURI(message) {
    // Get message text
    const messageText = message?.message?.conversation;
    
    // Define Magnet URI pattern
    const magnetURIPattern = /magnet:\?xt=urn:[a-zA-Z0-9:]+/g;
    
    // Extract Magnet URI from message text
    const magnetURI = messageText.match(magnetURIPattern)?.[0];
    
    // Return extracted Magnet URI
    return magnetURI;
  }


  module.exports = {extractMagnetURI}