# XMAD Control - Gemini CLI Context

## CRITICAL: FILE READING RULES
- **AUTO-READ**: Only `GEMINI.md`, `CLAUDE.md`, `AGENT.md` — nothing else
- **NEVER** read any other file unless the user explicitly asks you to
- **NEVER** scan directories, list files, or explore the codebase on your own
- If the user asks a question, answer from this file or `CLAUDE.md` first
- Only read a source file when the user says "read X" or "look at Y"
- This saves tokens and prevents the scanning loop bug (#22141)

## Project Stack
- **Framework**: Next.js 16 (App Router only, NO Pages router)
- **React**: 19
- **Styling**: Tailwind CSS v4 (NO v3 syntax, NO @apply in components)
- **Language**: TypeScript (strict mode)
- **Package Manager**: bun
- **Backend**: Server Actions, API routes (App Router)
- **Python**: AI scripts and tools (scoped to specific files only)

## Code Rules
- Always use `async/await` over `.then()`
- Use React Server Components by default, add `"use client"` only when needed
- Use `pnpm`/`bun` commands — never `npm` or `yarn`
- Import from `@/` path aliases, never relative paths that cross more than 2 levels
- All API routes go in `app/api/` (App Router convention)
- Use Zod for runtime validation at API boundaries
- Error boundaries are required for every route segment

## File Organization
- `app/` — Next.js App Router pages and layouts
- `components/` — Reusable React components
- `lib/` — Shared utilities and helpers
- `hooks/` — Custom React hooks
- `types/` — TypeScript type definitions
- `public/` — Static assets

## Context Scope Rules
- When asked about Python, ONLY read files in the specified path — do NOT scan the Next.js project
- When asked about Next.js, do NOT scan Python directories
- Limit file reads to the specific module being discussed
- Never read `node_modules/`, `.next/`, or lock files

## Known Issues (Gemini CLI)
- If agent enters a loop, stop and restart with a fresh session
- Do NOT use `--resume` after a stuck session
- For complex architectural tasks, switch to `gemini-2.5-pro` via `/model`
- Keep context focused — avoid asking broad questions about the entire monorepo
