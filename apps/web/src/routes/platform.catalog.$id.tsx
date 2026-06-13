import { createFileRoute, useParams } from "@tanstack/react-router";
import { ProductWizard } from "@/components/platform/ProductWizard";

function EditProduct() {
  const { id } = useParams({ from: "/platform/catalog/$id" });
  return <ProductWizard mode="edit" productId={id} />;
}

export const Route = createFileRoute("/platform/catalog/$id")({
  component: EditProduct,
});
