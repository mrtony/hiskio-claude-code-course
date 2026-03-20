import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../db';
import { signToken } from '../middleware/auth';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: '請提供 email 和密碼' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: '密碼至少需要 6 個字元' });
    return;
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      res.status(409).json({ error: '此 email 已被註冊' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, passwordHash);

    const token = signToken(result.lastInsertRowid as number);
    res.json({ token, user: { id: result.lastInsertRowid, email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: '註冊失敗，請稍後再試' });
  }
});

router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: '請提供 email 和密碼' });
    return;
  }

  try {
    const user = db.prepare('SELECT id, email, password_hash FROM users WHERE email = ?').get(email) as
      | { id: number; email: string; password_hash: string }
      | undefined;

    if (!user) {
      res.status(401).json({ error: 'Email 或密碼錯誤' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Email 或密碼錯誤' });
      return;
    }

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ error: '登入失敗，請稍後再試' });
  }
});

export default router;
