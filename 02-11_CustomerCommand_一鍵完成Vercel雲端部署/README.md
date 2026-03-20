# 02-11 Customer Command_一鍵完成Vercel雲端部署

[Extend Claude with skills](https://code.claude.com/docs/en/skills)中提到：
> Custom commands已合併至Skills。位於 .claude/commands/deploy.md 的檔案與位於 .claude/skills/deploy/SKILL.md 的技能都會建立 /deploy 指令且運作方式相同。您現有的 .claude/commands/ 檔案仍可正常運作。技能新增了可選功能：用於存放支援檔案的目錄、可透過 frontmatter 控制由您或 Claude 觸發，以及讓 Claude 在相關時機自動載入它們的能力。

## 要做的項目

- 安裝`skill-creator` skill
- 使用`skill-creator`建立`deploy_vercel`一鍵部署網站到vercel的Skill
- 

## 建立部署到Vercel的Skill

1. 使用Claude Code的`/plugin`安裝anthropics的skill-creator到本機

```bash
# Add the marketplace                               
/plugin marketplace add anthropics/skills
                                                                                            
# Install a specific skill                   
/plugin install skill-creator@anthropics-skills
```

成功後, `.claude/settings.local.json`會新增以下內容：

```json
{
  "enabledPlugins": {
    "skill-creator@claude-plugins-official": true
  }
}
```

2. 使用skill-creator建立一個新的Skill，命名為`deploy_vercel.md`

```text
help me create my custom skill call `deploy_vercel`.
```

```text
~/.claude/skills/deploy_vercel/SKILL.md
```

結果會放在user level的claude中.
Note: 調整prompt `and place my repo .claude/skills directory`, 將skill生成到本地的`.claude/skills`目錄下。
```text
Location: ~/.claude/skills/deploy_vercel/SKILL.md                                         
                                                                                            
  What it does:                                                                             
  1. Checks if Vercel CLI is installed (installs if needed)                                 
  2. Checks login status (guides you through OAuth login)                                   
  3. Analyzes your project structure (build command, output dir, backend, database)         
  4. Creates vercel.json with proper config                                                 
  5. Adapts Express backend for serverless (export instead of app.listen())                 
  6. Warns you about SQLite — it won't persist on Vercel serverless, and gives you options  
  7. Handles environment variables (JWT_SECRET, etc.)                                       
  8. Deploys with vercel (preview) or vercel --prod (production)                            
                                                                                            
  How to use it:                                                                            
  - Type /deploy_vercel in any Claude Code session                                          
  - Or just say "deploy to Vercel" and it should trigger automatically                      
                                                                                            
  Important caveat for your treasure game: Your backend uses SQLite (better-sqlite3), which 
  won't work on Vercel serverless. When you run the skill, it will warn you and give you    
  options — deploy frontend only, or migrate to a cloud database like Turso first. 
```

## 使用`deploy_vercel`來部署

這次我們實驗讓Claude**自動使用**`deploy_vercel`來部署：

```text
I want to deploy my local project to vercel. Once done, give me the url to see my project on the internet.
```

會遇到錯誤: vercel cli未安裝
```bash
Vercel CLI is not installed. Let me install it first.
```

安裝後會提示驗證，使用 google oauth登入，選Allow，Clsude Code會繼續執行。

最後完成的訊息：
```text
Your project is live! Here's your URL:       
                                                                                            
  https://claudecodetreasuregame-pearl.vercel.app                                           
                                                                                            
  The deployment was successful — the frontend (React treasure game) is fully functional on 
  the internet.                                                                             
                                                                                            
  Note: The backend API (login/scores) uses SQLite which won't persist data on Vercel       
  serverless. The game itself works great for playing, but if you want persistent user
  accounts and leaderboards, you'd need to migrate to a cloud database like Turso or Vercel 
  Postgres in the future.                             
                                           
  Changes made to your project:                     
  - server/index.ts — added export default app and guarded app.listen() for production
  - api/index.ts — new file that re-exports the Express app for Vercel serverless           
  - vercel.json — deployment config (build command, output dir, API rewrites)  
```

## 調整SKILL

我希望每次都能詢問是要部署到哪個環境

```text
/skill-creator:skill-creator modify deploy_vercel skill: make a selection user interface
  to ask preview or production deployment when user ask invoke the skill. 
```

會在skill中使用`AskUserQuestion` tool來實現。

## 測試手動動使用`/deploy_vercel`指令來部署：

後端會有SQLite的警告，選擇部署frontend only：
```text
/deploy_vercel deploy frontend only
```

**測試異動比較preview與prod**

```text
Players will now receive $150 for finding treasure instead of $100.
```

先部署到preview後，在2個網頁上比對prod的差異。完成無誤後，再部署到prod。

