import { createFileRoute, useParams } from "@tanstack/react-router";
import { KitWizard } from "@/components/platform/KitWizard";

function EditKit() {
  const { id } = useParams({ from: "/platform/kits/$id" });
  return <KitWizard mode="edit" kitId={id} />;
}

export const Route = createFileRoute("/platform/kits/$id")({
  component: EditKit,
});
