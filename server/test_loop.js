const db = require('./db');

async function testLoop() {
    try {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY id DESC');
        const projects = rows.map(r => ({...r}));
        console.log('Projects:', projects.length);
        
        for (let p of projects) {
            console.log('Checking project:', p.id);
            const [imgs] = await db.query('SELECT id, image_url FROM project_images WHERE project_id = ?', [p.id]);
            console.log('Images found:', imgs.length);
            console.log('Image content:', imgs);
        }
        process.exit();
    } catch(e) { console.error(e); }
}
testLoop();
