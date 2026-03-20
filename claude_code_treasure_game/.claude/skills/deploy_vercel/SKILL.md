---
name: deploy_vercel
description: Deploy a web project to Vercel with one command. Use this skill whenever the user wants to deploy to Vercel, push to production, set up Vercel hosting, or mentions Vercel deployment in any way — even casually like "ship it to Vercel" or "put this on Vercel". Also triggers for general cloud deployment questions when the project has a vercel.json or .vercel/ directory.
---

# Deploy to Vercel

This skill handles the full Vercel deployment workflow — from first-time setup to production deployment. It assumes the user may have zero Vercel experience and walks through everything needed.

## Overview

Vercel hosts frontend apps with optional serverless API functions. The deployment flow is:

1. **Preflight checks** — ensure CLI is installed and user is logged in
2. **Project configuration** — create `vercel.json` and adapt the backend for serverless
3. **Deploy** — run `vercel` (preview) or `vercel --prod` (production)

## Step 1: Preflight Checks

Run these checks before anything else:

```bash
# Check if Vercel CLI is installed
vercel --version
```

If not installed, install it:
```bash
npm i -g vercel
```

Then check login status:
```bash
vercel whoami
```

If not logged in, run `vercel login`. This opens a browser for OAuth authentication. Tell the user to complete the login in their browser and come back.

## Step 2: Analyze the Project

Read the project's `package.json`, build config (e.g., `vite.config.ts`), and any existing `vercel.json` to understand:

- **Build command** (e.g., `npm run build`)
- **Output directory** (e.g., `build/`, `dist/`, `.next/`)
- **Whether there's a backend** (Express, Fastify, etc. in `server/` or `api/`)
- **Database usage** (SQLite, etc.)

## Step 3: Configure for Vercel

### 3a: Create `vercel.json`

If no `vercel.json` exists, create one. Adapt based on the project structure:

**Frontend-only project:**
```json
{
  "version": 2,
  "buildCommand": "<detected build command>",
  "outputDirectory": "<detected output dir>"
}
```

**Frontend + API backend (e.g., Express):**
```json
{
  "version": 2,
  "buildCommand": "<detected build command>",
  "outputDirectory": "<detected output dir>",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 3b: Adapt Express Backend for Serverless

Vercel serverless functions don't run long-lived servers. The Express app must be **exported as default** instead of calling `app.listen()`.

Create or adapt `api/index.ts` (or `api/index.js`) at the project root:

```typescript
import app from '../server/index';  // import your Express app
export default app;
```

The original `server/index.ts` must:
- **Export the Express app** as default (add `export default app`)
- **NOT call `app.listen()` unconditionally** — wrap it in a guard:
  ```typescript
  if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server on ${port}`));
  }
  export default app;
  ```

The skill should make these changes automatically, reading the existing server entry point and adapting it.

### 3c: Handle SQLite (Critical Warning)

**SQLite does NOT work on Vercel serverless.** The filesystem is ephemeral — data is lost between invocations, and multiple function instances don't share storage.

If the project uses SQLite (`better-sqlite3`, `sql.js`, etc.):

1. **Warn the user clearly:** "Your project uses SQLite, which won't persist data on Vercel. The frontend will deploy and work, but API calls that read/write the database will fail."
2. **Suggest alternatives:**
   - **Turso** (libSQL) — closest to SQLite, easiest migration
   - **Vercel Postgres** — managed PostgreSQL
   - **Supabase** — PostgreSQL with built-in auth
3. **Ask the user how to proceed:**
   - Deploy frontend only (skip backend)?
   - Deploy everything (backend will error on DB calls)?
   - Migrate the database first?

Do NOT silently deploy a broken backend. Make the user aware and let them decide.

### 3d: Environment Variables

Check if the project uses environment variables (JWT secrets, API keys, etc.). If so:

```bash
# Add env vars to Vercel
vercel env add JWT_SECRET production
vercel env add DATABASE_URL production
```

Or tell the user to set them in the Vercel dashboard under Project Settings > Environment Variables.

### 3e: Update .gitignore

Ensure `.vercel/` is in `.gitignore`:
```bash
echo ".vercel" >> .gitignore
```

## Step 4: Ask Deployment Target

Before deploying, ask the user which environment they want to deploy to — unless they already specified it in their original request (e.g., "deploy to production" or "preview deploy"). Use the `AskUserQuestion` tool with these options:

- **Preview** — Creates a unique preview URL for testing. Good for verifying changes before going live.
- **Production** — Deploys to the production domain. Use when changes are ready for real users.

If the user's original message already makes the target clear (e.g., "ship to prod", "deploy to production", "deploy frontend only" without specifying environment), you can skip this question and proceed directly. When in doubt, ask.

### Preview deployment (for testing):
```bash
vercel --yes
```

This creates a unique preview URL. Share it with the user so they can test.

### Production deployment:
```bash
vercel --prod
```

This deploys to the production domain.

If this is the first deployment, `vercel` will interactively ask to link/create a project. Walk the user through the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Their account
- **Link to existing project?** → No (create new)
- **Project name?** → Suggest the directory name
- **Directory where code is located?** → `./`
- **Override settings?** → No (vercel.json handles it)

## Step 5: Post-Deployment

After successful deployment:

1. **Show the deployment URL** to the user
2. **Check deployment status:**
   ```bash
   vercel ls
   ```
3. **View logs if there are errors:**
   ```bash
   vercel logs <deployment-url>
   ```
4. **Remind about custom domains** (optional):
   ```bash
   vercel domains add <domain>
   ```

## Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check `buildCommand` and `outputDirectory` in vercel.json match the project |
| API routes return 404 | Verify `rewrites` in vercel.json and that `api/index.ts` exports the app |
| "Module not found" in serverless | Native modules (like `better-sqlite3`) don't work in serverless — use cloud DB |
| CORS errors | The frontend and API are on the same domain on Vercel, so remove CORS middleware or adjust origins |
| Environment variables missing | Add them via `vercel env add` or the dashboard |
