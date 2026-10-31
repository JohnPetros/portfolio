# AGENTS.md

## Visual validation

- Use **only the `playwright-cli` command** (run from the shell) to check UI changes visually: screenshots, viewport resizing, layout checks.
- Do **not** use the Playwright MCP tools (`mcp__playwright__*`) or any other browser-automation MCP for this.
- Workflow: start the dev server (`pnpm dev`, http://localhost:3000), drive it with `playwright-cli`, then stop the server and delete any screenshots you created.
- The splash intro covers the page on first load. Dismiss it (or set `sessionStorage` key `petros-splash-seen`) before taking screenshots.
