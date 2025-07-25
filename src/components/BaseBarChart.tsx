// components/BaseBarChart.tsx
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
  width?: number;
  height?: number;
}

const BaseBarChart: React.FC<BaseBarChartProps> = ({
  data,
  options,
  width = 600,
  height = 400,
}) => {
  return (
    <div style={{ width, height }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BaseBarChart;
