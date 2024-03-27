const mongoose = require('mongoose');

const torrentSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        unique: true
    },
    success: {
        type: Boolean,
        default: false
    }
});

const Torrent = mongoose.model('Torrent', torrentSchema);

module.exports = Torrent;
