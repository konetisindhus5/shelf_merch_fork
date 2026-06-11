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

// No StrictMode: the shelf-merch engine mounts imperatively (document-level
// listeners + innerHTML) and is not safe to double-invoke in dev.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
