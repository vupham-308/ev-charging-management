"use client"

import { useState } from "react"
import { TAB_KEYS } from "../constants/tabs"

export const useTabs = () => {
  const [activeTab, setActiveTab] = useState(TAB_KEYS.MONITORING)

  return { activeTab, setActiveTab }
}
