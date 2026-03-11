import "../styles/globals.css"
import { ConditionalHeader } from "@/components/layout/ConditionalHeader"
import Providers from "@/components/layout/Providers"
import { SkipLink } from "@/components/layout/SkipLink"
import { NavigationProvider } from "@/components/navigation/NavigationProvider"
import type { Metadata, Viewport } from "next"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: {
    default: "Shadi Shawqi | UAE Restaurant Reviews & Recommendations",
    template: "%s | Shadi Shawqi",
  },
  description:
    "Discover the UAE's best restaurants, cafes, and dining experiences through the eyes of Shadi Shawqi (@the.ss). Every restaurant personally visited, photographed, and honestly reviewed. Explore curated recommendations, in-depth reviews, and exclusive foodie insights.",
  keywords: [
    "UAE restaurants",
    "Dubai food blogger",
    "Abu Dhabi dining",
    "restaurant reviews UAE",
    "Shadi Shawqi",
    "the.ss",
    "food blogger UAE",
    "cafe recommendations",
    "best restaurants Dubai",
    "dining guide UAE",
    "halal restaurants",
    "food reviews",
    "restaurant ratings",
    "UAE food scene",
  ],
  authors: [{ name: "Shadi Shawqi", url: "https://instagram.com/the.ss" }],
  creator: "Shadi Shawqi",
  publisher: "Shadi Shawqi",
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180" },
      { url: "/apple-touch-icon-167x167.png", sizes: "167x167" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shadi Shawqi",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shadi-v2.vercel.app",
    title: "Shadi Shawqi | UAE Restaurant Reviews & Recommendations",
    description:
      "Discover the UAE's best restaurants, cafes, and dining experiences through the eyes of Shadi Shawqi (@the.ss). Every restaurant personally visited, photographed, and honestly reviewed.",
    siteName: "Shadi Shawqi | UAE Food Reviews",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shadi Shawqi - UAE Restaurant Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadi Shawqi | UAE Restaurant Reviews & Recommendations",
    description:
      "Discover the UAE's best restaurants, cafes, and dining experiences through the eyes of Shadi Shawqi (@the.ss). Every restaurant personally visited and honestly reviewed.",
    creator: "@the.ss",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://shadi-v2.vercel.app"),
  alternates: {
    canonical: "https://shadi-v2.vercel.app",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Theme script must run immediately to prevent FOUC - next-themes pattern */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Static script with no user input - prevents FOUC
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const mode = localStorage.getItem('themeMode') || 'light';
                  const accentColor = localStorage.getItem('themeAccentColor') || 'amber';

                  // Set theme mode
                  document.documentElement.dataset.theme = mode;
                  if (mode === 'dark') {
                    document.documentElement.classList.add('dark');
                  }

                  // Set accent color
                  const accentColors = {
                    shadi: 'oklch(0.60 0.19 40.0)',
                    honey: 'oklch(0.7 0.12 85.0)',
                    amber: 'oklch(0.72 0.16 70.0)',
                    rose: 'oklch(0.65 0.16 350.0)',
                    berry: 'oklch(0.52 0.18 350.0)',
                    lavender: 'oklch(0.68 0.10 280.0)',
                    indigo: 'oklch(0.45 0.18 270.0)',
                    emerald: 'oklch(0.58 0.18 160.0)',
                    azure: 'oklch(0.6 0.14 250.0)',
                    lime: 'oklch(0.75 0.15 120.0)',
                  };

                  const color = accentColors[accentColor] || accentColors.amber;
                  document.documentElement.style.setProperty('--color-brand-primary', color);
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
        <SkipLink />

        {/* Global Providers (Theme, Language) */}
        <Providers>
          {/* Navigation Provider (UI-only state) */}
          <NavigationProvider>
            {/* Header - conditionally rendered based on route */}
            <ConditionalHeader />

            {/* Page content */}
            <main id="main-content" className="w-full pt-[var(--header-total-height)]">
              {children}
            </main>
          </NavigationProvider>
        </Providers>

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              background: "var(--bg)",
              color: "var(--fg)",
              border: "1px solid var(--fg-20)",
              borderRadius: "var(--radius-xl)",
            },
          }}
        />
      </body>
    </html>
  )
}
