import {
  useContactFormController,
  type ContactFormProps,
} from "./controllers/useContactFormController";
import { ContactFormDialogView } from "./views/ContactFormDialogView";

/** Thin binding for the add/edit contact dialog widget. */
export function ContactFormDialog(props: ContactFormProps) {
  const vm = useContactFormController(props);
  return <ContactFormDialogView {...vm} />;
}
