/* ═══════════════════════════════════════════════════════════════════════════════
   ICON SYSTEM - Single Source of Truth
   ALL icons must come from this file
   NO direct lucide-react imports in components
   NO heroicons imports
   ═══════════════════════════════════════════════════════════════════════════════ */

// Re-export ALL icons from lucide-react
export * from "lucide-react"

// Convenience re-exports for commonly used icons
// Maps old Heroicons names to Lucide equivalents
export {
  // Navigation & Layout
  Menu as MenuIcon,
  Menu as Bars3Icon,
  Menu as Bars3BottomRightIcon,
  ChevronLeft as ArrowLeftIcon,
  Search as MagnifyingGlassIcon,
  X as XMarkIcon,
  List as ListBulletIcon,
  Globe as LanguageIcon,
  Globe as GlobeAltIcon,
  Grid3X3 as Squares2X2Icon,
  ArrowUpDown as ArrowsUpDownIcon,
  User as UserIcon,
  Users as UserGroupIcon,
  // Actions
  Star as StarIcon,
  Heart as HeartIcon,
  Share as ShareIcon,
  Tag as TagIcon,
  Check as CheckIcon,
  Download as ArrowDownTrayIcon,
  Upload as CloudArrowUpIcon,
  Image as PhotoIcon,
  File as DocumentIcon,
  Smartphone as DevicePhoneMobileIcon,
  LogOut as ArrowRightOnRectangleIcon,
  LogOut as SignOutIcon,
  // Location & Contact
  MapPin as MapPinIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Mail as EnvelopeIcon,
  Mic as MicrophoneIcon,
  // Theme & Settings
  Moon as MoonIcon,
  Sun as SunIcon,
  Settings as Cog6ToothIcon,
  Palette as PaintBrushIcon,
  // Status & Alerts
  Clock as ClockIcon,
  AlertTriangle as ExclamationTriangleIcon,
  AlertCircle as ExclamationCircleIcon,
  Loader2 as ArrowPathIcon,
  // Content
  DollarSign as CurrencyDollarIcon,
  Building2 as BuildingStorefrontIcon,
  FileText as DocumentTextIcon,
  ListOrdered as NumberedListIcon,
  // UI Elements
  MoreHorizontal as EllipsisHorizontalIcon,
  // Heroicons compatibility
  BadgeCheck as CheckBadgeIcon,
  Beaker as BeakerIcon,
  Scale as ScaleIcon,
} from "lucide-react"

// Custom icons (keep existing)
export { SunWarmIcon } from "./SunWarmIcon"
export type { SunWarmIconProps } from "./SunWarmIcon"
export { InstagramIcon } from "./InstagramIcon"
