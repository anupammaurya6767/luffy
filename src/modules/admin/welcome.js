// welcome.js
const { writeToLogFile } = require("../../utils/logs");
const DatabaseHandler = require("../../database/database");

async function welcome(whatsappBot, message) {
  try {
    // Create an instance of DatabaseHandler
    const databaseHandler = new DatabaseHandler();
    // Connect to the database
    await databaseHandler.connect();
      const msg = message?.message?.conversation;
      const emptyCmnd = msg.indexOf(" ");

      if (emptyCmnd == -1 || msg.length - 1 == emptyCmnd) {
        return await whatsappBot.sendMessage(
          message?.key?.remoteJid,
          { text: "Please give some message after the command." },
          { quoted: message }
        );
      }

    // Get the allowed ID from the environment variable
    const allowedId = process.env.ALLOWED_ID;

    // Find the document with the allowed ID
    const allowedDocument = await databaseHandler.findAllowed(allowedId);

    if (!allowedDocument) {
      console.error("No document found with the allowedid:", allowedId);
      writeToLogFile(`No document found with the allowedid: ${allowedId}`);
      databaseHandler.closeConnection();
      return;
    }

    // Extract the group ID
      const groupId = message?.key?.remoteJid;
      
    // Check if the group ID exists in the database or not
    const existingGroup = await databaseHandler.findGroup(groupId);
    if (!existingGroup) {
      return whatsappBot.sendMessage(jid, {
        text: "PLease add this group for welcoming new member.",
      });
    }
    
    // setting welcome message and saving to the database.
      await databaseHandler.updateWelcome(
        groupId,
        msg.substring(emptyCmnd + 1)
      );
      
    // Send success message if the message is from you
      const successMsg = "Welcome message set successfully! 🎉 -Zoro";
      
    await whatsappBot.sendMessage(
      message?.key?.remoteJid,
      { text: successMsg },
      { quoted: message }
    );

    // Close the database connection
    databaseHandler.closeConnection();
  } catch (error) {
    // Log and handle errors
    console.error("Error in welcome function:", error);
    writeToLogFile(`Error in welcome function: ${error}`);

    // Send error message
    await whatsappBot.sendMessage(
      message?.key?.remoteJid,
      { text: "An error occurred. Please try again later." },
      { quoted: message }
    );
    throw error;
  }
}

module.exports = welcome;
