# FORBIDDEN CHANGES

These modifications are STRICTLY PROHIBITED and will cause a hard rejection.

## 🚫 Core Prohibitions

1. **Database Integration**: No new `.sql`, `prisma`, or Supabase-specific DB files without authorization.
2. **Git Bypass**: No modification of `.git/`, `.gitignore`, or git hooks unless by the owner.
3. **Hardcoded UI**: No HEX/RGB values in `.tsx` or `.css` (except in `tokens.css`).
4. **Duplicate Configs**: No adding `prettier.config.js` or `.eslintrc.json`. Use Biome exclusively.
5. **Layer 0 Violation**: No writing code that contradicts the rules in `documentation/`.
6. **Direct Style Props**: No large `style={{ ... }}` objects. Use Tailwind classes.
7. **Legacy CSS**: No `.scss` or `.less`. Vanilla CSS + Tailwind 4 only.

## 🔓 Phase 2 Lock Constraints
While in Phase 2:
- **Locked**: `/lib/supabase/` - Do not touch.
- **Locked**: `/types/database.ts` - Do not touch.
- **Open**: `components/`, `app/`, `styles/`.
