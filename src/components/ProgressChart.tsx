import React, { useState } from 'react';

const ProgressChart = () => {
  // Dữ liệu fake cho tiến độ công việc (sẽ thay thế bằng API call)
  const allProgressData = [
    { name: 'Nguyễn Văn A', progress: 85, color: 'bg-blue-500' },
    { name: 'Trần Thị B', progress: 72, color: 'bg-green-500' },
    { name: 'Lê Văn C', progress: 95, color: 'bg-purple-500' },
    { name: 'Phạm Thị D', progress: 63, color: 'bg-orange-500' },
    { name: 'Hoàng Văn E', progress: 88, color: 'bg-indigo-500' },
    { name: 'Đỗ Thị F', progress: 91, color: 'bg-pink-500' },
    { name: 'Vũ Văn G', progress: 77, color: 'bg-red-500' },
    { name: 'Bùi Thị H', progress: 82, color: 'bg-cyan-500' },
    { name: 'Đinh Văn I', progress: 94, color: 'bg-teal-500' },
    { name: 'Mai Thị K', progress: 68, color: 'bg-lime-500' },
    { name: 'Lý Văn L', progress: 89, color: 'bg-amber-500' },
    { name: 'Chu Thị M', progress: 76, color: 'bg-emerald-500' },
    { name: 'Dương Văn N', progress: 92, color: 'bg-violet-500' },
    { name: 'Từ Thị O', progress: 81, color: 'bg-rose-500' },
    { name: 'Lâm Văn P', progress: 74, color: 'bg-sky-500' }
  ];

  // Dữ liệu thông tin tổng quan (sẽ thay thế bằng API call)
  const summaryData = {
    averageProgress: 82,
    excellentCount: 6,
    needSupportCount: 3
  };

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Tính toán dữ liệu cho trang hiện tại
  const totalPages = Math.ceil(allProgressData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = allProgressData.slice(startIndex, endIndex);

  // Hàm chuyển trang
  const goToPage = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Biểu đồ tiến độ công việc
      </h2>
      
      {/* Thông tin tổng quan */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin tổng quan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {summaryData.averageProgress}%
            </div>
            <div className="text-sm text-gray-600">Tiến độ trung bình</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {summaryData.excellentCount}
            </div>
            <div className="text-sm text-gray-600">Hoàn thành xuất sắc</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {summaryData.needSupportCount}
            </div>
            <div className="text-sm text-gray-600">Cần hỗ trợ</div>
          </div>
        </div>
      </div>

      {/* Danh sách tiến độ công việc */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Danh sách tiến độ</h3>
          <div className="text-sm text-gray-600">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, allProgressData.length)} trong tổng số {allProgressData.length} nhân viên
          </div>
        </div>
        
        <div className="space-y-4">
          {currentPageData.map((person, index) => (
            <div key={startIndex + index} className="flex items-center space-x-4">
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
              <div className="w-24">
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
      </div>

      {/* Phân trang */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Trước
          </button>
          
          {/* Hiển thị số trang */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Sau
          </button>
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