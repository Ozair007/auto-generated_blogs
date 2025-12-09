import cron from 'node-cron';
import pool from '../db/connection';
import { generateArticle } from './aiClient';

/**
 * Generate and save a new article to the database
 */
async function generateAndSaveArticle(): Promise<void> {
  try {
    console.log('Starting article generation...');

    const { title, content } = await generateArticle();

    const result = await pool.query(
      'INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING id',
      [title, content]
    );

    console.log(`Article generated successfully!`);
  } catch (error) {
    console.error('Error generating article:', error);
  }
}

/**
 * Start the article generation scheduler
 * Runs daily at midnight UTC
 */
export function startArticleScheduler(): void {
  // Schedule to run daily at midnight UTC (00:00)
  // Format: second minute hour day month dayOfWeek
  cron.schedule('0 0 * * *', async () => {
    console.log('Scheduled article generation triggered');
    await generateAndSaveArticle();
  });

  console.log(
    'Article scheduler started. Will generate articles daily at midnight UTC.'
  );

  // Optionally generate an article immediately on startup for testing
  if (process.env.GENERATE_ON_STARTUP === 'true') {
    console.log('Generating initial article on startup...');
    generateAndSaveArticle();
  }
}

/**
 * Manually trigger article generation (for testing)
 */
export async function triggerArticleGeneration(): Promise<void> {
  await generateAndSaveArticle();
}
