const db = require('./db');

async function migrate() {
    try {
        console.log('Adding demo_link column...');
        await db.query("ALTER TABLE projects ADD COLUMN demo_link VARCHAR(255) AFTER link");
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
