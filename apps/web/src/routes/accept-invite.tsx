import { createFileRoute } from "@tanstack/react-router";
import AcceptInvite from "@/components/AcceptInvite";

export const Route = createFileRoute("/accept-invite")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: AcceptInvitePage,
});

function AcceptInvitePage() {
  const { token } = Route.useSearch();
  return <AcceptInvite token={token} />;
}
