# ENVIRONMENT RULES

Management of secrets and local development variables.

## 🔐 Mandatory Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Server-side ONLY)

## 📜 Handle with Care
1. **No Commit**: Never commit `.env` or `.env.local`.
2. **Naming**: Client-side variables MUST start with `NEXT_PUBLIC_`.
3. **Zod Validation**: All env variables should be validated at runtime in `config/env.ts`.

## 🔄 Deployment
- Environments for staging/production are managed via GitHub Actions / Vercel secrets.
- Values must match those in `documentation/security/ENVIRONMENT_RULES.md` (metadata only).
