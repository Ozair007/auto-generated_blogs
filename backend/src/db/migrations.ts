import pool from './connection';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    // Try multiple possible paths for schema.sql
    const possiblePaths = [
      path.join(__dirname, 'schema.sql'),
      path.join(process.cwd(), 'src', 'db', 'schema.sql'),
      path.join(process.cwd(), 'backend', 'src', 'db', 'schema.sql'),
    ];

    let schemaPath: string | null = null;
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        schemaPath = possiblePath;
        break;
      }
    }

    if (!schemaPath) {
      console.log('Schema file not found, creating schema inline...');
      const schema = `
        CREATE TABLE IF NOT EXISTS articles (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
      `;
      await pool.query(schema);
    } else {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schema);
    }

    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

export default runMigrations;
