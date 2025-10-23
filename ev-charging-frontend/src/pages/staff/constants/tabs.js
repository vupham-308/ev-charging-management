import {
  DashboardOutlined,
  CreditCardOutlined,
  WarningOutlined,
  BarChartOutlined,
  ToolOutlined,
} from "@ant-design/icons"

export const TABS = [
  { key: "Giám sát", icon: DashboardOutlined },
  { key: "Phiên sạc", icon: CreditCardOutlined },
  { key: "Sự cố", icon: WarningOutlined },
  { key: "Báo cáo", icon: BarChartOutlined },
  { key: "Quản lí trụ sạc", icon: ToolOutlined },
]

export const TAB_KEYS = {
  MONITORING: "Giám sát",
  PAYMENT: "Phiên sạc",
  ISSUES: "Sự cố",
  REPORTS: "Báo cáo",
  MAINTENANCE: "Quản lí trụ sạc",
}
