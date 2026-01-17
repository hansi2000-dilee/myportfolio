const db = require('./db');

async function fix() {
    try {
        console.log('Ensuring display_order column exists in achievements...');
        await db.query("ALTER TABLE achievements ADD COLUMN display_order INT DEFAULT 0");
        console.log('Column added.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists (ER_DUP_FIELDNAME).');
        } else {
             console.log('Error adding column (might exist):', err.message);
        }
    }
    process.exit(0);
}

fix();
