# 02-7用rewind回到完美的那一刻

有時候在輸入錯誤的prompt並執行後, 希望這個錯誤的內容不會被記錄在Context中，這時候就可以使用rewind功能，讓模型回到執行前的狀態。

## 演示

在`claude_code_treasure_game`專案中, 輸入
```text
Check my project with AngularJS to see if any syntax errors.
```

由於專案是用react而不是angular寫的，我們意識到錯誤，這時可以按2次esc鍵並進到rewind模式，選擇剛才輸入的prompt，按下enter，並選擇`Restore...`就可以回到執行前的狀態了。