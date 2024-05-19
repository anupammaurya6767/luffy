const DatabaseHandler = require("../../../database/database.js");

const getGroupEvent = async (whatsappBot, events) => {

    try {
      let jid = events.id;
      const dbHandler = new DatabaseHandler();
      await dbHandler.connect();
        const groupDataDB = await dbHandler.findGroup(jid);
        if (!groupDataDB) {
            return whatsappBot.sendMessage(
              jid,{text:"PLease add this group for welcoming new member."})
        }

      if (events.action == "add") {
        //Welcome Message
        if (groupDataDB.welcomeMsg != "") {
          events.participants.forEach((member) => {
            whatsappBot.sendMessage(
              jid,
              {
                text:
                  "Welcome @" +
                  member.split("@")[0] +
                  "\n\n" +
                  groupDataDB.welcomeMsg,
                mentions: [member],
              }
            );
          });
        } else {
          whatsappBot.sendMessage(jid, {
            text:
              "PLease set your Welcome mesage using !welcome command"
          });
        }
      } else {
        // removing message logic
      }
        
        // Close the database connection
      dbHandler.closeConnection();
    } catch (error) {
      console.error("Error fetching and sending top users:", error);
      return [];
    }
};

module.exports = {getGroupEvent};
