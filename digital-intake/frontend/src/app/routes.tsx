import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../ui/features/dashboard";
import Application from "../ui/features/applications";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/applications", element: <Application /> },
    ],
  },
]);
