require('dotenv').config(); // Load environment variables from .env file
const { MongoClient } = require('mongodb');
const { initAuthCreds } = require('./helper/authHelper');
const BufferJSON = require('./helper/jsonHelper');
const { writeToLogFile } = require('../utils/logs');

class DatabaseHandler {
    constructor() {
        this.mongoClient = new MongoClient(process.env.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    async connect() {
        try {
            await this.mongoClient.connect();
            this.collection = this.mongoClient.db(process.env.dbName).collection(process.env.authcollectionName);
            this.torrentCollection = this.mongoClient.db(process.env.dbName).collection('torrents');
            this.groupCollection = this.mongoClient.db(process.env.dbName).collection('groups');
            this.allowedCollection = this.mongoClient.db(process.env.dbName).collection('allowed');
            this.memberCollection = this.mongoClient.db(process.env.dbName).collection('members');
            const { state, saveCreds } = await this.useMongoDBAuthState();
            this.state = state;
            this.saveCreds = saveCreds;
            const allowedId = process.env.ALLOWED_ID;
            const existingAllowed = await this.allowedCollection.findOne({ allowedid: allowedId });
    
            if (!existingAllowed) {
                // If allowedid doesn't exist, add a new document
                await this.allowedCollection.insertOne({ allowedid: allowedId });
                console.log(`New allowed document added with allowedid: ${allowedId}`);
                writeToLogFile(`New allowed document added with allowedid: ${allowedId}`);
            }
            console.log('Database connected successfully');
            writeToLogFile('Database connected successfully');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            writeToLogFile(`Error connecting to MongoDB: ${error.message}`);
            throw error;
        }
    }

    async useMongoDBAuthState() {
        const writeData = async (id, data) => {
            const informationToStore = JSON.parse(JSON.stringify(data, BufferJSON.replacer));
            const update = { $set: { ...informationToStore } };
            await this.collection.updateOne({ _id: id }, update, { upsert: true });
        };

        const readData = async (id) => {
            try {
                const data = JSON.stringify(await this.collection.findOne({ _id: id }));
                return JSON.parse(data, BufferJSON.reviver);
            } catch (error) {
                return null;
            }
        };

        const removeData = async (id) => {
            try {
                await this.collection.deleteOne({ _id: id });
            } catch (error) {
                console.error('Error while removing data:', error);
                writeToLogFile(`Error while removing data: ${error.message}`);
            }
        };

        const creds = (await readData("creds")) || initAuthCreds();

        const state = {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`);
                            if (type === "app-state-sync-key") {
                                value = proto.Message.AppStateSyncKeyData.fromObject(data);
                            }
                            data[id] = value;
                        })
                    );
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category of Object.keys(data)) {
                        for (const id of Object.keys(data[category])) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            tasks.push(value ? writeData(key, value) : removeData(key));
                        }
                    }
                    await Promise.all(tasks);
                },
            },
        };

        const saveCreds = async () => {
            await writeData("creds", this.state.creds);
        };

        return { state, saveCreds };
    }

    getState() {
        return this.state;
    }

    async addGroup(groupId, name, welcomeMsg, rules) {
        try {
            await this.groupCollection.insertOne({
                chatId: groupId,
                name: name,
                welcomeMsg: welcomeMsg,
                rules: JSON.stringify(rules),
                lastRecordedMonth: null // Added last recorded month field
            });
            console.log('Group added successfully');
            writeToLogFile('Group added successfully');
        } catch (error) {
            console.error('Error adding group:', error);
            writeToLogFile(`Error adding group: ${error.message}`);
            throw error;
        }
    }

    async findGroup(groupId) {
        try {
            return await this.groupCollection.findOne({ chatId: groupId });
        } catch (error) {
            console.error('Error finding group:', error);
            writeToLogFile(`Error finding group: ${error.message}`);
            throw error;
        }
    }

    async getLastRecordedMonth(groupId) {
        try {
            const group = await this.groupCollection.findOne({ chatId: groupId });
            return group ? group.lastRecordedMonth : null;
        } catch (error) {
            console.error('Error getting last recorded month:', error);
            writeToLogFile(`Error getting last recorded month: ${error.message}`);
            throw error;
        }
    }

    async resetMessageCounts(groupId, currentMonth) {
        try {
            await this.memberCollection.updateMany(
                { group: groupId },
                { $set: { messageCount: 0 }, $currentDate: { lastModified: true } }
            );

            // Update last recorded month for the group
            await this.groupCollection.updateOne(
                { chatId: groupId },
                { $set: { lastRecordedMonth: currentMonth } }
            );

            console.log('Message counts reset for group:', groupId);
            writeToLogFile(`Message counts reset for group: ${groupId}`);
        } catch (error) {
            console.error('Error resetting message counts:', error);
            writeToLogFile(`Error resetting message counts: ${error.message}`);
            throw error;
        }
    }



    async addAllowed(allowedData) {
        try {
            await this.allowedCollection.insertOne({ allowedid: allowedData });
            console.log('Allowed added successfully');
            writeToLogFile('Allowed added successfully');
        } catch (error) {
            console.error('Error adding allowed:', error);
            writeToLogFile(`Error adding allowed: ${error.message}`);
            throw error;
        }
    }
    
    async findAllowed(allowedId) {
        try {
            return await this.allowedCollection.findOne({ allowedid: allowedId });
        } catch (error) {
            console.error('Error finding allowed:', error);
            writeToLogFile(`Error finding allowed: ${error.message}`);
            throw error;
        }
    }
    
    async addMember(userId, userName = "user") {
        try {
            await this.memberCollection.insertOne({ userid: userId, name: userName });
            console.log('Member added successfully');
            writeToLogFile('Member added successfully');
        } catch (error) {
            console.error('Error adding member:', error);
            writeToLogFile(`Error adding member: ${error.message}`);
            throw error;
        }
    }

    async updateUserName(userId, newName) {
        try {
            const filter = { userid: userId };
            const updateDoc = { $set: { name: newName } };
            await this.memberCollection.updateOne(filter, updateDoc);
            console.log('User name updated successfully');
            writeToLogFile('User name updated successfully');
        } catch (error) {
            console.error('Error updating user name:', error);
            writeToLogFile(`Error updating user name: ${error.message}`);
            throw error;
        }
    }
    
    async findMember(userId) {
        try {
            return await this.memberCollection.findOne({ userid: userId });
        } catch (error) {
            console.error('Error finding member:', error);
            writeToLogFile(`Error finding member: ${error.message}`);
            throw error;
        }
    }

    async updateAllowedGroups(allowedId, newGroups) {
        try {
            const filter = { allowedid: allowedId };
            const updateDoc = {
                $set: {
                    groups: newGroups
                }
            };
            await this.allowedCollection.updateOne(filter, updateDoc);
            console.log('Allowed groups updated successfully');
            writeToLogFile('Allowed groups updated successfully');
        } catch (error) {
            console.error('Error updating allowed groups:', error);
            writeToLogFile(`Error updating allowed groups: ${error.message}`);
            throw error;
        }
    }

    async updateAllowedUsers(allowedId, newUsers) {
        try {
            const filter = { allowedid: allowedId };
            const updateDoc = {
                $set: {
                    users: newUsers
                }
            };
            await this.allowedCollection.updateOne(filter, updateDoc);
            console.log('Allowed groups updated successfully');
            writeToLogFile('Allowed groups updated successfully');
        } catch (error) {
            console.error('Error updating allowed groups:', error);
            writeToLogFile(`Error updating allowed groups: ${error.message}`);
            throw error;
        }
    }

    async addTorrent(link, success) {
        try {
            await this.torrentCollection.insertOne({
                link: link,
                success: success
            });
            console.log('Torrent added successfully');
            writeToLogFile('Torrent added successfully');
        } catch (error) {
            console.error('Error adding torrent:', error);
            writeToLogFile(`Error adding torrent: ${error.message}`);
            throw error;
        }
    }

    async findTorrent(link) {
        try {
            return await this.torrentCollection.findOne({ link: link });
        } catch (error) {
            console.error('Error finding torrent:', error);
            writeToLogFile(`Error finding torrent: ${error.message}`);
            throw error;
        }
    }

    async updateTorrentSuccess(link, success) {
        try {
            const filter = { link: link };
            const updateDoc = {
                $set: {
                    success: success
                }
            };
            await this.torrentCollection.updateOne(filter, updateDoc);
            console.log('Torrent success updated successfully');
            writeToLogFile('Torrent success updated successfully');
        } catch (error) {
            console.error('Error updating torrent success:', error);
            writeToLogFile(`Error updating torrent success: ${error.message}`);
            throw error;
        }
    }
    
    // Method to update message count for a user in a group
    async updateMessageCount(userId, groupId) {
        try {
            const filter = { userid: userId };
            const updateDoc = {
                $inc: { [`messageCounts.${groupId}`]: 1 }
            };
            await this.memberCollection.updateOne(filter, updateDoc, { upsert: true });
            console.log('Message count updated successfully');
            writeToLogFile('Message count updated successfully');
        } catch (error) {
            console.error('Error updating message count:', error);
            writeToLogFile(`Error updating message count: ${error.message}`);
            throw error;
        }
    }
    
    // Method to get top 10 users by message count in a group
    async getTopUsers(groupId) {
        try {
            const topUsers = await this.memberCollection
                .find({}, { projection: { _id: 0, userid: 1, name: 1, [`messageCounts.${groupId}`]: 1 } })
                .sort({ [`messageCounts.${groupId}`]: -1 })
                .limit(10)
                .toArray();
            console.log('Top users fetched successfully');
            writeToLogFile('Top users fetched successfully');
            return topUsers;
        } catch (error) {
            console.error('Error fetching top users:', error);
            writeToLogFile(`Error fetching top users: ${error.message}`);
            throw error;
        }
    }
    

    closeConnection() {
        this.mongoClient.close();
        console.log('Database connection closed');
        writeToLogFile('Database connection closed');
    }
}

module.exports = DatabaseHandler;
