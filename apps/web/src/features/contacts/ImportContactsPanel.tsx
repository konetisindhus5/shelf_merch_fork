import { useImportContactsController } from "./controllers/useImportContactsController";
import { ImportContactsPanelView } from "./views/ImportContactsPanelView";

/** Thin binding for the CSV import panel widget. */
export function ImportContactsPanel({ onDone }: { onDone: () => void }) {
  const vm = useImportContactsController(onDone);
  return <ImportContactsPanelView {...vm} />;
}
