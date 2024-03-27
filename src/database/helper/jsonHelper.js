// jsonHelper.js
const BufferJSON = {
    /**
     * Replacer function for JSON.stringify to handle Buffer objects.
     * @param {string} k - Current key being processed.
     * @param {*} value - Current value being processed.
     * @returns {*} - Processed value.
     */
    replacer: (k, value) => {
        if (Buffer.isBuffer(value) || value instanceof Uint8Array || value?.type === 'Buffer') {
            return {
                type: 'Buffer',
                data: Buffer.from(value?.data || value).toString('base64'),
            };
        }
        return value;
    },

    /**
     * Reviver function for JSON.parse to handle Buffer objects.
     * @param {string} _ - Current key being processed.
     * @param {*} value - Current value being processed.
     * @returns {*} - Processed value.
     */
    reviver: (_, value) => {
        if (typeof value === 'object' && !!value && (value.buffer === true || value.type === 'Buffer')) {
            const val = value.data || value.value;
            return typeof val === 'string' ? Buffer.from(val, 'base64') : Buffer.from(val || []);
        }
        return value;
    },
};

module.exports = BufferJSON;
