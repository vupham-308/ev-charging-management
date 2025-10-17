"use client"

import {
  ThunderboltOutlined,
  ClockCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons"
import { FaHeartbeat } from "react-icons/fa"
import React from "react"

interface MonitoringTabProps {
  available: number
  occupied: number
  reserved: number
  outOfService: number
}

export const MonitoringTab = ({
  available,
  occupied,
  reserved,
  outOfService,
}: MonitoringTabProps) => {
  const stats = [
    {
      label: "Có sẵn",
      value: available,
      // icon component only (we'll control size via wrapper)
      icon: <FaHeartbeat />,
      colorClass: "text-green-500",
      bg: "bg-green-50 hover:bg-green-100",
    },
    {
      label: "Đang sử dụng",
      value: occupied,
      icon: <ThunderboltOutlined />,
      colorClass: "text-yellow-500",
      bg: "bg-yellow-50 hover:bg-yellow-100",
    },
    {
      label: "Đã đặt chỗ",
      value: reserved,
      icon: <ClockCircleOutlined />,
      colorClass: "text-blue-500",
      bg: "bg-blue-50 hover:bg-blue-100",
    },
    {
      label: "Bảo trì",
      value: outOfService,
      icon: <ToolOutlined />,
      colorClass: "text-red-500",
      bg: "bg-red-50 hover:bg-red-100",
    },
  ]

  return (
    <div className="px-12 py-8 bg-gray-50 min-h-[70vh]">
      {/* dùng cùng w-4/5 như thanh tab để tổng chiều dài 4 card khớp với thanh tab */}
      <div className="w-4/5 mx-auto">
        <div className="grid grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-sm ${item.bg} transition-all duration-200 text-center p-8 hover:shadow-md`}
            >
              {/* Khung vuông cố định cho icon để tránh méo */}
              <div className={`w-14 h-14 mx-auto flex items-center justify-center mb-4 ${item.colorClass}`}>
                {/* - Với react-icons: size prop works; with ant icons we style via fontSize */}
                {React.isValidElement(item.icon) &&
                  // if it's an Ant icon (has props), we set style; otherwise try size prop
                  React.cloneElement(item.icon as React.ReactElement, {
                    style: { fontSize: 28, lineHeight: 0 },
                    ...(item.icon.type && (item.icon.type as any).render ? {} : {}),
                  })}
              </div>

              <h2 className="text-3xl font-semibold text-gray-900">{item.value}</h2>
              <p className="text-gray-600 text-lg mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
