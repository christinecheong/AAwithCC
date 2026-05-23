# /ship — Publish to GitHub Safely

Publish this project to GitHub. Work through every step in order. **Stop and report if any step fails** — never push without completing Step 1.

---

## Step 1 — Security Scan (mandatory — do not skip)

Use the Grep tool to search for the following secret patterns across all non-`.git` files:

| Pattern | What it detects |
|---------|----------------|
| `sk-ant-[a-zA-Z0-9]` | Anthropic API keys |
| `ghp_\|github_pat_` | GitHub personal access tokens |
| `AKIA[A-Z0-9]{16}` | AWS access key IDs |
| `password\s*[:=]\s*\S` | Hardcoded passwords |
| `secret\s*[:=]\s*\S` | Hardcoded secrets |
| `api_key\s*[:=]\s*\S` | Hardcoded API keys |
| `Bearer [A-Za-z0-9\-_]{20,}` | Bearer tokens |

Also run `git status --short` and confirm no `.env` or `*.pem` file appears as staged or untracked.

**If any secret pattern is found in a non-example, non-documentation context → STOP. Report the file path and line number. Do not proceed until the user resolves it.**

---

## Step 2 — Verify / Create `.gitignore`

Check whether `.gitignore` exists at the repo root.

If it is missing or lacks entries for `.env`, `*.pem`, `*.key`, `.DS_Store`, and `Thumbs.db`, create or update it to include at minimum:

```
# Environment & secrets
.env
.env.*
*.env
*.pem
*.key
*.p12
*.pfx
secrets.*
config.local.*

# OS artifacts
.DS_Store
Thumbs.db
desktop.ini
```

Confirm the file is saved before continuing.

---

## Step 3 — Update README.md

Regenerate `README.md` to accurately reflect the current state of `index.html` and the repository. Follow the style of https://github.com/alfredang/ai-cms:

**Required sections (in order):**
1. Shields.io badges — GitHub Pages (live), Stack (HTML/CSS/JS), WSQ Funded, License
2. `# Agentic AI Applications with Claude Code` heading
3. One-sentence executive summary (zero-dependency, browser-only, no build step)
4. `🌐 **Live demo:** https://christinecheong.github.io/AAwithCC/`
5. `## What's Inside` — 3 topics and 12 subtopics with bullet-point detail
6. `## Architecture` — ASCII diagram of `index.html` structure (style block, body, tabs, accordions, script)
7. `## Quick Start` — clone + open in Chrome (Windows one-liner) + double-click fallback
8. `## File Layout` — markdown table (index.html, deploy.yml, CLAUDE.md, ship.md, legacy files)
9. `## Deployment` — explain the GitHub Actions workflow with a trimmed YAML snippet
10. `## Extending the Page` — how to add a tab, how to add an accordion item, the apostrophe gotcha
11. `## License` — All Rights Reserved © Christine Cheong

**Style rules:**
- `##` for major sections, `###` for subsections
- **Bold** for emphasis on feature names
- `code font` for file paths, HTML classes, and technical terms
- Markdown tables for structured data
- Fenced code blocks with language tags (`bash`, `yaml`)
- Minimal emoji — only 🌐 on the live demo line

---

## Step 4 — Verify GitHub Actions Workflow

Confirm `.github/workflows/deploy.yml` exists and contains:
- Trigger on `push` to `main` and `workflow_dispatch`
- Permissions: `pages: write`, `id-token: write`, `contents: read`
- Steps: `actions/checkout@v4` → `actions/configure-pages@v5` → `actions/upload-pages-artifact@v3` (with `path: '.'`) → `actions/deploy-pages@v4`

If the file is missing or malformed, create it with the above shape. If it already exists and is correct, no changes needed.

---

## Step 5 — Commit and Push

Run these commands in sequence and show the output of each:

```bash
git add -A
git status
```

Review what will be committed. Then:

```bash
git commit -m "chore: update README, add .gitignore, ensure Pages workflow"
git push origin main
```

**Rules:**
- If `git status` shows the working tree is already clean, skip the commit and run `git push` only (in case of un-pushed commits).
- If `git push` is rejected (non-fast-forward error), **do not force-push**. Report the rejection message and ask the user how to proceed.
- Show the full output of `git push` so the user can see the remote ref update.

---

## Step 6 — Update Repo About

Run the following GitHub CLI command to set the repository description, homepage, and topics:

```bash
gh repo edit christinecheong/AAwithCC \
  --description "Agentic AI Applications with Claude Code — interactive reference covering context engineering, MCP, multi-agent orchestration, and GitHub Actions CI" \
  --homepage "https://christinecheong.github.io/AAwithCC/" \
  --add-topic "claude-code" \
  --add-topic "agentic-ai" \
  --add-topic "github-pages" \
  --add-topic "static-site" \
  --add-topic "anthropic"
```

If `gh` is not installed or not authenticated, skip and show the user these manual steps:
1. Go to **https://github.com/christinecheong/AAwithCC**
2. Click the ⚙️ gear icon next to **About** (top-right of the repo page)
3. Set **Description**: `Agentic AI Applications with Claude Code — interactive reference covering context engineering, MCP, multi-agent orchestration, and GitHub Actions CI`
4. Set **Website**: `https://christinecheong.github.io/AAwithCC/`
5. Set **Topics**: `claude-code`, `agentic-ai`, `github-pages`, `static-site`, `anthropic`

---

## Step 7 — Summary Report

Print a table summarising each step:

| Step | Status | Notes |
|------|--------|-------|
| 1 — Security scan | ✅ / ⚠️ | |
| 2 — .gitignore | ✅ / ✅ created | |
| 3 — README.md | ✅ updated | |
| 4 — GitHub Actions | ✅ exists / ✅ created | |
| 5 — git push | ✅ / ⚠️ | commit SHA |
| 6 — Repo about | ✅ / ⚠️ manual needed | |

Then print:

```
🌐 Live site:   https://christinecheong.github.io/AAwithCC/
📦 Repository:  https://github.com/christinecheong/AAwithCC
⏱  Pages usually reflects the new commit within 60–90 seconds.
```
