import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "@/features/auth/SignupPage";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your SwagStore account" },
      {
        name: "description",
        content: "Set up your SwagStore workspace in minutes. Corporate swag & gifting on autopilot.",
      },
    ],
  }),
  component: SignupPage,
});
