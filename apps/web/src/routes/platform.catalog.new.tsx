import { createFileRoute } from "@tanstack/react-router";
import { ProductWizard } from "@/components/platform/ProductWizard";

export const Route = createFileRoute("/platform/catalog/new")({
  component: () => <ProductWizard mode="create" />,
});
