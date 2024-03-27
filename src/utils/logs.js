const fs = require('fs');
const path = require('path');

function writeToLogFile(logMessage) {
    const logFilePath = path.join(__dirname, '..', '..', 'Logs', 'luffy_log.txt');
    const formattedLogMessage = `[${new Date().toLocaleString()}] ${logMessage}\n`;

    fs.access(logFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Log file doesn't exist, create new file and write log
            fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
            fs.writeFileSync(logFilePath, formattedLogMessage);
        } else {
            // Log file exists, append log message
            fs.appendFileSync(logFilePath, formattedLogMessage);
        }
    });
}

module.exports = { writeToLogFile };
