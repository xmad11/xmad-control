# Reference Document

> **Reference only — not required for agent execution**
>
> This document is preserved for detailed reference and troubleshooting.
> For core rules, see `documentation/core/`.

---

# 🧪 TESTING PROTOCOL - Audit System Validation

**Comprehensive testing guide for your current project**

---

## 🎯 TESTING OBJECTIVES

1. ✅ Verify audit system works correctly
2. ✅ Identify all current project violations
3. ✅ Create baseline for improvements
4. ✅ Validate mobile-first compliance
5. ✅ Test before production deployment

---

## 📋 PRE-TEST CHECKLIST

Before running tests:

```bash
# 1. Backup current state
git add .
git commit -m "Pre-audit backup"
git branch backup-$(date +%Y%m%d)

# 2. Ensure clean working directory
git status

# 3. Install all dependencies
bun install

# 4. Verify Bun version
bun --version  # Should be 1.0+
```

-----

## 🔬 TEST PHASE 1: INDIVIDUAL LAYER TESTING (30 minutes)

Test each audit layer independently to isolate issues.

### Layer 00: Pre-Flight

```bash
bun run audit --layer=00
```

**Expected Results:**

- ✅ Bun version >= 1.0
- ✅ All required files exist
- ✅ All required folders exist
- ✅ Git repository initialized

**If fails:**

```bash
# Fix missing folders
mkdir -p app components lib types styles scripts documentation

# Verify files
ls -la package.json tsconfig.json biome.json
```

### Layer 01: Documentation

```bash
# First, acknowledge docs
bun run ack-docs

# Then test
bun run audit --layer=01
```

**Expected Results:**

- ✅ All documentation files exist
- ✅ `.guard/ACK_OK.json` created
- ✅ Documentation hashes match

**If fails:**

```bash
# Create missing documentation
touch documentation/DESIGN_SYSTEM.md
touch documentation/MOBILE_FIRST.md
touch documentation/COMPONENT_INVENTORY.md

# Re-acknowledge
bun run ack-docs
```

### Layer 02: Architecture

```bash
bun run audit --layer=02
```

**Expected Results:**

- ✅ No layer violations
- ✅ Components in correct folders
- ✅ No duplicate files
- ✅ Quotas not exceeded

**Common Violations:**

```
❌ LAYER_VIOLATION: File in wrong folder
❌ DUPLICATE_FILES: Same content in multiple files
❌ QUOTA_EXCEEDED: Too many components
```

**Fix Strategy:**

```bash
# Move files to correct folders
mv app/Button.tsx components/ui/Button.tsx

# Remove duplicates
# (Manually compare and delete)

# Consolidate components if over quota
```

### Layer 03: TypeScript

```bash
bun run audit --layer=03
```

**Expected Violations (if migrating from old project):**

```
❌ FORBIDDEN_TYPE: any detected
❌ NON_NULL_ASSERTION: ! operator
❌ ESCAPE_HATCH: @ts-ignore found
❌ UNSAFE_CAST: as unknown as
```

**Fix Examples:**

```typescript
// ❌ BEFORE
const data: any = fetchData();
const value = data.result!;
// @ts-ignore
const typed = value as unknown as MyType;

// ✅ AFTER
interface DataResponse {
  result: MyType | null;
}
const data: DataResponse = fetchData();
const value = data.result ?? defaultValue;
const typed: MyType = isMyType(value) ? value : defaultValue;
```

### Layer 04: Design Tokens

```bash
bun run audit --layer=04
```

**Expected Violations (if migrating):**

```
❌ HARDCODED_COLOR: #ff0000 detected
❌ HARDCODED_SPACING: p-[20px] detected
❌ OLD_TAILWIND_CLASS: bg-blue-500
❌ INLINE_STYLE: style={{}}
❌ TOUCH_TARGET_TOO_SMALL: 30px button
```

**Fix Examples:**

```tsx
// ❌ BEFORE
<div
  className="bg-blue-500 p-[20px] rounded-[10px]"
  style={{ backgroundColor: '#ff0000' }}
>
  <button className="w-[30px] h-[30px]">X</button>
</div>

// ✅ AFTER
<div className="
  bg-[rgb(var(--color-primary))]
  p-[var(--spacing-lg)]
  rounded-[var(--radius-md)]
">
  <button className="size-[44px]">X</button>
</div>
```

### Layer 05: Dependencies

```bash
bun run audit --layer=05
```

**Expected Results:**

