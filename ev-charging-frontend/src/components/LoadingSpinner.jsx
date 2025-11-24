import React from 'react';

const LoadingSpinner = ({ message = "Đang tải..." }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-gray-400 text-sm mt-2">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;