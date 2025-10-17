"use client"

interface HeaderProps {
  userName: string
  userRole: string
  onLogout: () => void
  onChangePassword?: () => void
}

export const Header = ({ userName, userRole, onLogout, onChangePassword }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-8 py-4">
        {/* Top row: Title and breadcrumb on left, location and actions on right */}
        <div className="flex items-center justify-between">
          {/* Left section: Title and breadcrumb */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-gray-900">Quản lý trạm sạc</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">{userName}</span>
              <span className="text-gray-500">Quản lý</span>
            </div>
          </div>

          {/* Right section: Location and action buttons */}
          <div className="flex items-center gap-8">
            {/* Location info */}
            <div className="text-right">
              <p className="text-xs text-gray-500">Trung tâm thương mại Vincom</p>
              <p className="text-sm font-semibold text-gray-900">123 Nguyễn Huệ, Quận 1</p>
            </div>

            {/* Action buttons */}  
            <div className="flex items-center gap-3 border-l border-gray-200 pl-8">
              <button
                
                onClick={onChangePassword}
                className="flex items-center gap-2 font-medium text-gray-800 border border-gray-300 rounded-lg px-4 py-1 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm6-10V7a3 3 0 00-3-3H9a3 3 0 00-3 3v4h12V7z"
                  />
                </svg>
                <span className="text-sm font-medium">Đổi mật khẩu</span>
              </button>
              <button
                onClick={onLogout}
                className="font-medium text-gray-800 border border-gray-300 rounded-lg px-4 py-1 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
