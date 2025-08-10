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
  Cell,
} from 'recharts';

interface BarChartStatsProps {
  data: { label: string; value: number }[];
}

const BarChartStats: React.FC<BarChartStatsProps> = ({ data }) => {
  const barColors: Record<string, string> = {
    'Chưa bắt đầu': '#2196F3', // gray-400
    'Đang xử lý': '#FFEB3B', // blue-400
    'Hoàn thành': '#4CAF50', 
    'Quá hạn': '#F44336', // red-400
    'Chờ hoàn thành': '#9C27B0', // purple-400
  };



  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 animate-fade-in">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 40, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fill: '#4b5563', fontSize: 12 }} />
          <YAxis tick={{ fill: '#4b5563', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar
            dataKey="value"
            label={{ position: 'top', fill: '#1f2937', fontWeight: 'bold', fontSize: 12 }}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={barColors[entry.label] || '#8884d8'}
              />
            ))}
            <LabelList dataKey="value" position="top" fill="#1f2937" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartStats;