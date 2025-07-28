import React from 'react';

const ProgressChart = () => {
  // Dữ liệu mẫu cho tiến độ công việc
  const progressData = [
    { name: 'Nguyễn Văn A', progress: 85, color: 'bg-blue-500' },
    { name: 'Trần Thị B', progress: 72, color: 'bg-green-500' },
    { name: 'Lê Văn C', progress: 95, color: 'bg-purple-500' },
    { name: 'Phạm Thị D', progress: 63, color: 'bg-orange-500' },
    { name: 'Hoàng Văn E', progress: 88, color: 'bg-indigo-500' },
    { name: 'Đỗ Thị F', progress: 91, color: 'bg-pink-500' }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Biểu đồ tiến độ công việc
      </h2>
      
      <div className="space-y-4">
        {progressData.map((person, index) => (
          <div key={index} className="flex items-center space-x-4">
            {/* Tên người */}
            <div className="w-32 text-right">
              <span className="text-sm font-medium text-gray-700">
                {person.name}
              </span>
            </div>
            
            {/* Thanh tiến độ */}
            <div className="flex-1 relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${person.color} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${person.progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
              </div>
              
              {/* Hiển thị phần trăm */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-white drop-shadow-sm">
                  {person.progress}%
                </span>
              </div>
            </div>
            
            {/* Trạng thái */}
            <div className="w-20">
              <span className={`text-xs px-2 py-1 rounded-full ${
                person.progress >= 90 
                  ? 'bg-green-100 text-green-800' 
                  : person.progress >= 70 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {person.progress >= 90 ? 'Hoàn thành' : person.progress >= 70 ? 'Tốt' : 'Cần cải thiện'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Thông tin tổng quan */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin tổng quan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(progressData.reduce((sum, person) => sum + person.progress, 0) / progressData.length)}%
            </div>
            <div className="text-sm text-gray-600">Tiến độ trung bình</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {progressData.filter(person => person.progress >= 90).length}
            </div>
            <div className="text-sm text-gray-600">Hoàn thành xuất sắc</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {progressData.filter(person => person.progress < 70).length}
            </div>
            <div className="text-sm text-gray-600">Cần hỗ trợ</div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>≥ 90% - Hoàn thành</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>70-89% - Tốt</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>&lt; 70% - Cần cải thiện</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;