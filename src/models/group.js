const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: String,
    chatId: { type: String, unique: true },
    welcomeMsg: String,
    rules: String
  });


const Group = mongoose.model('group', groupSchema);
module.exports = Group;