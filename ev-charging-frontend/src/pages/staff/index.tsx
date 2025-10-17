"use client"

import { Header } from "./components/Header"
import { TabNavigation } from "./components/TabNavigation"
import { IssuesTab } from "./components/tabs/IssuesTab"
import { MonitoringTab } from "./components/tabs/MonitoringTab"
import { PaymentTab } from "./components/tabs/PaymentTab"
import { ReportsTab } from "./components/tabs/ReportsTab"
import { MaintenanceTab } from "./components/tabs/MaintenanceTab"
import { useAuth } from "./hooks/useAuth"
import { useProblems } from "./hooks/useProblems"
import { useTabs } from "./hooks/useTabs"
import { TAB_KEYS } from "./constants/tabs"
import { useStations } from "./hooks/useStations"
import { useEffect } from "react"

const StaffDashboard = () => {
  const { logout } = useAuth()
  const { stations, isLoading: stationsLoading, fetchStations } = useStations()
  const { problems, isLoading: problemsLoading, fetchProblems } = useProblems()
  const { activeTab, setActiveTab } = useTabs()

  useEffect(() => {
    fetchStations()
  }, [])
  const renderTabContent = () => {
    switch (activeTab) {
      case TAB_KEYS.MONITORING:
         return (
        <MonitoringTab
          available={stations.available}
          occupied={stations.occupied}
          reserved={stations.reserved}
          outOfService={stations.outOfService}
        />
      )
      case TAB_KEYS.PAYMENT:
        return <PaymentTab />
      case TAB_KEYS.ISSUES:
        return <IssuesTab problems={problems} isLoading={problemsLoading} onSearch={fetchProblems} />
      case TAB_KEYS.REPORTS:
        return <ReportsTab />
      case TAB_KEYS.MAINTENANCE:
        return <MaintenanceTab />
      default:
        return (
        <MonitoringTab
          available={stations.available}
          occupied={stations.occupied}
          reserved={stations.reserved}
          outOfService={stations.outOfService}
        />
      )
  
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header userName="Trần Thị Bình" userRole="Nhân viên trạm sạc" onLogout={logout} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-full">
        <div className="bg-white text-gray-700 min-h-[500px]">{renderTabContent()}</div>
      </main>
    </div>
  )
}

export default StaffDashboard
