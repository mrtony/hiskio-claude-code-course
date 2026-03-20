# 02-10 ClaudeCode的CrossSession記憶_AutoMemory

自動記憶功能讓 Claude 能夠跨對話累積知識，無需您手動記錄任何內容。Claude 會在運作過程中為自己儲存筆記：建置指令、除錯心得、架構筆記、程式碼風格偏好與工作流程習慣。Claude 並非每次對話都會儲存內容，它會根據資訊在未來對話中是否有用，來決定哪些內容值得記住。

## 配置

預設為開啟, 可以在 `session.json`/`settings.local.json` 中關閉:

```json
{
  "autoMemoryEnabled": false
}
```

也可以用環境變數設定
```bash
CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

## 儲存位置

專案預設的儲存路徑(工作目錄及其子目錄共用同一個位置)：
`~/.claude/projects/<project>/memory/`

您也可以在 `session.json`/`settings.local.json` 中自訂儲存路徑:
```json
{
  "autoMemoryDirectory": "~/my-custom-memory-dir"
}
```