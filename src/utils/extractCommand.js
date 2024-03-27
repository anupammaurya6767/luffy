/**
 * Extracts the command from the message using a regular expression.
 * @param {string} message - The message body.
 * @returns {string} - The extracted command.
 */
function extractCommand(message) {
    const regex = /^!(\w+)(?:\s|$)/; // Regular expression to match a word after '!' and before a space
    const match = message.match(regex);
    console.log(match)
    return match ? match[1].toLowerCase() : ''; // Extracted command, converted to lowercase
}


module.exports = {extractCommand}