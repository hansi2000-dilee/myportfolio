const db = require('./db');

async function migrate() {
    try {
        console.log('Creating messages table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                title VARCHAR(100),
                email VARCHAR(100),
                phone VARCHAR(20),
                address VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Migration successful');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
