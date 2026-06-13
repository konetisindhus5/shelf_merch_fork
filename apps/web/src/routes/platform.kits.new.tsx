import { createFileRoute } from "@tanstack/react-router";
import { KitWizard } from "@/components/platform/KitWizard";

export const Route = createFileRoute("/platform/kits/new")({
  component: () => <KitWizard mode="create" />,
});
