# AGENT STARTUP PROMPT

**Instruction:**

Before performing any tasks:

1. Read **fully** `documentation/core/AGENT_AUTOSTART.md`
2. Confirm **all audit layers pass** (`bun run audit:ci`)
3. Confirm **Biome configuration** aligns with documentation
4. Validate **CSS and TypeScript rules**
5. Generate **pre-task report** including:
   - Documentation read ✅
   - Audit layers overview
   - Biome linter violations
   - Any uncommitted changes
   - Roles understood
6. Wait for **approval before starting any task**

**Do not execute any other command** until all above steps are complete and reported.

---

## Pre-Task Report Template

```
═══════════════════════════════════════════════════════════════
AGENT PRE-TASK REPORT
═══════════════════════════════════════════════════════════════

📋 Agent Name / ID:    ___________________
🕒 Start Timestamp:    ___________________
🌿 Current Branch:     ___________________

✅ DOCUMENTATION READ:
   [ ] AGENT_AUTOSTART.md (all lines)
   [ ] 00_AGENT_RULES.md
   [ ] 01_ARCHITECTURE.md
   [ ] 02_DESIGN_TOKENS.md
   [ ] 03_UI_COMPONENT_RULES.md
   [ ] 04_GOVERNANCE.md
   [ ] 05_AUDIT_LAYERS.md
   [ ] 06_COMMIT_PROTOCOL.md

🛡 AUDIT LAYERS STATUS:
   Layer 00 (Pre-Flight):    PASS / FAIL
   Layer 01 (Documentation): PASS / FAIL
   Layer 02 (Architecture):  PASS / FAIL
   Layer 03 (TypeScript):    PASS / FAIL
   Layer 04 (Design Tokens): PASS / FAIL
   Layer 05 (Dependencies):  PASS / FAIL
   Layer 06 (Git Health):    PASS / FAIL
   Layer 07 (UI Responsive): PASS / FAIL
   Layer 07.5 (UI Norm):     PASS / FAIL
   Layer 08 (Ownership):     PASS / FAIL
   Layer 09 (Build Verify):  PASS / FAIL

🔍 BIOME STATUS:
   [ ] Checked
   [ ] Issues found: _____
   [ ] Fixed: _____

⚠️ UNCOMMITTED CHANGES:
   [ ] None
   [ ] List: _____

📝 ROLES UNDERSTOOD:
   [ ] No audit bypass
   [ ] No hardcoded values
   [ ] No duplicate components
   [ ] Token discipline
   [ ] Mobile-first responsive
   [ ] Git workflow
   [ ] Forbidden changes

⚠️ ISSUES / RISKS:
   ___________________

═══════════════════════════════════════════════════════════════
Awaiting approval to proceed...
═══════════════════════════════════════════════════════════════
```

---

## Quick Start Commands

```bash
# 1. Create feature branch
git checkout main && git pull && git checkout -b feature/<task-name>

# 2. Run full audit
bun run audit:ci

# 3. Check Biome
bun run biome check .

# 4. Verify build
bun run build

# 5. Report and await approval
```

---

**This prompt ensures safe agent operations and prevents violations.**
