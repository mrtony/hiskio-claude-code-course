# hiskio-claude-code-course

hiskio - Claude Code深度應用: 打造AI時代百倍產能的工程師工作流。

## 使用subtree來管理子模組

課程中會有一些完整的專案範例，為了方便管理，我們使用git subtree來將這些專案範例放在同一個repository裡。

```bash
git checkout -b add-treasure-game
```

執行前不能有任何檔案變更，確保工作區是乾淨的。
```bash
git subtree add --prefix=claude_code_treasure_game ../claude_code_treasure_game main --squash
```