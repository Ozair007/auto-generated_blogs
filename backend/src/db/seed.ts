import pool from './connection';
import { generateArticle } from '../services/aiClient';
import runMigrations from './migrations';

async function seedDatabase() {
  try {
    console.log('Running database migrations...');
    await runMigrations();

    // Check if articles already exist
    const existingArticles = await pool.query('SELECT COUNT(*) FROM articles');
    const count = parseInt(existingArticles.rows[0].count);

    if (count >= 3) {
      console.log(`Database already has ${count} articles. Skipping seed.`);
      return;
    }

    const articlesToGenerate = Math.max(3 - count, 0);
    console.log(`Generating ${articlesToGenerate} articles...`);

    for (let i = 0; i < articlesToGenerate; i++) {
      console.log(`Generating article ${i + 1}/${articlesToGenerate}...`);
      const { title, content } = await generateArticle();

      await pool.query(
        'INSERT INTO articles (title, content) VALUES ($1, $2)',
        [title, content]
      );

      console.log(`✓ Article "${title}" created`);

      // Add a small delay to avoid rate limiting
      if (i < articlesToGenerate - 1) {
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (process.argv[1]?.includes('seed')) {
  seedDatabase()
    .then(() => {
      console.log('Seed script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
