# GIT STRICT PROTOCOL

## Branch Creation Rules

### ✅ Branch Naming Convention
- Format: `feature/description`, `fix/description`, `ui/description`
- Example: `ui/responsive-header-fix`, `fix/warm-theme-hydration`
- No spaces - use hyphens only
- Keep descriptions concise but descriptive

### ✅ Branch Creation Process
```bash
# Always create from latest main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### ❌ Forbidden Branch Operations
- NEVER commit directly to main
- NEVER create branches from stale feature branches
- NEVER use `git merge` without reviewing
- NEVER force push to shared branches

## Commit Rules

### ✅ Atomic Commits
Each commit must:
1. Do ONE logical thing
2. Have a clear, descriptive message
3. Pass all tests
4. Be reviewable in < 5 minutes

### ✅ Commit Message Format
```
type(scope): brief description

Optional detailed explanation

Fixes #123
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `ui:` UI/UX changes only
- `refactor:` Code refactoring
- `docs:` Documentation changes
- `chore:` Maintenance tasks

**Examples:**
```
ui(header): remove hardcoded warm background color

Fixes hydration mismatch where warm theme applied differently
on desktop vs mobile due to inline conditional class

feat(theme): add hydration guard to ThemeModal

Prevents SSR/client mismatch by waiting for mount before
rendering theme-dependent UI
```

### ❌ Forbidden Commit Patterns
- NO "WIP" or "fixup" commits in main branch
- NO multiple unrelated changes in one commit
- NO commit messages like "fix stuff" or "updates"
- NO formatting-only commits (use IDE formatting)

## Pull Request / Merge Rules

### ✅ PR Requirements
- Clear title and description
- Link to related issues
- All tests passing
- At least one approval
- No merge conflicts

### ✅ Review Process
1. Self-review your own PR first
2. Request review from relevant team member
3. Address all feedback
4. Keep PR conversation focused

### ✅ Merge Process
```bash
# After PR is approved and merged
git checkout main
git pull origin main
git branch -d feature/branch-name  # Delete local branch
```

## Agent Failure Scenarios

### 🚨 Critical Violations
If an agent commits any of these to main:
1. **node_modules** in git
2. **.next/cache** committed
3. **Root commits** with 1000+ files
4. **Mixed infrastructure + UI** in one PR

### Immediate Recovery Steps
```bash
# 1. Stop everything
# 2. Identify bad commit
git log --oneline -10

# 3. Hard reset to before the violation
git reset --hard <commit-before-violation>

# 4. Force push (ONLY if branch hasn't been shared)
git push --force-with-lease origin main

# 5. Notify team immediately
# 6. Create incident report
```

### Agent Safe Mode Checklist
Before any git operation:
- [ ] Am I on a feature branch? (NEVER main)
- [ ] Have I run `git status` recently?
- [ ] Am I committing node_modules or .next?
- [ ] Is my commit message clear?
- [ ] Is this one logical change?

## Owner Recovery Playbook

### When Main is Corrupted
1. **Assess the damage**
   ```bash
   git log --stat | head -20  # See what was changed
   git diff HEAD~5 HEAD       # Review recent changes
   ```

2. **Choose recovery strategy**

   **Option A: Soft Reset (keep changes)**
   ```bash
   git reset --soft <good-commit>
   # Review and re-commit properly
   ```

   **Option B: Hard Reset (discard changes)**
   ```bash
   git reset --hard <good-commit>
   git push --force-with-lease origin main
   ```

3. **Validate recovery**
   ```bash
   git status  # Should be clean
   bun run build && bun test  # Must pass
   ```

### Prevention Measures
1. **Protected Branches**
   - Enable branch protection on main
   - Require PR reviews
   - Require status checks

2. **Pre-commit Hooks**
   ```bash
   # .husky/pre-commit
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"

   # Check for node_modules
   if git ls-files | grep -q "node_modules/"; then
       echo "❌ node_modules detected in staging area"
       exit 1
   fi

   # Run tests
   bun test
   ```

3. **Git Hooks**
   ```bash
   # .git/hooks/pre-commit
   # Prevent commits to main
   if [ "$(git branch --show-current)" = "main" ]; then
       echo "❌ Cannot commit directly to main"
       exit 1
   fi
   ```

## Emergency Commands

### Last Resort: Full Reset
```bash
# WARNING: Destroys all local changes
git fetch origin
git reset --hard origin/main
git clean -fd  # Remove untracked files/dirs
```

### Recover Lost Work
```bash
# Find lost commits
git reflog
git checkout <lost-commit-hash>

# Create new branch from lost commit
git checkout -b recovery/<branch-name>
```

### Clean Up Messy History
```bash
# Interactive rebase to clean up
git rebase -i HEAD~5

# Use:
# pick = keep commit
# squash = combine with previous
# reword = change message
# drop = remove commit
```

Remember: Git is your safety net, but only if used properly. When in doubt, ask for help before using force commands.