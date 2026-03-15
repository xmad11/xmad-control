/**
 * Dashboard Page
 * Main dashboard for XMAD system monitoring and control
 * Uses the pixel-perfect HomeClient component from ein-ui
 */

import { HomeClient } from "@/features/home/HomeClient";

export const metadata = {
  title: "Dashboard | XMAD Control",
};

export default function DashboardPage() {
  return <HomeClient />;
}
