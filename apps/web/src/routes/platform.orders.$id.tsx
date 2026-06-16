import { createFileRoute, useParams } from "@tanstack/react-router";
import { OrderFulfillmentPage } from "@/components/platform/PlatformPages";

function OrderDetail() {
  const { id } = useParams({ from: "/platform/orders/$id" });
  return <OrderFulfillmentPage orderId={id} />;
}

export const Route = createFileRoute("/platform/orders/$id")({
  component: OrderDetail,
});
