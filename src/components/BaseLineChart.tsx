import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BaseLineChartProps {
  data: any;
  options: any;
  width?: number;
  height?: number;
}

const BaseLineChart: React.FC<BaseLineChartProps> = ({ data, options, width = 400, height = 300 }) => {
  return <Line data={data} options={options} width={width} height={height} />;
};

export default BaseLineChart;