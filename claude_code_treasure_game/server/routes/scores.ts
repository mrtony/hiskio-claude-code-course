import { Router, Response } from 'express';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const { score, result, chestsOpened } = req.body;

  if (score === undefined || !result || chestsOpened === undefined) {
    res.status(400).json({ error: '缺少必要欄位' });
    return;
  }

  if (!['win', 'tie', 'loss'].includes(result)) {
    res.status(400).json({ error: 'result 必須是 win、tie 或 loss' });
    return;
  }

  try {
    db.prepare(
      'INSERT INTO game_scores (user_id, score, result, chests_opened) VALUES (?, ?, ?, ?)'
    ).run(req.userId, score, result, chestsOpened);

    res.json({ success: true });
  } catch (err) {
    console.error('Save score error:', err);
    res.status(500).json({ error: '儲存分數失敗' });
  }
});

router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const scores = db.prepare(
      'SELECT id, score, result, chests_opened, played_at FROM game_scores WHERE user_id = ? ORDER BY played_at DESC LIMIT 20'
    ).all(req.userId);

    res.json({ scores });
  } catch (err) {
    console.error('Get scores error:', err);
    res.status(500).json({ error: '取得分數失敗' });
  }
});

export default router;
