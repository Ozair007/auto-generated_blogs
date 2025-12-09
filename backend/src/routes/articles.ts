import { Router, Request, Response } from 'express';
import pool from '../db/connection';
import { Article } from '../models/article';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Article>(
      'SELECT id, title, content, created_at, updated_at FROM articles ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query<Article>(
      'SELECT id, title, content, created_at, updated_at FROM articles WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

export default router;
