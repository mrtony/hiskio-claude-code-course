const TOKEN_KEY = 'treasure_game_token';
const USER_KEY = 'treasure_game_user';

export interface User {
  id: number;
  email: string;
}

export interface GameScore {
  id: number;
  score: number;
  result: 'win' | 'tie' | 'loss';
  chests_opened: number;
  played_at: string;
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSavedUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || '請求失敗');
  }
  return data;
}

export async function signup(email: string, password: string): Promise<User> {
  const data = await request<{ token: string; user: User }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuth(data.token, data.user);
  return data.user;
}

export async function signin(email: string, password: string): Promise<User> {
  const data = await request<{ token: string; user: User }>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuth(data.token, data.user);
  return data.user;
}

export async function saveScore(score: number, result: string, chestsOpened: number): Promise<void> {
  await request('/api/scores', {
    method: 'POST',
    body: JSON.stringify({ score, result, chestsOpened }),
  });
}

export async function getScores(): Promise<GameScore[]> {
  const data = await request<{ scores: GameScore[] }>('/api/scores');
  return data.scores;
}
