# COORDINATOR - IMPLEMENTATION TASKS

**Project:** Shadi V2 - Restaurant Discovery Platform
**Date:** 2026-01-03
**Phase:** UI Design System Completion (Design-Only, No Database)
**Focus:** Professional, Beautiful, Simple UI Designs

---

## TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [User Roles & Dashboards](#user-roles--dashboards)
3. [Page Audit Report](#page-audit-report)
4. [Component Requirements](#component-requirements)
5. [Implementation Tasks](#implementation-tasks)
6. [Design System Rules](#design-system-rules)

---

## PROJECT OVERVIEW

### What We're Building

A restaurant discovery platform for UAE with 7000+ restaurants, featuring:

- **User Dashboard:** Simple, on-the-go experience for finding restaurants
- **Owner Dashboard:** Restaurant management (details, images, menu, Q&A)
- **Admin Dashboard:** Website management and oversight

### Current State

| Category | Status | Missing/Issues |
|----------|--------|----------------|
| Home Page | ✅ Complete | Minor polish needed |
| Auth Pages | ✅ Complete | - |
| Blog System | ✅ Complete | - |
| Cards System | ✅ Complete | Need variants |
| Dashboards | 🔴 Issues | All 3 are too similar |
| Listing Pages | 🟡 Partial | Filter functionality |
| Detail Pages | 🟡 Partial | Complete sections |
| Utility Pages | 🟡 Partial | Various features |

### Design-Only Focus

**This phase is UI/UX design ONLY. NO:**
- ❌ Database work
- ❌ API integration
- ❌ Authentication logic
- ❌ Payment processing
- ❌ Email systems

**YES to:**
- ✅ Professional UI designs
- ✅ Beautiful layouts
- ✅ Simple, intuitive UX
- ✅ Responsive design
- ✅ Design token compliance
- ✅ Accessibility

---

## USER ROLES & DASHBOIDS

### Role 1: Regular User (Customer)

**Purpose:** Find restaurants, read blogs, look for offers

**Characteristics:**
- **Simple, on-the-go** design
- Quick search and discovery
- Mobile-first approach
- Minimal clutter
- Fast access to key information

**Dashboard Features:**
- Favorites list
- Recently viewed
- Saved searches
- Profile settings
- Notification preferences

**Key UI Elements:**
- Clean card-based layout
- Large touch targets (44px min)
- Swipe gestures (where appropriate)
- Bottom navigation for mobile
- Quick filters

---

### Role 2: Restaurant Owner

**Purpose:** Manage restaurant profile, menu, images, answer customer questions

**Characteristics:**
- **Data-entry focused** design
- Form-heavy but organized
- Clear visual hierarchy
- Bulk operations support
- Analytics and insights

**Dashboard Features:**
- Restaurant profile editing
- Image gallery management
- Menu builder/editor
- Q&A management
- Reviews response
- Analytics (views, clicks, calls)
- Business hours editor
- Location/map settings

**Key UI Elements:**
- Tabbed interface for sections
- Rich text editors for descriptions
- Drag-drop image uploads
- Bulk edit capabilities
- Data tables for analytics
- Status indicators

---

### Role 3: Admin (Platform Manager)

**Purpose:** Manage the website, moderate content, oversee all restaurants

**Characteristics:**
- **Management-focused** design
- Data tables and lists
- Moderation queues
- System-wide analytics
- Configuration panels

**Dashboard Features:**
- Restaurant approval queue
- Content moderation (reviews, photos)
- User management
- Analytics dashboard
- System configuration
- Reports & exports
- Activity logs
- Support tickets

**Key UI Elements:**
- Advanced data tables with filters
- Bulk action tools
- Kanban boards for queues
- Chart widgets for analytics
- Activity feed
- Quick action buttons

---

## PAGE AUDIT REPORT

### All Pages (20 Total)

| # | Page | Path | Status | Priority |
|---|------|------|--------|----------|
| 1 | Home | `/` | ✅ Complete | - |
| 2 | Restaurants List | `/restaurants` | 🟡 Partial | HIGH |
| 3 | Restaurant Detail | `/restaurants/[slug]` | 🟡 Partial | HIGH |
| 4 | Cards Showcase | `/cards` | ✅ Complete | - |
| 5 | Favorites | `/favorites` | 🟡 Partial | MEDIUM |
| 6 | Language | `/language` | 🟡 Partial | LOW |
| 7 | Nearby | `/nearby` | 🟡 Partial | MEDIUM |
| 8 | Blog List | `/blog` | ✅ Complete | - |
| 9 | Blog Detail | `/blog/[slug]` | ✅ Complete | - |
| 10 | Settings | `/settings` | ✅ Complete | - |
| 11 | Profile | `/profile` | 🟡 Partial | MEDIUM |
| 12 | Top Rated | `/top-rated` | 🟡 Partial | LOW |
| 13 | Login | `/login` | ✅ Complete | - |
| 14 | Register | `/register` | ✅ Complete | - |
| 15 | Forgot Password | `/forgot-password` | ✅ Complete | - |
| 16 | Privacy Policy | `/privacy` | ✅ Complete | - |
| 17 | Terms of Service | `/terms` | ✅ Complete | - |
| 18 | **User Dashboard** | `/user` | 🔴 Needs redesign | **HIGH** |
| 19 | **Owner Dashboard** | `/owner` | 🔴 Needs redesign | **HIGH** |
| 20 | **Admin Dashboard** | `/admin` | 🔴 Needs redesign | **HIGH** |

---

## COMPONENT REQUIREMENTS

### From Ready Projects (Reference)

The following components are available from ready projects to copy/adapt:

**From `/Users/ahmadabdullah/Desktop/shadi/`:**

#### shadi-ultimate (Animation & Effects)
- Particles effect
- Marquee (scrolling text/banner)
- Typing animation
- Word rotation
- Morphing text
- Blur fade transitions
- Rating stars component
- Search bar with filters
- Filter groups

#### shadi.ae (Restaurant Platform)
- Restaurant cards
- Review system
- Comment system (interactive, threaded)
- User badges
- UI error boundary
- Search component
- Database schema reference

**From Template Ratings (`/Users/ahmadabdullah/Projects/shadi-V2/docs/TEMPLATE-RATINGS.md`):**

#### Best Components to Extract

**From next-shadcn-dashboard (Feature Goldmine):**
- ✅ Complete auth system (Clerk)
- ✅ 12+ custom hooks
- ✅ i18n setup (multi-language)
- ✅ Command palette (Kbar)
- ✅ Sentry integration (error tracking)
- ✅ Data tables (sort, filter, pagination, export)
- ✅ Drag & drop (@dnd-kit)
- ✅ Sign-in page (professional)

**From free-nextjs-admin (Fast & Simple):**
- ✅ ApexCharts (lighter than Recharts)
- ✅ FullCalendar setup
- ✅ Flatpickr (date picker)
- ✅ Swiper (carousel)

**From shadcn-landing-page:**
- ✅ Color scheme (beautiful palette)
- ✅ Icon usage patterns
- ✅ User cards
- ✅ Landing page structure

**From modern-portfolio:**
- ✅ Framer Motion setup
- ✅ Particle effects
- ✅ Smooth animations
- ✅ Swiper integration

---

## IMPLEMENTATION TASKS

### Phase 1: Foundation & Dashboards (HIGH PRIORITY)

#### Task #001: User Dashboard Redesign

**Agent:** Agent-1
**Status:** 📥 Available
**Effort:** Large

**Requirements:**
- Simple, on-the-go design
- Card-based layout
- Bottom navigation for mobile
- Sections:
  - Favorites (saved restaurants)
  - Recently viewed
  - Saved searches
  - Profile settings
  - Notification preferences
- Mobile-first responsive
- Use design tokens exclusively

**Reference:** `/features/dashboard/UserDashboard.tsx`

---

#### Task #002: Owner Dashboard Redesign

**Agent:** Agent-2
**Status:** 📥 Available
**Effort:** Large

**Requirements:**
- Data-entry focused design
- Tabbed interface for sections:
  - Restaurant profile (basic info, location, hours)
  - Image gallery (upload, manage, reorder)
  - Menu builder (categories, items, prices)
  - Q&A (customer questions, answers)
  - Reviews (respond to reviews)
  - Analytics (views, clicks, calls)
- Rich text editors for descriptions
- Drag-drop image uploads
- Data tables for analytics
- Bulk edit capabilities

**Reference:** `/features/dashboard/OwnerDashboard.tsx`

---

#### Task #003: Admin Dashboard Redesign

**Agent:** Agent-3
**Status:** 📥 Available
**Effort:** Large

**Requirements:**
- Management-focused design
- Sections:
  - Restaurant approval queue (kanban or list)
  - Content moderation (reviews, photos queue)
  - User management (table with filters)
  - Analytics dashboard (charts, widgets)
  - System configuration (forms, toggles)
  - Reports & exports (downloadable reports)
  - Activity logs (timeline feed)
  - Support tickets (ticket queue)
- Advanced data tables with filters/sort
- Bulk action tools
- Chart widgets for analytics
- Activity feed
- Quick action buttons

**Reference:** `/features/dashboard/AdminDashboard.tsx`

---

### Phase 2: Page Completions

#### Task #004: Restaurants List - Filter Functionality

**Agent:** Agent-2
**Status:** 📥 Available
**Effort:** Medium

**Current:** Layout exists, filter buttons are non-functional

**Requirements:**
- Implement filter state management
- Create filter dropdown components
- Active/selected state styling
- Sort dropdown
- "Clear all filters" option
- Pagination or "Load more"
- "No results" empty state
- URL state sync (filters in URL)

**Reference:** `/app/restaurants/page.tsx`

---

#### Task #005: Restaurant Detail Page Completion

**Agent:** Agent-1
**Status:** 📥 Available
**Effort:** Medium

**Current:** Delegates to feature component, needs review

**Requirements:**
- Ensure all sections exist:
  - Hero (image, name, rating, status)
  - Info (cuisine, location, hours, phone)
  - Menu (categories, items, prices)
  - Reviews (list, rating breakdown)
  - Location (map, address)
  - Gallery (photos)
- Action buttons (Call, Directions, Share, Favorite)
- Photo gallery with lightbox
- Opening hours with live status (open/closed now)
- Design tokens throughout

**Reference:** `/app/restaurants/[slug]/page.tsx`, `/features/restaurant/RestaurantDetailClient.tsx`

---

#### Task #006: Favorites Page - localStorage Integration

**Agent:** Agent-2
**Status:** 📥 Available
**Effort:** Medium

**Current:** UI exists, no actual functionality

**Requirements:**
- Implement localStorage sync
- Create useFavorites hook
- Heart icon toggle functionality
- Blogs favorites tab
- "Remove all" button
- Sort options
- Empty states

**Reference:** `/app/favorites/page.tsx`

---

#### Task #007: Nearby Page - Distance Calculation

**Agent:** Agent-3
**Status:** 📥 Available
**Effort:** Medium

**Current:** Geolocation works, no distance display

**Requirements:**
- Implement Haversine formula for distance
- Add distance badge to RestaurantCard
- Sort by distance
- Radius filter
- "Refine location" button
- Distance units (km)

**Reference:** `/app/nearby/page.tsx`

---

#### Task #008: Profile Page - User Data Integration

**Agent:** Agent-1
**Status:** 📥 Available
**Effort:** Medium

**Current:** Layout exists, hardcoded data

**Requirements:**
- Remove hardcoded values
- Add edit profile form modal
- Avatar upload functionality
- Fetch real stats (when backend ready)
- Make quick actions functional

**Reference:** `/app/profile/page.tsx`

---

#### Task #009: Top Rated Page - Enhancements

**Agent:** Agent-1
**Status:** 📥 Available
**Effort:** Low

**Current:** Basic filtering works

**Requirements:**
- Add rating threshold selector
- Add cuisine filter
- Add "Best of" badges
- Comparison feature (optional)

**Reference:** `/app/top-rated/page.tsx`

---

#### Task #010: Language Page - i18n Integration

**Agent:** Agent-3
**Status:** 📥 Available
**Effort:** High

**Current:** UI exists, no actual switching

**Requirements:**
- Add language context/store
- Implement language switching (EN/AR minimum)
- Show selected state
- Persist preference in localStorage
- Add RTL support for Arabic
- Use next-intl or similar

**Reference:** `/app/language/page.tsx`

---

### Phase 3: Component Library (As Needed)

#### Task #011: Data Table Component

**Agent:** Agent-2
**Status:** ✅ Complete
**Effort:** Medium

**Requirements:**
- Sortable columns
- Filterable rows
- Pagination
- Row selection (checkbox)
- Bulk actions
- Export functionality
- Mobile responsive (horizontal scroll)
- Design token compliant

**Use For:** Admin dashboard user management, moderation queues

---

#### Task #012: Rich Text Editor Component

**Agent:** Agent-2
**Status:** 📥 Available (if needed)
**Effort:** High

**Requirements:**
- Basic formatting (bold, italic, headings)
- Lists (ordered, unordered)
- Links
- Clean design, minimal toolbar
- Design token compliant
- Mobile-friendly

**Use For:** Owner dashboard (restaurant description, menu items)

---

#### Task #013: File Upload Component

**Agent:** Agent-2
**Status:** ✅ Complete
**Effort:** Medium

**Requirements:**
- Drag-drop support
- Multiple file selection
- Image preview
- Progress indicator
- Error handling
- Design token compliant

**Use For:** Owner dashboard (image gallery), Profile (avatar)

---

#### Task #014: Chart Components

**Agent:** Agent-2
**Status:** ✅ Complete
**Effort:** Medium

**Requirements:**
- Line chart (analytics over time)
- Bar chart (comparisons)
- Pie chart (distributions)
- Responsive design
- Design token compliant
- Use ApexCharts or Recharts

**Use For:** Admin dashboard (analytics), Owner dashboard (stats)

---

#### Task #015: Modal/Dialog System

**Agent:** Agent-1
**Status:** 📥 Available (if needed)
**Effort:** Low

**Requirements:**
- Consistent modal design
- Close on overlay click
- Close on Escape key
- Accessible (focus trap)
- Design token compliant

**Use For:** Edit profile forms, confirmations

---

### Phase 4: Polish & Optimization

#### Task #016: Design Token Audit

**Agent:** Agent-3
**Status:** 📥 Available
**Effort:** Medium

**Requirements:**
- Audit all components for token compliance
- Replace any hardcoded values
- Document any missing tokens
- Add missing tokens to `/styles/tokens.css`
- Ensure 100% token coverage

---

#### Task #017: Accessibility Audit

**Agent:** Agent-1
**Status:** 📥 Available
**Effort:** Medium

**Requirements:**
- Add ARIA labels where missing
- Ensure keyboard navigation works
- Check color contrast ratios
- Test with screen reader
- Fix all accessibility issues

---

#### Task #018: Performance Optimization

**Agent:** Agent-3
**Status:** 📥 Available
**Effort:** Medium

**Requirements:**
- Add React.memo to expensive components
- Implement code splitting where beneficial
- Optimize images (Next.js Image)
- Lazy load components below fold
- Fix any performance bottlenecks

---

#### Task #019: Responsive Design Review

**Agent:** Agent-1
**Status:** 📥 Available
**Effort:** Medium

**Requirements:**
- Test all pages on mobile (375px)
- Test all pages on tablet (768px)
- Test all pages on desktop (1024px+)
- Fix any layout issues
- Ensure touch targets are 44px minimum

---

#### Task #020: Documentation

**Agent:** Agent-2
**Status:** ✅ Complete
**Effort:** Low

**Requirements:**
- Document all custom components
- Create component usage examples
- Document design tokens
- Create storybook (optional)
- Update README

---

## DESIGN SYSTEM RULES

### Absolute Requirements

1. **NO HARDCODED VALUES**
   - All colors use design tokens (color, fg, bg variants)
   - All spacing uses design tokens (spacing scale)
   - All radius uses design tokens (radius scale)
   - All font sizes use design tokens (font size scale)

2. **NO INLINE STYLES**
   - Use className with CSS classes
   - All styles in CSS files or using Tailwind with tokens

3. **NO TYPESCRIPT VIOLATIONS**
   - No `any` types
   - No `never` types (unless genuinely unreachable)
   - No `undefined` in interfaces (use optional `?`)

4. **BEST PRACTICES ONLY**
   - Named exports
   - JSDoc comments
   - Proper error handling
   - Accessibility (ARIA, keyboard nav)
   - Responsive design
   - Performance optimization

### Token Reference

**Colors:**
```css
--fg, --fg-10, --fg-20, --fg-30, --fg-40, --fg-50, --fg-60, --fg-70, --fg-80, --fg-90
--bg, --bg-5, --bg-10, --bg-20
--color-primary, --color-accent, --color-rating, --color-favorite
--card-bg, --border, --glass-bg
```

**Spacing:**
```css
--spacing-xs, --sm, --md, --lg, --xl, --2xl, --3xl, --4xl, --5xl, --6xl
```

**Typography:**
```css
--font-size-xs, --sm, --base, --lg, --xl, --2xl, --3xl, --4xl, --5xl, --6xl
--font-sans, --font-display, --font-mono
```

**Motion:**
```css
--duration-instant, --fast, --normal, --slow
--ease-standard, --ease-emphasized
```

**Border:**
```css
--radius-sm, --md, --lg, --xl, --2xl, --full
--border-width-thin
```

---

## TASK CLAIMING PROCESS

### For Agents:

1. **Read** this tasks.md file
2. **Find** an available task (Status: 📥 Available)
3. **Update** `/coordinator/status.md`:
   ```markdown
   | Task ID | Component | Status | Agent | Updated |
   |---------|-----------|--------|-------|---------|
   | #001 | User Dashboard | 🔨 In Progress | Agent-1 | 2026-01-03 14:30 |
   ```
4. **Work** in your staging folder: `/coordinator/staging/agent-X/task-name/`
5. **Submit** when done, update status to "✅ Ready for Review"

### For Coordinator:

1. **Monitor** status.md for updates
2. **Review** agent work in real-time
3. **Provide** feedback and corrections
4. **Approve** or request revisions
5. **Copy** approved work to main project
6. **Update** progress tracking

---

**READY TO BEGIN 🚀**

---

*Last Updated: 2026-01-03*
