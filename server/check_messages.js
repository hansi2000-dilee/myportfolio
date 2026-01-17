const db = require('./db');

async function checkMessages() {
    try {
        const [rows] = await db.query("SELECT * FROM messages");
        console.log('Messages in DB:', rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkMessages();
