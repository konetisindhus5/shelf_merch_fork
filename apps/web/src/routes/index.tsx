import { createFileRoute, redirect } from "@tanstack/react-router";
import LandingPage from "@/components/LandingPage";
import { getStoredUser, isAuthenticated, isPlatformUser } from "@/services/api-bridge";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!isAuthenticated()) return;
    if (isPlatformUser(getStoredUser())) throw redirect({ to: "/platform/dashboard" });
    throw redirect({ to: "/app/orders" });
  },
  component: LandingPage,
});