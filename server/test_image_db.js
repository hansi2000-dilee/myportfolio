const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to DB');

        // Check if table exists
        const [tables] = await connection.query("SHOW TABLES LIKE 'project_images'");
        if (tables.length === 0) {
            console.error("ERROR: project_images table DOES NOT EXIST!");
            process.exit(1);
        } else {
            console.log("project_images table exists.");
        }

        // Check columns
        const [columns] = await connection.query("DESCRIBE project_images");
        console.log("Columns:", columns.map(c => c.Field));

        // Insert dummy
        console.log("Inserting dummy...");
        const [res] = await connection.query("INSERT INTO projects (title) VALUES ('Test')");
        const pid = res.insertId;
        await connection.query("INSERT INTO project_images (project_id, image_url) VALUES (?, '/test.jpg')", [pid]);
        
        // Fetch
        const [rows] = await connection.query("SELECT * FROM project_images WHERE project_id = ?", [pid]);
        console.log("Fetched:", rows);

        // Clean up
        await connection.query("DELETE FROM projects WHERE id = ?", [pid]);
        // Cascade should handle images, or manual delete if tested logic
        const [check] = await connection.query("SELECT * FROM project_images WHERE project_id = ?", [pid]);
        
        if (check.length === 0) console.log("Cleaned up successfully (Cascade worked or manual)");
        else {
             console.log("Images remaining (No cascade?):", check);
             await connection.query("DELETE FROM project_images WHERE project_id = ?", [pid]);
        }

        connection.end();

    } catch (err) {
        console.error("DB Error:", err);
    }
}

testDB();
