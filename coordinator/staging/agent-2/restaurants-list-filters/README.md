# Restaurants List Filter Functionality

Complete filter system for the restaurants list page with dropdowns, state management, URL sync, pagination, and empty states.

## Features

- **Filter Dropdowns** - Emirate, Cuisine, Price, Rating with search
- **Sort Options** - Relevance, Rating, Price, Newest, Popularity
- **Active Filters Display** - Visual badges with remove buttons
- **Clear All Filters** - Reset to default state
- **URL State Sync** - Filters persist in URL query params
- **Load More Pagination** - Progressive loading with button
- **Empty State** - Friendly message when no results
- **Results Count** - Shows filtered count
- **100% Design Token Compliant** - No hardcoded values

## Installation

Copy all files from this staging folder to your project:

```bash
cp -r /coordinator/staging/agent-2/restaurants-list-filters/* /app/restaurants/
```

Or import individual components:

```tsx
import { FilterBar, useRestaurantFilters } from "@/features/filters/restaurants"
```

## Usage

### Using the Hook

```tsx
import { useRestaurantFilters } from "@/features/filters/restaurants"

function RestaurantsPage() {
  const {
    filters,           // Current filter state
    sort,              // Current sort option
    setFilters,        // Update filters
    setSort,           // Update sort
    resetFilters,      // Reset all filters
    getActiveFilterCount, // Get active filter count
  } = useRestaurantFilters({
    initialFilters: { emirate: "dubai" },
    initialSort: "rating",
  })

  // Use filters to filter your restaurant data
  const filtered = filterRestaurants(restaurants, filters, sort)
}
```

### Using the FilterBar Component

```tsx
import { FilterBar } from "@/features/filters/restaurants"

<FilterBar
  filters={filters}
  sort={sort}
  onFilterChange={(newFilters) => setFilters(newFilters)}
  onSortChange={setSort}
  onClearAll={resetFilters}
  options={{
    emirates: EMIRATE_OPTIONS,
    cuisines: CUISINE_OPTIONS,
    priceRanges: PRICE_OPTIONS,
    ratings: RATING_OPTIONS,
  }}
  resultCount={filteredRestaurants.length}
/>
```

### Using Filter Dropdowns Individually

```tsx
import { FilterDropdown } from "@/features/filters/restaurants"

<FilterDropdown
  label="Cuisine"
  value={selectedCuisine}
  options={[
    { value: "italian", label: "Italian", count: 45 },
    { value: "indian", label: "Indian", count: 67 },
  ]}
  onChange={setSelectedCuisine}
  showCount
  searchable
/>
```

### Using Empty State

```tsx
import { EmptyState } from "@/features/filters/restaurants"

{filteredRestaurants.length === 0 && (
  <EmptyState
    type="no-results"
    hasActiveFilters={hasActiveFilters}
    onClearFilters={resetFilters}
  />
)}
```

### Using Load More

```tsx
import { LoadMore } from "@/features/filters/restaurants"

<LoadMore
  hasMore={paginated.length < total.length}
  isLoading={isLoading}
  onLoadMore={loadMore}
  currentPage={page}
  totalPages={Math.ceil(total.length / pageSize)}
/>
```

## Filter Options

```tsx
interface FilterOption {
  value: string
  label: string
  count?: number  // Show result count
}
```

## Filter State

```tsx
interface RestaurantFilters {
  emirate: "all" | "dubai" | "abu-dhabi" | ...
  cuisine: "all" | "italian" | "indian" | ...
  priceRange: "all" | "$" | "$$" | "$$$" | "$$$$"
  minRating: number  // 0-5
  features: {
    familyFriendly: boolean
    outdoorSeating: boolean
    // ... more features
  }
  searchQuery: string
}
```

## Sort Options

```tsx
type SortOption =
  | "relevance"    // Default order
  | "rating"       // Highest rating first
  | "newest"       // Newest first
  | "popularity"   // Most reviews first
  | "price-low"    // Lowest price first
  | "price-high"   // Highest price first
```

## URL State Sync

Filters automatically sync with URL query params:

```
/restaurants?emirate=dubai&cuisine=italian&price=$$$&rating=4&sort=rating&q=pasta
```

- `emirate` - Selected emirate
- `cuisine` - Selected cuisine
- `price` - Price range
- `rating` - Minimum rating
- `sort` - Sort option
- `q` - Search query

## Design Token Compliance

All components use design tokens exclusively:

```tsx
// Colors
className="text-[var(--fg)] bg-[var(--bg)]"
className="border-[var(--color-primary)]"

// Spacing
className="p-[var(--spacing-md)] gap-[var(--spacing-lg)]"

// Typography
className="text-[var(--font-size-lg)] font-semibold"

// Border Radius
className="rounded-[var(--radius-md)] rounded-[var(--radius-full)]"
```

## File Structure

```
restaurants-list-filters/
├── RestaurantsPage.tsx       # Main page component
├── FilterBar.tsx             # Filter bar with all dropdowns
├── FilterDropdown.tsx        # Reusable filter dropdown
├── SortDropdown.tsx          # Sort dropdown
├── EmptyState.tsx            # No results empty state
├── LoadMore.tsx              # Load more pagination
├── useRestaurantFilters.ts   # Filter state hook with URL sync
├── types.ts                  # TypeScript types
├── index.ts                  # Export barrel
└── README.md                 # This file
```

## Component API

### FilterBar

```tsx
<FilterBar
  filters={filters}
  sort={sort}
  onFilterChange={handleFilterChange}
  onSortChange={setSort}
  onClearAll={handleClearAll}
  options={filterOptions}
  resultCount={count}
/>
```

### FilterDropdown

```tsx
<FilterDropdown
  label="Cuisine"
  value={value}
  options={options}
  onChange={setValue}
  multiple={false}
  showCount={true}
  searchable={true}
  disabled={false}
/>
```

### SortDropdown

```tsx
<SortDropdown
  value={sort}
  onChange={setSort}
  options={sortOptions}
/>
```

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation
- Focus indicators
- Screen reader friendly

## Responsive Design

Mobile-first with horizontal scroll on small screens:
- Mobile: Sticky filter bar, horizontal scroll
- Tablet+: Full width, all filters visible

---

*Generated for Shadi V2 - Restaurant Discovery Platform*
*Task #004 - Restaurants List Filter Functionality*
