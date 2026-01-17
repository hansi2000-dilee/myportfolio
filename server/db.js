const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

db.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.log('Database does not exist. Please run the schema.sql script to create it.');
    } else {
      console.error('Database connection failed:', err);
    }
  } else {
    console.log('Connected to MySQL Database');
    connection.release();
  }
});

module.exports = db.promise();
