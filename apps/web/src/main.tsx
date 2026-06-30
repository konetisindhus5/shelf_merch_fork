import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

// React 19 StrictMode double-mounts effects in dev; the app uses imperative portals
// and document-level listeners in a few places, so we mount without StrictMode.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
