import { Header } from "./components/Header";
import { TabNavigation } from "./components/TabNavigation.";
import { IssuesTab } from "./components/tabs/IssuesTab";
import { MonitoringTab } from "./components/tabs/MonitoringTab.";
import { PaymentTab } from "./components/tabs/PaymentTab.";
import { ReportsTab } from "./components/tabs/ReportsTab.";
import { MaintenanceTab } from "./components/tabs/MaintenanceTab.";
import { useAuth } from "./hooks/useAuth";
import { useTabs } from "./hooks/useTabs";
import { TAB_KEYS } from "./constants/tabs";
import { ChargerPointsProvider } from "./contexts/ChargerPointsContext.jsx";

const StaffDashboard = () => {
  const { logout } = useAuth();
  const { activeTab, setActiveTab } = useTabs();

  const renderTabContent = () => {
    switch (activeTab) {
      case TAB_KEYS.MONITORING:
        return <MonitoringTab />;
      case TAB_KEYS.PAYMENT:
        return <PaymentTab />;
      case TAB_KEYS.ISSUES:
        return <IssuesTab />;
      case TAB_KEYS.REPORTS:
        return <ReportsTab />;
      case TAB_KEYS.MAINTENANCE:
        return <MaintenanceTab />;
      default:
        return <MonitoringTab />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onLogout={logout}
      />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-full">
        <div className="bg-white text-gray-700 min-h-[500px]">
          <ChargerPointsProvider>{renderTabContent()}</ChargerPointsProvider>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
