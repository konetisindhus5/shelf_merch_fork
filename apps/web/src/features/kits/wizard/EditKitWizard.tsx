import { useEditKitController } from "../controllers/useEditKitController";
import { EditKitView } from "../views/EditKitView";

export function EditKitWizard() {
  const vm = useEditKitController();
  return <EditKitView {...vm} />;
}
