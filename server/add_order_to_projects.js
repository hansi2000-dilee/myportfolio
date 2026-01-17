const db = require('./db');

async function migrateProjects() {
    try {
        console.log('Adding display_order to projects...');
        
        // Add column
        try {
            await db.query("ALTER TABLE projects ADD COLUMN display_order INT DEFAULT 0");
            console.log('Column added.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('Column already exists.');
            else throw e;
        }

        // Initialize display_order
        // We'll set display_order = id initially to keep current order
        const [projects] = await db.query("SELECT id FROM projects ORDER BY id ASC");
        for (let i = 0; i < projects.length; i++) {
            // We want newest first usually, but specific order requested. 
            // If user wants to reorder, we usually start with some order.
            // Let's just assign order = id for now. Higher ID = Higher Order usually implies Newest First if we sort DESC.
            // So let's update display_order = id.
            await db.query("UPDATE projects SET display_order = ? WHERE id = ?", [projects[i].id, projects[i].id]);
        }
        console.log('Updated existing projects with default display_order.');
        
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrateProjects();
