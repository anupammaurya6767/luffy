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

// Function to generate a progress bar
function getProgressBar(percent) {
    // Length of the progress bar
    const length = 10;
  
    // Calculate number of progress characters
    const progress = Math.floor(percent / (100 / length));
  
    // Create progress bar with progress characters and remaining spaces
    const progressBar = '▰'.repeat(progress) + '▱'.repeat(length - progress);
  
    // Return the progress bar
    return progressBar;
  }
module.exports = {getProgressBar}