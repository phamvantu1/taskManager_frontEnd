import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';

// Đăng ký các thành phần cần thiết cho Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BaseBarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
}

const BaseBarChart: React.FC<BaseBarChartProps> = ({
  data,
  options,
}) => {
  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BaseBarChart;