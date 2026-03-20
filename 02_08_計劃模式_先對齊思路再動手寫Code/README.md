# 02-08 計劃模式_先對齊思路再動手寫Code

Claude Code提供三種模式:
- normal
- plan
- accept edits on

在plan模式下，Claude Code會先產生一個計劃，列出要完成的任務和步驟，讓使用者先對齊思路，再動手寫Code。

## 練習-新增使用者註冊、登入功能並記錄分數並支援Guest遊玩模式

在這個練習中，我們將使用Claude Code的plan模式來新增使用者註冊、登入功能，並記錄分數，同時支援Guest遊玩模式。

這裡我們會練習的內容如下:
- 資料庫的選擇


**資料庫的選擇**

1. 切換到 `plan mode`

2. 列出資料庫選項或觸發對話選項
```text
List what databse options I have to implement sign up and sign in in flow?

# 會觸發對話選項
What databse options I have to implement sign up and sign in in flow?
```
3. 進一步討論並生成計劃:
```text
use SQLite to build a simple sign up and sign in flow and store the game score for each signed in user. In addition, allow to play the game as guest mode without storing any data.
```
上面的prompt生成效果不好, 使用以下prompt來修改:

```text
use SQLite to build a simple sign up and sign in flow and store the game score for each signed in user. place sign up and sign in button in the right-top. Show up sign in sign up modal after the button is clicked. In addition, allow to play the game as guest mode without storing any data when landing on the page.
```