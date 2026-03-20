# 貪食蛇遊戲

一個單頁貪食蛇遊戲，使用 Node.js 內建 HTTP 伺服器提供服務。

## Prompt

```text
create a one-page snake game as a simple server running on localhost in the `01_demp_one-page_snake_game` directory.

created a README.md file to document the steps to
start the server as well.
```

## 啟動方式

```bash
cd 01_demp_one-page_snake_game
node server.js
```

伺服器啟動後，開啟瀏覽器前往 http://localhost:3000 即可遊玩。

## 操作說明

- **方向鍵** 或 **WASD** — 控制蛇的移動方向
- **R** — 重新開始遊戲

## 異動-一次出現2個食物

```text
now I want to have 2 food appear at the same time, and the snake can eat either one of them to grow. please modify the code accordingly.
```

## 異動-使用空白鍵暫停遊戲

```text
now I want to use the spacebar to pause and resume the game. please modify the code accordingly.
```

## 作業1 - 吃到一個超級食物會長出2個尾巴

```text
now I want to have a super food that appears randomly and if the snake eats it, it will grow 2 tails instead of 1. please modify the code accordingly.
```

## 作業2 - 有穿牆功能

```text
now I want to have the snake be able to go through walls and appear on the opposite side. please modify the code accordingly.
```
