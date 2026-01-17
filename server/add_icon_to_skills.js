const db = require('./db');

const migrate = async () => {
    try {
        console.log('Adding icon_url column to skills table...');
        
        // Check if column exists first to avoid error? Or just try ADD COLUMN
        try {
            await db.query(`ALTER TABLE skills ADD COLUMN icon_url VARCHAR(255) DEFAULT NULL`);
            console.log('Column icon_url added successfully.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column icon_url already exists.');
            } else {
                throw err;
            }
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
