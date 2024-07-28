// authHelper.js
const { Curve, signedKeyPair } = require('@whiskeysockets/baileys/lib/Utils/crypto');
const { generateRegistrationId } = require('@whiskeysockets/baileys/lib/Utils/generics');
const { randomBytes } = require('crypto');

/**
 * Initialize authentication credentials.
 * @param {Object} options - Optional parameters to customize the credentials.
 * @returns {Object} - Initialized authentication credentials.
 */
const initAuthCreds = (options = {}) => {
    try {
        const identityKey = Curve.generateKeyPair();
        return {
            noiseKey: Curve.generateKeyPair(),
            signedIdentityKey: identityKey,
            signedPreKey: signedKeyPair(identityKey, 1),
            registrationId: options.registrationId || generateRegistrationId(),
            advSecretKey: options.advSecretKey || randomBytes(32).toString('base64'),
            processedHistoryMessages: [],
            nextPreKeyId: options.nextPreKeyId || 1,
            firstUnuploadedPreKeyId: options.firstUnuploadedPreKeyId || 1,
            accountSettings: {
                unarchiveChats: options.unarchiveChats || false,
            },
        };
    } catch (error) {
        console.error('Error initializing authentication credentials:', error);
        throw error;
    }
};

module.exports = { initAuthCreds };
