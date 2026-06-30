import { createFileRoute } from "@tanstack/react-router";
import { CatalogProductPage } from "@/features/catalog/CatalogProductPage";

export const Route = createFileRoute("/app/catalog/$id")({
  component: CatalogProductPage,
});
