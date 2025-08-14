// File: ../components/BasePieChart.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BasePieChartProps {
  data: any;
  options: any;
  width?: number;
  height?: number;
}

const BasePieChart: React.FC<BasePieChartProps> = ({ data, options, width = 300, height = 300 }) => {
  return <Pie data={data} options={options} width={width} height={height} />;
};

export default BasePieChart;