# hiskio-claude-code-course

hiskio - Claude Code深度應用: 打造AI時代百倍產能的工程師工作流。

## 使用subtree來管理子模組

課程中會有一些完整的專案範例，為了方便管理，我們使用git subtree來將這些專案範例放在同一個repository裡。

```bash
git checkout -b add-treasure-game
```

執行前不能有任何檔案變更，確保工作區是乾淨的。
子模組的branch是`master`
```bash
git subtree add --prefix=claude_code_treasure_game ../claude_code_treasure_game master --squash
```

**開發方式**

1. 切換目錄： cd ../claude_code_treasure_game
2. 正常開發與 Commit
```bash
git add .
git commit -m "在獨立環境新增功能"
```
3. 將變更「拉進」專案 A
```bash
cd ../hiskio-claude-code-course
git subtree pull --prefix=claude_code_treasure_game ../claude_code_treasure_game master --squash
```