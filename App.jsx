import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import { AppProvider } from "./context/AppContext";
import "./index.css";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "transactions": return <Transactions />;
      case "insights": return <Insights />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="app-shell">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </AppProvider>
  );
}
