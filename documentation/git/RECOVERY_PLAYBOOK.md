# RECOVERY PLAYBOOK (OWNER ONLY)

Procedures for emergency intervention and state recovery.

## 🚨 Emergency Revert
If a malicious or corrupted agent bypasses enforcement:
1. Identify the last "Verified" commit hash.
2. `git reset --hard <hash>`
3. `git push origin main --force` (Use with extreme caution)

## 🔑 Lock Override
If the `PHASE_LOCK` or `SESSION_LOCK` becomes deadlocked:
1. Manually delete `.lock` files.
2. Run `bun run scripts/hard-kill.ts` to stop all processes.
3. Re-verify environment via `bun run check:all`.

## 📜 Doc Hash Recovery
If `DOC_HASHES.json` is corrupted and state is lost:
1. Restore `documentation/` from a known good git state.
2. Run documentation hash regeneration script (Manual check required).
