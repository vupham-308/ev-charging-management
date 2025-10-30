"use client"

import React from "react"
import { TABS } from "../constants/tabs"

export const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex justify-center py-2 bg-gray-50">
      <div className="w-4/5 bg-gray-100 rounded-full flex items-center p-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 py-1 font-semibold transition-all duration-200 text-center ${
              activeTab === tab.key
                ? "bg-white text-gray-900 rounded-full"
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
