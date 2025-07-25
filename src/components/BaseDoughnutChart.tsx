// components/BaseDoughnutChart.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(ArcElement, Tooltip, Legend);

// Props của component
interface BaseDoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  width?: number;
  height?: number;
}

const BaseDoughnutChart: React.FC<BaseDoughnutChartProps> = ({
  data,
  options,
  width = 400,
  height = 400
}) => {
  return (
    <div style={{ width, height }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default BaseDoughnutChart;
