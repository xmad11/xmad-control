export { SearchContainer } from "./SearchContainer"
export type { ViewMode, SortOptionId } from "./SearchContainer"

// Re-export from new view-mode structure
export { ViewModeButton } from "@/components/view-mode"
export type { ViewModeId } from "@/components/view-mode"

// Re-export filter types from centralized filterData (SSOT)
// LocationOption, CuisineOption, AtmosphereOption, MealOption now come from filterData
export type {
  LocationOption,
  CuisineOption,
  AtmosphereOption,
  MealOption,
} from "@/components/filters/filterData"

// Re-export filter options for backward compatibility
export {
  MEAL_OPTIONS,
  CUISINE_OPTIONS,
  ATMOSPHERE_OPTIONS,
  LOCATION_OPTIONS,
} from "@/components/filters/filterData"
