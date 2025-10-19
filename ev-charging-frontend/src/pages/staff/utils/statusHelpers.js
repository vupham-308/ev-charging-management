import { STATUS_COLORS, STATUS_BG_COLORS, STATUS_KEYWORDS } from "../constants/status"

export const getStatusColor = (status) => {
  const statusLower = (status || "").toLowerCase()

  if (STATUS_KEYWORDS.solved.some((keyword) => statusLower.includes(keyword))) return "success"
  if (STATUS_KEYWORDS.inProgress.some((keyword) => statusLower.includes(keyword))) return "processing"
  if (STATUS_KEYWORDS.pending.some((keyword) => statusLower.includes(keyword))) return "warning"
  if (STATUS_KEYWORDS.urgent.some((keyword) => statusLower.includes(keyword))) return "error"

  return "default"
}

export const getStatusBorderColor = (status) => {
  const colorType = getStatusColor(status)
  return STATUS_COLORS[colorType] || STATUS_COLORS.default
}

export const getStatusBgColor = (status) => {
  const colorType = getStatusColor(status)
  return STATUS_BG_COLORS[colorType] || STATUS_BG_COLORS.default
}
