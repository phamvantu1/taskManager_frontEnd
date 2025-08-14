// File: ../components/BaseRadarChart.tsx
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface BaseRadarChartProps {
  data: any;
  options: any;
  width?: number;
  height?: number;
}

const BaseRadarChart: React.FC<BaseRadarChartProps> = ({ data, options, width = 400, height = 400 }) => {
  return <Radar data={data} options={options} width={width} height={height} />;
};

export default BaseRadarChart;