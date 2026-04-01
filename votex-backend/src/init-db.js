require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDB() {
  // Use a default connection string if none provided (useful for local dev)
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';
  
  console.log(`[DB INIT] Connecting to: ${connectionString.replace(/:[^:@]+@/, ':***@')}`);
  
  const pool = new Pool({ connectionString });

  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('[DB INIT] Executing schema.sql...');
    await pool.query(schemaSql);
    console.log('[DB INIT] ✅ Schema created successfully.');
    
  } catch (err) {
    console.error('[DB INIT] ❌ Error executing schema:', err.message);
  } finally {
    await pool.end();
  }
}

initDB();
