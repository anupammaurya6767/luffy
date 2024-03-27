// authHelper.js
const { Curve, signedKeyPair } = require('@whiskeysockets/baileys/lib/Utils/crypto');
const { generateRegistrationId } = require('@whiskeysockets/baileys/lib/Utils/generics');
const { randomBytes } = require('crypto');

/**
 * Initialize authentication credentials.
 * @returns {Object} - Initialized authentication credentials.
 */
const initAuthCreds = () => {
    const identityKey = Curve.generateKeyPair();
    return {
        noiseKey: Curve.generateKeyPair(),
        signedIdentityKey: identityKey,
        signedPreKey: signedKeyPair(identityKey, 1),
        registrationId: generateRegistrationId(),
        advSecretKey: randomBytes(32).toString('base64'),
        processedHistoryMessages: [],
        nextPreKeyId: 1,
        firstUnuploadedPreKeyId: 1,
        accountSettings: {
            unarchiveChats: false,
        },
    };
};

module.exports = { initAuthCreds };
