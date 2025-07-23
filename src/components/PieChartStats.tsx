import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';

interface BarChartStatsProps {
  data: { label: string; value: number }[];
}

const BarChartStats: React.FC<BarChartStatsProps> = ({ data }) => {
  const barColors: Record<string, string> = {
    'Chưa bắt đầu': '#a3a3a3', // gray-400
    'Đang xử lý': '#60a5fa',       // blue-400
    'Hoàn thành': '#fdba74',       // orange-300
    'Quá hạn': '#f87171'           // red-400
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 30, right: 30, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="value"
            label={{ position: 'top', fill: '#000', fontWeight: 'bold' }}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={barColors[entry.label] || '#8884d8'}
              />
            ))}
            <LabelList dataKey="value" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartStats;
