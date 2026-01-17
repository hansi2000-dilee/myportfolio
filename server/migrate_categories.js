const db = require('./db');

const migrate = async () => {
    try {
        console.log('Migrating database for Categories...');

        // 1. Create categories table
        await db.query(`
            CREATE TABLE IF NOT EXISTS skill_categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE
            )
        `);
        console.log('Created skill_categories table.');

        // 2. Populate categories from existing skills
        const [existingSkills] = await db.query('SELECT DISTINCT category FROM skills');
        for (const skill of existingSkills) {
            if (skill.category) {
                // Insert ignore to skip duplicates
                await db.query('INSERT IGNORE INTO skill_categories (name) VALUES (?)', [skill.category]);
            }
        }
        console.log(`Populated categories from ${existingSkills.length} existing unique categories.`);

        console.log('Migration completed.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
