const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

async function createProjectImagesTable() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS project_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);
    console.log('Created project_images table.');

    // Migrate existing images?
    // If 'image_url' in projects table has data, move it to project_images
    const [projects] = await connection.execute('SELECT id, image_url FROM projects WHERE image_url IS NOT NULL AND image_url != ""');
    for (const p of projects) {
        await connection.execute('INSERT INTO project_images (project_id, image_url) VALUES (?, ?)', [p.id, p.image_url]);
    }
    console.log('Migrated existing images.');
    
    // Optionally remove image_url column from projects, but we can keep it as a thumbnail or just ignore it.
    // Keeping it might be safer for now, but we'll prioritize project_images.

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

createProjectImagesTable();
