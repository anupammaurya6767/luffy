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

const { BufferJSON } = require('./bufferJSON');

const writeData = async (collection, data, id) => {
    const informationToStore = JSON.parse(JSON.stringify(data, BufferJSON.replacer));
    const update = {
        $set: { ...informationToStore }
    };
    return collection.updateOne({ _id: id }, update, { upsert: true });
};

const readData = async (collection, id) => {
    try {
        const data = JSON.stringify(await collection.findOne({ _id: id }));
        return JSON.parse(data, BufferJSON.reviver);
    } catch (error) {
        return null;
    }
};

const removeData = async (collection, id) => {
    try {
        await collection.deleteOne({ _id: id });
    } catch (error) {
        console.error(error);
    }
};

module.exports = { writeData, readData, removeData };
