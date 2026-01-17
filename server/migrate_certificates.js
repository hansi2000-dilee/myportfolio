const db = require('./db');

async function migrate() {
    try {
        console.log('Creating certificates table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS certificates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                issuer VARCHAR(255),
                date VARCHAR(100),
                description TEXT,
                image_url VARCHAR(500),
                link VARCHAR(500)
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
