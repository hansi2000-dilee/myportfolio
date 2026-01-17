const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

async function addHeroDescriptionColumn() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    const alterQuery = `
      ALTER TABLE personal_details
      ADD COLUMN IF NOT EXISTS hero_description TEXT;
    `;

    await connection.execute(alterQuery);
    console.log('Successfully added hero_description column to personal_details table.');

  } catch (error) {
    console.error('Error updating table:', error);
  } finally {
    if (connection) await connection.end();
  }
}

addHeroDescriptionColumn();
