const Luffy = require('./src/bot'); // Assuming the Luffy class is exported from luffy.js

async function startBot() {
    const luffy = new Luffy();
    try {
        await luffy.run();
        console.log('Luffy is up and running!');
    } catch (error) {
        console.error('Error starting Luffy:', error);
    }
}

startBot();
