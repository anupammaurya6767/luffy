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

const BufferJSON = {
    replacer: (k, value) => {
        if (
            Buffer.isBuffer(value) ||
            value instanceof Uint8Array ||
            value?.type === "Buffer"
        ) {
            return {
                type: "Buffer",
                data: Buffer.from(value?.data || value).toString("base64"),
            };
        }
        return value;
    },

    reviver: (_, value) => {
        if (
            typeof value === "object" &&
            !!value &&
            (value.buffer === true || value.type === "Buffer")
        ) {
            const val = value.data || value.value;
            return typeof val === "string"
                ? Buffer.from(val, "base64")
                : Buffer.from(val || []);
        }
        return value;
    },
};

module.exports = { BufferJSON };
