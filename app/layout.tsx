import "../styles/globals.css"
import { ConditionalHeader } from "@/components/layout/ConditionalHeader"
import Providers from "@/components/layout/Providers"
import { SkipLink } from "@/components/layout/SkipLink"
import { NavigationProvider } from "@/components/navigation/NavigationProvider"
import type { Metadata, Viewport } from "next"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: {
    default: "XMAD Control",
    template: "%s | XMAD",
  },
  description: "XMAD Control - Your centralized dashboard for managing projects and deployments.",
  keywords: ["XMAD", "control", "dashboard", "projects", "management"],
  authors: [{ name: "XMAD" }],
  creator: "XMAD",
  publisher: "XMAD",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180" },
      { url: "/apple-touch-icon-167x167.png", sizes: "167x167" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120" },
    ],
  },
  manifest: "/manifest.json",
  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "XMAD Control",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xmad-control.vercel.app",
    title: "XMAD Control",
    description: "XMAD Control - Your centralized dashboard for managing projects and deployments.",
    siteName: "XMAD Control",
  },
  twitter: {
    card: "summary_large_image",
    title: "XMAD Control",
    description: "XMAD Control - Your centralized dashboard for managing projects and deployments.",
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
  metadataBase: new URL("https://xmad-control.vercel.app"),
  alternates: {
    canonical: "https://xmad-control.vercel.app",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // PWA viewport settings
  viewportFit: "cover",
  // Theme color for mobile browsers
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
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

        {/* Service Worker Registration for PWA */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Static script with no user input - PWA registration
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                      .then((registration) => {
                        console.log('[SW] Service Worker registered:', registration.scope);

                        // Listen for updates
                        registration.addEventListener('updatefound', () => {
                          const newWorker = registration.installing;
                          if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                console.log('[SW] New version available');
                                window.dispatchEvent(new CustomEvent('sw-update-available'));
                              }
                            });
                          }
                        });
                      })
                      .catch((error) => {
                        console.error('[SW] Service Worker registration failed:', error);
                      });
                  });
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
