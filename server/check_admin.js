const db = require('./db');

async function checkAdmin() {
    try {
        const [rows] = await db.query('SELECT * FROM admin');
        console.log('Admins found:', rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAdmin();
