const db = require('./db');

async function migrate() {
    try {
        console.log('Creating achievements tables...');
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS achievements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                date VARCHAR(100),
                display_order INT DEFAULT 0
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS achievement_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                achievement_id INT,
                image_url VARCHAR(255),
                FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
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
