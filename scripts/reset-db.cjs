// Reset database - drops all tables
require('dotenv').config();
const mysql = require('mysql2/promise');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

async function resetDatabase() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 1,
  });

  try {
    console.log('Connecting to database...');
    const connection = await pool.getConnection();

    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Get all tables
    const [tables] = await connection.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
    `);

    console.log(`Found ${tables.length} tables to drop`);

    // Drop each table
    for (const row of tables) {
      const tableName = row.TABLE_NAME || row.table_name;
      console.log(`Dropping table: ${tableName}`);
      await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    }

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('All tables dropped successfully!');
    connection.release();
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

async function countTables() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 1,
  });

  try {
    const connection = await pool.getConnection();
    const [tables] = await connection.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
    `);
    console.log(`Found ${tables.length} tables in database`);
    connection.release();
  } finally {
    await pool.end();
  }
}

// Run count if called with --count
if (process.argv.includes('--count')) {
  countTables();
} else {
  resetDatabase();
}
