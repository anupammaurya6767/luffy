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

// Format time in milliseconds to ETA (estimated time of arrival)
function formatETA(milliseconds) {
    // If less than 1 minute, return as seconds
    if (milliseconds < 60000) {
        return (milliseconds / 1000).toFixed(0) + ' seconds'
    }
    // If less than 1 hour, return as minutes
    else if (milliseconds < 3600000) {
        return (milliseconds / 60000).toFixed(0) + ' minutes'
    }
    // If less than 1 day, return as hours
    else if (milliseconds < 86400000) {
        return (milliseconds / 3600000).toFixed(0) + ' hours'
    }
    // If more than 1 day, return as days
    else {
        return (milliseconds / 86400000).toFixed(0) + ' days'
    }
}

module.exports = {formatETA}