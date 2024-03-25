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

const { proto } = require("@whiskeysockets/baileys/WAProto");
const { Curve, signedKeyPair } = require("@whiskeysockets/baileys/lib/Utils/crypto");
const { generateRegistrationId } = require("@whiskeysockets/baileys/lib/Utils/generics");
const { randomBytes } = require("crypto");

module.exports = {
    proto,
    Curve,
    signedKeyPair,
    generateRegistrationId,
    randomBytes
};
