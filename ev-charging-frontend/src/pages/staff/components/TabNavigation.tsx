"use client"

import { TABS } from "../constants/tabs"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tabKey: string) => void
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <nav className="flex justify-center py-4">
      <div className="w-4/5 bg-gray-100 rounded-full flex items-center p-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 py-3 font-semibold transition-all duration-200 text-center ${
              activeTab === tab.key
                ? // Active tab now has full rounded corners (pill shape)
                  "bg-white text-gray-900 rounded-full"
                : "bg-transparent text-gray-700 hover:text-gray-900"
            }`}
          >
            {tab.key}
          </button>
        ))}
      </div>
    </nav>
  )
}
