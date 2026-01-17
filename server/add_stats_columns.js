const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

async function addStatsColumns() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database.');

    const alterQuery = `
      ALTER TABLE personal_details
      ADD COLUMN IF NOT EXISTS years_experience VARCHAR(50) DEFAULT '02+',
      ADD COLUMN IF NOT EXISTS projects_completed VARCHAR(50) DEFAULT '20+',
      ADD COLUMN IF NOT EXISTS happy_clients VARCHAR(50) DEFAULT '05+',
      ADD COLUMN IF NOT EXISTS certifications VARCHAR(50) DEFAULT '10+';
    `;

    await connection.execute(alterQuery);
    console.log('Successfully added stats columns to personal_details table.');

  } catch (error) {
    console.error('Error updating table:', error);
  } finally {
    if (connection) await connection.end();
  }
}

addStatsColumns();
