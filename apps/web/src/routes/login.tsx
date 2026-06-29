import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to SwagStore" },
      {
        name: "description",
        content:
          "Corporate swag & gifting on autopilot. Design, manage and deliver branded merchandise your team will love.",
      },
    ],
  }),
  component: LoginPage,
});
