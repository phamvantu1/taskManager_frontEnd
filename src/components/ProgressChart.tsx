

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getDashboardUsers, getDashboardUserTaskOverview, type PagedUserProgress, type UserTaskOverview } from '../api/dashboardApi';

interface ProgressChartProps {
  departmentId: string | null;
  progressDateRange: { start: string; end: string };
}

const ProgressChart = forwardRef<{ fetchData: (page: number) => void }, ProgressChartProps>(
  ({ departmentId, progressDateRange }, ref) => {
    const [progressData, setProgressData] = useState<PagedUserProgress | null>(null);
    const [summaryData, setSummaryData] = useState<UserTaskOverview | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 10;

    const fetchProgressData = async (page: number = currentPage) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token') || '';
        if (!token) {
          throw new Error('No access token found');
        }

        const [usersResponse, overviewResponse] = await Promise.all([
          getDashboardUsers(
            departmentId,
            progressDateRange.start || null,
            progressDateRange.end || null,
            page - 1,
            itemsPerPage,
            token
          ),
          getDashboardUserTaskOverview(
            departmentId,
            progressDateRange.start || null,
            progressDateRange.end || null,
            token
          ),
        ]);

        setProgressData(usersResponse);
        setSummaryData(overviewResponse);
      } catch (err) {
        setError('Failed to fetch progress data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data on mount and when departmentId, progressDateRange, or currentPage changes
    useEffect(() => {
      fetchProgressData();
    }, [departmentId, progressDateRange.start, progressDateRange.end, currentPage]);

    // Expose fetchData to parent via ref
    useImperativeHandle(ref, () => ({
      fetchData: (page: number) => fetchProgressData(page),
    }));

    const goToPage = (page: number) => {
      setCurrentPage(page);
    };

    const goToPreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    const goToNextPage = () => {
      if (progressData && currentPage < progressData.totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    // Colors for progress bars (cycling through a predefined list)
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-cyan-500',
      'bg-teal-500',
      'bg-lime-500',
      'bg-amber-500',
      'bg-emerald-500',
      'bg-violet-500',
      'bg-rose-500',
      'bg-sky-500',
    ];

    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Biểu đồ tiến độ công việc
        </h2>

        {/* Removed Search Button - now handled by Dashboard */}

        {/* Thông tin tổng quan */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center w-full">Thông tin tổng quan</h3>
          {loading ? (
            <p>Loading summary...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : summaryData ? (
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
          ) : (
            <p>Chưa có dữ liệu tổng quan.</p>
          )}
        </div>

        {/* Danh sách tiến độ công việc */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 text-center w-full">Danh sách tiến độ</h3>

          </div>

          {loading ? (
            <p>Loading progress data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : progressData && progressData.content.length > 0 ? (
            <div className="space-y-4">
              {progressData.content.map((person, index) => (
                <div key={index} className="flex items-center space-x-4">
                  {/* Tên người */}
                  <div className="w-32 text-right">
                    <span className="text-sm font-medium text-gray-700">
                      {person.fullName}
                    </span>
                  </div>

                  {/* Thanh tiến độ */}
                  <div className="flex-1 relative h-8 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[index % colors.length]} transition-all duration-1000 ease-out rounded-full`}
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
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        person.progress >= 90
                          ? 'bg-green-100 text-green-800'
                          : person.progress >= 70
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {person.progress >= 90 ? 'Hoàn thành' : person.progress >= 70 ? 'Tốt' : 'Cần cải thiện'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Chưa có dữ liệu tiến độ.</p>
          )}
        </div>

        {/* Phân trang */}
        {progressData && progressData.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
             
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

              {Array.from({ length: progressData.totalPages }, (_, i) => i + 1).map((page) => (
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
                disabled={currentPage === progressData.totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === progressData.totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Sau
              </button>
            </div>
          </div>
        )}

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
  }
);

export default ProgressChart;