const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

async function addOrderColumn() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    // Add display_order column
    const alterQuery = `
      ALTER TABLE experience
      ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
    `;
    await connection.execute(alterQuery);
    console.log('Successfully added display_order column.');

    // Initialize display_order to match current ID (reversed or normal)
    // currently we list by ID DESC (newest first). 
    // To maintain this, we can set display_order = -id (so bigger id = smaller number? no).
    // Let's just set display_order = id for now, and we will sort by display_order DESC to exact match current behavior
    // Then user can change values.
    
    await connection.execute('UPDATE experience SET display_order = id');
    console.log('Initialized display_order values.');

  } catch (error) {
    console.error('Error updating table:', error);
  } finally {
    if (connection) await connection.end();
  }
}

addOrderColumn();
