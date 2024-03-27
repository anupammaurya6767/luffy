const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedSchema = new Schema({
    allowedid: {type: String, unique:true},
    groups: [String],
    users: [String]
  });


const Allowed = mongoose.model('allowed', allowedSchema);
module.exports = Allowed;