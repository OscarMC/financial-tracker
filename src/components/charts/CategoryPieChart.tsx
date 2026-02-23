import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CategorySummary } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryPieChartProps {
  data: CategorySummary[];
  title: string;
  type: 'expense' | 'income';
}

const expenseColors = [
  '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337',
  '#fb7185', '#fda4af', '#fecdd3', '#ffe4e6', '#fff1f2',
  '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12',
];

const incomeColors = [
  '#10b981', '#059669', '#047857', '#065f46', '#064e3b',
  '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5',
  '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
];

export function CategoryPieChart({ data, title, type }: CategoryPieChartProps) {
  const colors = type === 'expense' ? expenseColors : incomeColors;
  
  // Filter out small categories for better visualization
  const significantData = data.filter(item => item.porcentaje > 2);
  
  // Group small categories
  const otherTotal = data
    .filter(item => item.porcentaje <= 2)
    .reduce((sum, item) => sum + item.total, 0);
  
  const chartData = [...significantData];
  if (otherTotal > 0) {
    chartData.push({
      categoria: 'Otros',
      total: otherTotal,
      porcentaje: data.reduce((sum, item) => 
        item.porcentaje <= 2 ? sum + item.porcentaje : sum, 0
      ),
      mediaMensual: 0,
    });
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategorySummary; color: string }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.categoria}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.total)}
          </p>
          <p className="text-sm font-medium" style={{ color: payload[0].color }}>
            {data.porcentaje.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="total"
              nameKey="categoria"
            >
              {chartData.map((_entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value: string) => (
                <span className="text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
