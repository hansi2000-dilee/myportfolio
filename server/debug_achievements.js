const db = require('./db');

async function check() {
    try {
        console.log('Checking achievements table...');
        const [columns] = await db.query("SHOW COLUMNS FROM achievements");
        console.log('Columns:', columns.map(c => c.Field));
        
        console.log('Checking achievement_images table...');
        const [imgColumns] = await db.query("SHOW COLUMNS FROM achievement_images");
        console.log('Columns:', imgColumns.map(c => c.Field));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

check();
