import { useCatalogProductController } from "./controllers/useCatalogProductController";
import { CatalogProductView } from "./views/CatalogProductView";

export function CatalogProductPage() {
  const vm = useCatalogProductController();
  return <CatalogProductView {...vm} />;
}
