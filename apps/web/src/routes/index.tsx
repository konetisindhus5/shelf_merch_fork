import { createFileRoute } from "@tanstack/react-router";
import ShelfMerchApp from "@/components/ShelfMerchApp";

export const Route = createFileRoute("/")({
  component: ShelfMerchApp,
});
