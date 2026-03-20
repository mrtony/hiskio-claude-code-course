const http = require('http');

const PORT = 3000;

const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>貪食蛇遊戲</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #1a1a2e;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    color: #eee;
  }
  h1 { margin-bottom: 10px; font-size: 1.5rem; }
  #score { margin-bottom: 10px; font-size: 1.1rem; }
  canvas {
    border: 2px solid #e94560;
    border-radius: 4px;
    background: #16213e;
  }
  #message {
    margin-top: 15px;
    font-size: 1rem;
    min-height: 1.5em;
    color: #e94560;
  }
  .controls {
    margin-top: 15px;
    font-size: 0.85rem;
    color: #888;
  }
</style>
</head>
<body>
<h1>貪食蛇遊戲</h1>
<div id="score">分數: 0</div>
<canvas id="game" width="400" height="400"></canvas>
<div id="message">按任意方向鍵開始遊戲</div>
<div class="controls">方向鍵 / WASD 控制方向，空白鍵暫停/繼續，R 重新開始</div>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

const GRID = 20;
const COLS = canvas.width / GRID;
const ROWS = canvas.height / GRID;

let snake, dir, nextDir, foods, score, running, paused, gameOver, interval;

function init() {
  snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
  dir = { x: 0, y: 0 };
  nextDir = { x: 0, y: 0 };
  score = 0;
  running = false;
  paused = false;
  gameOver = false;
  scoreEl.textContent = '分數: 0';
  msgEl.textContent = '按任意方向鍵開始遊戲';
  foods = [];
  placeFood();
  placeFood();
  draw();
  if (interval) clearInterval(interval);
}

function placeFood() {
  while (true) {
    const f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some(s => s.x === f.x && s.y === f.y) &&
        !foods.some(e => e.x === f.x && e.y === f.y)) {
      foods.push(f);
      break;
    }
  }
}

function draw() {
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines
  ctx.strokeStyle = '#1a1a3e';
  for (let i = 0; i <= COLS; i++) {
    ctx.beginPath(); ctx.moveTo(i * GRID, 0); ctx.lineTo(i * GRID, canvas.height); ctx.stroke();
  }
  for (let i = 0; i <= ROWS; i++) {
    ctx.beginPath(); ctx.moveTo(0, i * GRID); ctx.lineTo(canvas.width, i * GRID); ctx.stroke();
  }

  // Draw foods
  ctx.fillStyle = '#e94560';
  foods.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x * GRID + GRID / 2, f.y * GRID + GRID / 2, GRID / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw snake
  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? '#0f3460' : '#533483';
    ctx.fillRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2);
    ctx.fillStyle = i === 0 ? '#e94560' : '#a855f7';
    ctx.fillRect(seg.x * GRID + 3, seg.y * GRID + 3, GRID - 6, GRID - 6);
  });
}

function update() {
  dir = { ...nextDir };
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
      snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver = true;
    running = false;
    clearInterval(interval);
    msgEl.textContent = '遊戲結束！按 R 重新開始';
    return;
  }

  snake.unshift(head);

  const eatenIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);
  if (eatenIndex !== -1) {
    score++;
    scoreEl.textContent = '分數: ' + score;
    foods.splice(eatenIndex, 1);
    placeFood();
    // Grow by 2: one from not popping, one by duplicating the tail
    snake.push({ ...snake[snake.length - 1] });
  } else {
    snake.pop();
  }

  draw();
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  if (key === 'r') { init(); return; }

  if (e.code === 'Space') {
    e.preventDefault();
    if (!running || gameOver) return;
    if (paused) {
      paused = false;
      msgEl.textContent = '';
      interval = setInterval(update, 120);
    } else {
      paused = true;
      clearInterval(interval);
      msgEl.textContent = '暫停中 — 按空白鍵繼續';
    }
    return;
  }

  const dirs = {
    arrowup:    { x: 0, y: -1 }, w: { x: 0, y: -1 },
    arrowdown:  { x: 0, y: 1 },  s: { x: 0, y: 1 },
    arrowleft:  { x: -1, y: 0 }, a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },  d: { x: 1, y: 0 },
  };

  const newDir = dirs[key];
  if (!newDir) return;

  e.preventDefault();

  // Prevent reversing
  if (dir.x + newDir.x === 0 && dir.y + newDir.y === 0 && snake.length > 1) return;

  nextDir = newDir;

  if (!running && !gameOver) {
    running = true;
    msgEl.textContent = '';
    interval = setInterval(update, 120);
  }
});

init();
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`貪食蛇遊戲伺服器已啟動: http://localhost:${PORT}`);
});