- ✅ package.json valid
- ✅ No unauthorized dependencies
- ✅ No vulnerabilities
- ✅ Lockfile in sync

**If fails:**

```bash
# Update vulnerable packages
bun update

# Remove unauthorized dependencies
bun remove <package-name>

# Regenerate lockfile
rm bun.lockb
bun install
```

### Layer 06: Git Health

```bash
bun run audit --layer=06
```

**Expected Results:**

- ✅ On feature branch (not main)
- ✅ Clean .gitignore
- ✅ No large files tracked
- ✅ No build folders in git

**If fails:**

```bash
# Create feature branch
git checkout -b audit-testing

# Remove tracked build folders
git rm -r --cached node_modules .next
git commit -m "Remove build folders from git"

# Fix .gitignore
echo "node_modules/" >> .gitignore
echo ".next/" >> .gitignore
echo "dist/" >> .gitignore
```

### Layer 07: UI Responsive

```bash
bun run audit --layer=07
```

**Expected Violations (mobile-first project):**

```
❌ DESKTOP_FIRST_PATTERN: md: without base
❌ TOUCH_TARGET_TOO_SMALL: Buttons < 44px
❌ FIXED_WIDTH_NO_RESPONSIVE: No breakpoint overrides
❌ NON_FLUID_TYPOGRAPHY: Fixed px sizes
```

**Fix Examples:**

```tsx
// ❌ BEFORE
<div className="md:p-8 w-[600px] text-[20px]">
  <button className="w-[30px]">Click</button>
</div>

// ✅ AFTER
<div className="p-4 md:p-8 w-full md:w-[600px] text-[clamp(16px,4vw,20px)]">
  <button className="size-[44px]">Click</button>
</div>
```

### Layer 08: Ownership

```bash
bun run audit --layer=08
```

**Expected Results:**

- ✅ CODEOWNERS file exists
- ✅ Protected paths have owners
- ✅ No unauthorized modifications

**If fails:**

```bash
# Create CODEOWNERS
mkdir -p .github
cat > .github/CODEOWNERS << 'EOF'
# Design System
/styles/tokens.css @owner
/styles/globals.css @owner

# Audit System
/scripts/audit/ @owner

# Shared Components
/components/shared/ @owner

# Documentation
/documentation/ @owner
EOF
```

### Layer 09: Build Verification

```bash
bun run audit --layer=09
```

**Expected Results:**

- ✅ TypeScript compiles
- ✅ Production build succeeds
- ✅ Bundle size reasonable
- ✅ No build warnings

**If fails:**

```bash
# Check TypeScript errors
bun run tsc --noEmit

# Try building
bun run build

# Check bundle size
du -sh .next/static

# Optimize if needed
# - Use dynamic imports
# - Optimize images
# - Remove unused dependencies
```

-----

## 🔄 TEST PHASE 2: FULL AUDIT (10 minutes)

Run complete audit:

```bash
bun run audit > audit-baseline.txt
```

### Save Baseline Report

```bash
# Save for tracking
cp .audit/audit-report.json .audit/baseline-$(date +%Y%m%d).json

# Create summary
cat audit-baseline.txt
```

### Analyze Results

```bash
# Count violations by severity
cat .audit/audit-report.json | grep -o '"severity":"[^"]*"' | sort | uniq -c

# Example output:
#   15 "severity":"critical"
#    8 "severity":"high"
#   22 "severity":"medium"
#    5 "severity":"low"
```

-----

## 📊 TEST PHASE 3: FIX AND VERIFY (Variable Time)

### Strategy: Fix by Severity

```bash
# 1. Fix all CRITICAL first
cat .audit/audit-report.json | grep -A 5 '"severity":"critical"'

# 2. Then HIGH
cat .audit/audit-report.json | grep -A 5 '"severity":"high"'

# 3. Then MEDIUM
cat .audit/audit-report.json | grep -A 5 '"severity":"medium"'

# 4. LOW can wait
```

### Fixing Process

For each violation:

1. **Read the violation**

```json
{
  "type": "HARDCODED_COLOR",
  "severity": "critical",
  "file": "components/Button.tsx",
  "line": 15,
  "message": "Hardcoded hex color detected",
  "fix": "Use design token: bg-[rgb(var(--color-primary))]"
}
```

1. **Open the file**

```bash
code components/Button.tsx:15
```

1. **Apply the fix**

```tsx
// Before
<button className="bg-#ff0000">

// After
<button className="bg-[rgb(var(--color-primary))]">
```

