import { useKitWizardController } from "../controllers/useKitWizardController";
import { KitWizardView } from "../views/KitWizardView";

export function KitWizard() {
  const vm = useKitWizardController();
  return <KitWizardView {...vm} />;
}
