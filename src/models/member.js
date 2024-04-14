const mongoose = require('mongoose');

const messageCountSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  messageCount: {
    type: Number,
    default: 0
  }
});

const userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true
  },
  messageCounts: [messageCountSchema] // Array of message counts for each group
});

userSchema.methods.updateMessageCount = function(groupId, incrementBy = 1) {
  const messageCountIndex = this.messageCounts.findIndex(count => count.groupId.toString() === groupId.toString());
  if (messageCountIndex !== -1) {
    this.messageCounts[messageCountIndex].messageCount += incrementBy;
  } else {
    this.messageCounts.push({ groupId, messageCount: incrementBy });
  }
};

userSchema.methods.resetMessageCount = function() {
  this.messageCounts.forEach(count => {
    count.messageCount = 0;
  });
};

userSchema.methods.getTopUsersByMessageCount = function() {
  return this.messageCounts
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 10)
    .map(count => ({ groupId: count.groupId, messageCount: count.messageCount }));
};

const Member = mongoose.model('Member', userSchema);

module.exports = Member;
