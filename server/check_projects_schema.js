const db = require('./db');

async function checkProjectSchema() {
    try {
        console.log('Checking projects table...');
        const [columns] = await db.query("SHOW COLUMNS FROM projects");
        console.log('Columns:', columns.map(c => c.Field));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkProjectSchema();
