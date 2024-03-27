const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true
  }
});

const Member = mongoose.model('Member', userSchema);

module.exports = Member;