const db = require('./db');

async function debugImages() {
    try {
        console.log("--- Projects ---");
        const [projects] = await db.query('SELECT * FROM projects');
        console.table(projects);

        console.log("\n--- Project Images ---");
        const [images] = await db.query('SELECT * FROM project_images');
        console.table(images);
        
        console.log("\n--- Joined View ---");
        const [joined] = await db.query(`
            SELECT p.id as project_id, p.title, pi.id as image_id, pi.image_url 
            FROM projects p 
            LEFT JOIN project_images pi ON p.id = pi.project_id
        `);
        console.table(joined);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugImages();
