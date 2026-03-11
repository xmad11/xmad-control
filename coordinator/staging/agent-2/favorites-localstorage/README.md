# Favorites with localStorage Integration

Complete favorites system with localStorage persistence, tabbed navigation, sort options, and empty states.

## Features

- **localStorage Persistence** - Favorites persist across sessions
- **Cross-Tab Sync** - Changes sync across browser tabs
- **Heart Icon Toggle** - Add/remove favorites with one click
- **Tabbed Navigation** - Separate Restaurants and Blogs tabs
- **Sort Options** - Sort by recent, name, or rating
- **Remove All Button** - Clear all favorites with confirmation
- **Empty States** - Friendly messages when no favorites
- **100% Design Token Compliant** - No hardcoded values

## Installation

Copy all files from this staging folder to your project:

```bash
cp -r /coordinator/staging/agent-2/favorites-localstorage/* /app/favorites/
```

## Usage

### Using the Hook

```tsx
import { useFavorites } from "@/features/favorites"

function MyComponent() {
  const {
    favorites,           // Current favorites state
    allFavorites,        // All favorites combined
    isFavorite,          // Check if item is favorited
    addFavorite,         // Add to favorites
    removeFavorite,      // Remove from favorites
    toggleFavorite,      // Toggle favorite status
    clearAll,            // Clear all favorites
    getFavoritesByType,  // Get favorites by type
    getCount,            // Get favorite count
    sortFavorites,       // Sort favorites
  } = useFavorites()

  // Check if a restaurant is favorited
  const isFav = isFavorite("restaurant-123", "restaurant")

  // Toggle favorite
  const handleToggle = () => {
    toggleFavorite({
      id: "fav-123",
      type: "restaurant",
      restaurantId: "restaurant-123",
      name: "Al Fanar",
      slug: "al-fanar",
      image: "/images/al-fanar.jpg",
      cuisine: ["Emirati", "Arabic"],
      location: { area: "Festival City", city: "Dubai" },
      rating: 4.5,
      priceRange: "$$$",
    })
  }
}
```

### Using the Favorite Button

```tsx
import { FavoriteButton } from "@/features/favorites"

<FavoriteButton
  isFavorite={isFavorite}
  onToggle={handleToggle}
  size="md"
  iconOnly
/>
```

### Using Empty State

```tsx
import { FavoritesEmptyState } from "@/features/favorites"

<FavoritesEmptyState
  type="restaurants"
  cta={{
    label: "Explore Restaurants",
    href: "/restaurants",
  }}
/>
```

### Using Sort Dropdown

```tsx
import { FavoritesSortDropdown } from "@/features/favorites"

<FavoritesSortDropdown
  value={sortOption}
  onChange={setSortOption}
/>
```

## Data Types

### Restaurant Favorite

```tsx
interface RestaurantFavorite {
  id: string
  type: "restaurant"
  restaurantId: string
  name: string
  slug: string
  image: string
  cuisine: string[]
  location: {
    area: string
    city: string
  }
  rating: number
  priceRange: string
  favoritedAt: Date
}
```

### Blog Favorite

```tsx
interface BlogFavorite {
  id: string
  type: "blog"
  blogId: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  publishedAt: Date
  author: string
  category: string
  favoritedAt: Date
}
```

## localStorage Structure

Favorites are stored in localStorage with this structure:

```json
{
  "version": 1,
  "restaurants": [...],
  "blogs": [...],
  "updatedAt": "2026-01-03T12:00:00.000Z"
}
```

**Storage Key:** `shadi_favorites`

## Sort Options

- `recent` - Sort by favorited date (newest first)
- `name` - Sort alphabetically
- `rating` - Sort by rating (highest first)

## Design Token Compliance

All components use design tokens exclusively:

```tsx
// Colors
className="text-[var(--fg)] bg-[var(--bg)]"
className="text-[var(--color-favorite)]"

// Spacing
className="p-[var(--spacing-md)] gap-[var(--spacing-lg)]"

// Typography
className="text-[var(--font-size-lg)] font-semibold"

// Border Radius
className="rounded-[var(--radius-full)] rounded-[var(--radius-md)]"
```

## File Structure

```
favorites-localstorage/
├── FavoritesPage.tsx       # Main page component
├── FavoriteButton.tsx      # Heart icon toggle
├── FavoritesSortDropdown.tsx  # Sort dropdown
├── FavoritesEmptyState.tsx # Empty state component
├── useFavorites.ts         # Hook with localStorage
├── types.ts                # TypeScript types
├── index.ts                # Export barrel
└── README.md               # This file
```

## Component API

### FavoriteButton

```tsx
<FavoriteButton
  isFavorite={boolean}
  onToggle={() => void}
  size="sm" | "md" | "lg"
  iconOnly={false}
  disabled={false}
  label="Save"
/>
```

### FavoritesSortDropdown

```tsx
<FavoritesSortDropdown
  value="recent" | "name" | "rating"
  onChange={(option) => setSortOption(option)}
  options={customOptions}
/>
```

### FavoritesEmptyState

```tsx
<FavoritesEmptyState
  type="all" | "restaurants" | "blogs"
  cta={{ label: "Explore", href: "/restaurants" }}
  message="Custom message"
  subtitle="Custom subtitle"
/>
```

## Integration Example

Add favorite button to RestaurantCard:

```tsx
import { FavoriteButton } from "@/features/favorites"
import { useFavorites } from "@/features/favorites"

function RestaurantCard({ restaurant }) {
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <div className="relative">
      {/* Card content */}

      {/* Favorite Button */}
      <div className="absolute top-2 right-2">
        <FavoriteButton
          isFavorite={isFavorite(restaurant.id, "restaurant")}
          onToggle={() => toggleFavorite({
            id: `fav-${restaurant.id}`,
            type: "restaurant",
            restaurantId: restaurant.id,
            ...restaurant
          })}
          size="md"
          iconOnly
        />
      </div>
    </div>
  )
}
```

## Cross-Tab Synchronization

The hook automatically syncs favorites across browser tabs using the storage event. When a user adds/removes a favorite in one tab, all other tabs update automatically.

## Version Control

The localStorage data includes a version number. If the version changes, old data is automatically cleared to prevent conflicts.

## Accessibility

- Semantic HTML elements
- ARIA labels and pressed states
- Keyboard navigation
- Focus indicators
- Screen reader friendly

---

*Generated for Shadi V2 - Restaurant Discovery Platform*
*Task #006 - Favorites localStorage Integration*
