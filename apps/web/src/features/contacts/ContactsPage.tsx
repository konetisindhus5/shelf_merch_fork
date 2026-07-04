import { useContactsController } from "./controllers/useContactsController";
import { ContactsView } from "./views/ContactsView";

export function ContactsPage() {
  const vm = useContactsController();
  return <ContactsView {...vm} />;
}
