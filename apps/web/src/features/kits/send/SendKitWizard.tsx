import { useSendKitController } from "../controllers/useSendKitController";
import { SendKitView } from "../views/SendKitView";

export function SendKitWizard() {
  const vm = useSendKitController();
  return <SendKitView {...vm} />;
}
