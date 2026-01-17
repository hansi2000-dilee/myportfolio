const db = require('./db');

async function migrate() {
    try {
        console.log('Adding is_read column to messages table...');
        await db.query("ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE");
        console.log('Migration successful');
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists');
            process.exit(0);
        }
        console.error(err);
        process.exit(1);
    }
}

migrate();
