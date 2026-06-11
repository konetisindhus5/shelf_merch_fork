import { createFileRoute } from "@tanstack/react-router";
import RedemptionPortal from "@/components/RedemptionPortal";

export const Route = createFileRoute("/redeem/$token")({
  component: RedeemPage,
});

function RedeemPage() {
  const { token } = Route.useParams();
  return <RedemptionPortal token={token} />;
}
