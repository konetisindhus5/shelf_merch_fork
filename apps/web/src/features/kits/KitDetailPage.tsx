import { useKitDetailController } from "./controllers/useKitDetailController";
import { KitDetailView } from "./views/KitDetailView";

export function KitDetailPage() {
  const vm = useKitDetailController();
  return <KitDetailView {...vm} />;
}