1. **Verify fix**

```bash
bun run audit --layer=04
```

1. **Commit**

```bash
git add components/Button.tsx
git commit -m "fix: replace hardcoded color with design token"
```

### Auto-Fix When Safe

```bash
# Try auto-fix
bun run audit --fix

# Review changes
git diff

# If good, commit
git add .
git commit -m "fix: auto-fix audit violations"

# If not good, revert
git checkout .
```

-----

## 🎯 TEST PHASE 4: MOBILE-FIRST VALIDATION (30 minutes)

Test responsive design manually:

### Breakpoint Testing

```bash
# Start dev server
bun run dev
```

Test these widths in browser DevTools:

```
320px  - iPhone SE (small mobile)
375px  - iPhone 12/13 (standard mobile)
414px  - iPhone 14 Pro Max (large mobile)
768px  - iPad (tablet)
1024px - iPad Pro / Small laptop
1440px - Desktop
```

### Checklist per Breakpoint

For each width:

- [ ] Header visible and functional
- [ ] Navigation accessible
- [ ] Touch targets >= 44px
- [ ] No horizontal scroll
- [ ] Text readable (not too small)
- [ ] Images load and scale
- [ ] Buttons work
- [ ] Forms usable

### Mobile-First Validation Commands

```bash
# Check touch targets
bun run audit --layer=07 | grep "TOUCH_TARGET"

# Check responsive classes
grep -r "md:\|lg:\|xl:" . --include="*.tsx" --include="*.jsx"

# Verify no desktop-first patterns
grep -r "className=\".*md:" . --include="*.tsx" --include="*.jsx" | grep -v "className=\"[^\"]* [a-zA-Z]-"
```

-----

## 📈 TEST PHASE 5: PRODUCTION READINESS (15 minutes)

### Final Production Checks

```bash
# 1. Full audit must pass
bun run audit

# 2. Build must succeed
bun run build

# 3. Check bundle size
du -sh .next/static/chunks/

# 4. Verify no console errors
bun run start &
# Open browser, check console
pkill -f "next start"
```

### Pre-Deploy Checklist

- [ ] All critical violations fixed
- [ ] Build succeeds without warnings
- [ ] Bundle size under limits
- [ ] Mobile responsive tested
- [ ] All breakpoints working
- [ ] No console errors
- [ ] Documentation updated if needed

### Save Final Report

```bash
# Save production report
bun run audit > production-ready-$(date +%Y%m%d).txt

# Create before/after comparison
diff audit-baseline.txt production-ready-$(date +%Y%m%d).txt > improvement-report.txt

echo "✅ Testing complete!"
echo "Improvements:"
cat improvement-report.txt
```

-----

## 🎯 SUCCESS METRICS

### Testing Complete When:

- [ ] Full audit passes (`bun run audit` exits with code 0)
- [ ] 0 critical violations
- [ ] <5 high violations (if any)
- [ ] Build succeeds
- [ ] All mobile breakpoints tested
- [ ] Bundle size reasonable
- [ ] Documentation complete

### Final Report Template

```markdown
# Audit System Testing Report

## Date: $(date)
## Project: shadi-V2

### Initial State
- Total violations: X
- Critical: Y

### Final State
- Total violations: A
- Critical: 0
- High: B

### Improvements
- Fixed X-Y critical violations
- Reduced total violations by Z%

### Mobile-First Compliance
- ✅ All breakpoints tested
- ✅ Touch targets >= 44px
- ✅ No desktop-first patterns

### Production Ready
- ✅ Build succeeds
- ✅ Bundle size: X MB
- ✅ No console errors
```

-----

## 🆘 EMERGENCY PROCEDURES

### If Audit System Fails

```bash
# Check individual layers
for i in {00..09}; do
  echo "Testing layer $i..."
  bun run audit --layer=$i
  echo "---"
done

# Check script permissions
ls -la scripts/audit-runner.ts scripts/audit/*.ts

# Verify dependencies
bun list | grep ts-morph
```

### If Build Fails

```bash
# Check TypeScript
bun run tsc --noEmit --pretty

# Check Next.js config
bun run next info

# Clean build
rm -rf .next
bun run build
```

### If Too Many Violations

1. Focus on critical first
2. Use `--fix` for safe changes
3. Commit fixes in batches
4. Re-run audit after each batch
5. Document what can't be fixed

-----

**Testing is complete!** Your project is now validated with the audit system.

Run tests regularly to maintain code quality and catch issues early.
