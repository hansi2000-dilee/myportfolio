const db = require('./db');

async function migrate() {
    try {
        console.log('Adding display_order column to certificates table...');
        await db.query("ALTER TABLE certificates ADD COLUMN display_order INT DEFAULT 0");
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
