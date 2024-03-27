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


// convert bytes to human-readable file size
function formatBytes(bytes, decimals = 2) {
    // check if bytes is equal to 0
    if (bytes === 0) return '0 Bytes';
    
    // define constants for binary prefix
    const k = 1024;
    const dm = (decimals < 0) ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    // calculate the index of the appropriate size label
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // return the formatted file size
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = {formatBytes}