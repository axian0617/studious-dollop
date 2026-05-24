import type { ReactElement } from "react";
import { ToastProvider, getHashPath, navigateTo, useHashPath } from "./components/ui";
import { About } from "./pages/About";
import { BindRole } from "./pages/BindRole";
import { Collect } from "./pages/Collect";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { MessageSettings } from "./pages/MessageSettings";
import { Messages } from "./pages/Messages";
import { Review } from "./pages/Review";
import { Stores } from "./pages/Stores";
import { Transactions } from "./pages/Transactions";
import { Voice } from "./pages/Voice";

export default function App() {
  const path = useHashPath();
  if (path === "/") navigateTo("/login");
  const routes: Record<string, ReactElement> = {
    "/login": <Login />,
    "/dashboard": <Dashboard />,
    "/bind-role": <BindRole />,
    "/stores": <Stores />,
    "/messages": <Messages />,
    "/transactions": <Transactions />,
    "/voice": <Voice />,
    "/message-settings": <MessageSettings />,
    "/collect": <Collect />,
    "/about": <About />,
    "/review": <Review />
  };
  return (
    <ToastProvider>
      {routes[getHashPath()] ?? <Dashboard />}
    </ToastProvider>
  );
}
