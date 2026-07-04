import { usePreDesignedKitsController } from "./controllers/usePreDesignedKitsController";
import { PreDesignedKitsView } from "./views/PreDesignedKits";

/** Thin binding for the pre-designed kits widget. */
export function PreDesignedKits() {
  const vm = usePreDesignedKitsController();
  return <PreDesignedKitsView {...vm} />;
}
