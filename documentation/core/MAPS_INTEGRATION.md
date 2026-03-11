# MAPS INTEGRATION — SINGLE SOURCE OF TRUTH (SSOT)

## Purpose
Provide map support for:
- Restaurant markers
- "Near Me" filtering
- Distance display (km/m)

No routing, no drawing tools, no geocoding UI unless explicitly approved.

---

## Allowed Features
- Display restaurant locations as markers
- User geolocation ("Near Me")
- Distance calculation (km / meters)
- Dark/light theme using design tokens only

---

## Forbidden
- No hardcoded coordinates in UI components
- No direct mapbox-gl usage in page.tsx or layout.tsx
- No inline styles
- No business logic inside Map UI component
- No Turf advanced geometry features
- No mapbox-draw
- No geocoder UI
- No routing or directions

---

## Architecture (Mandatory)

All map code must live in:

```
lib/maps/
  components/MapboxMap.tsx      # UI only
  hooks/useGeolocation.ts       # browser location
  utils/distance.ts             # Haversine calculation
```

Filtering logic MUST be in:
```
hooks/useRestaurantFilters.ts
```

NOT in UI components.

---

## Environment Variables

Required:
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
```

No hardcoded tokens allowed.

---

## Distance Logic

Distance must be calculated using Haversine formula:

`utils/distance.ts`:
- `calculateDistance()`
- `formatDistance()`

Output examples:
- "450 m"
- "2.3 km"

---

## Data Rules
- Restaurant coordinates must come from backend or API only
- UI must never define lat/lng constants
- Coordinates must be validated before rendering

---

## Performance Rules
- Map component must be dynamically imported (no SSR)
- Marker count must be limited (cluster if >100)

---

## Accessibility
- Map container must have aria-label
- No map-only navigation (must still list restaurants)

---

## Change Control
Any new feature (routing, draw tools, geocoder) requires:
1. Update this file
2. Audit layer approval
3. Documentation review

This file is authoritative.
No other document may override it.
