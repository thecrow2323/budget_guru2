'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '@/types/finance';
import { useChartTheme } from '@/lib/theme-config';
import { getCategoryExpenses, formatCurrency } from '@/lib/finance-utils';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryChartProps {
  transactions: Transaction[];
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  const chartTheme = useChartTheme();
  const categoryExpenses = getCategoryExpenses(transactions);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="border rounded-lg p-3 shadow-md"
          style={{
            backgroundColor: chartTheme.tooltip.backgroundColor,
            borderColor: chartTheme.tooltip.border,
            color: chartTheme.tooltip.color,
          }}
        >
          <p className="font-medium">{data.category}</p>
          <p style={{ color: chartTheme.colors.primary }}>
            Amount: {formatCurrency(data.amount)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ color: chartTheme.colors.muted }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center md:text-left">
            <PieChartIcon className="h-5 w-5" />
            Category Breakdown
          </CardTitle>
          <CardDescription className="text-center md:text-left">
            See where your money goes by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categoryExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No expense data available. Add some transactions to see your category breakdown.
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {categoryExpenses.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={chartTheme.chartColors[index % chartTheme.chartColors.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}