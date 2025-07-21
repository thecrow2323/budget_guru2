'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types/finance';
import { useTheme } from 'next-themes';
import { useChartTheme } from '@/lib/theme-config';
import { getMonthlyExpenses, formatCurrency } from '@/lib/finance-utils';
import { BarChart3 } from 'lucide-react';

interface ExpenseChartProps {
  transactions: Transaction[];
}

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const chartTheme = useChartTheme();
  const monthlyExpenses = getMonthlyExpenses(transactions);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="border rounded-lg p-3 shadow-md"
          style={{
            backgroundColor: chartTheme.tooltip.backgroundColor,
            borderColor: chartTheme.tooltip.border,
            color: chartTheme.tooltip.color,
          }}
        >
          <p className="font-medium">{label}</p>
          <p style={{ color: chartTheme.colors.error }}>
            Expenses: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center md:text-left">
            <BarChart3 className="h-5 w-5" />
            Monthly Expenses
          </CardTitle>
          <CardDescription className="text-center md:text-left">
            Track your spending patterns over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No expense data available. Add some transactions to see your spending chart.
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyExpenses}>
                  <CartesianGrid 
                    stroke={chartTheme.grid.stroke}
                    strokeDasharray={chartTheme.grid.strokeDasharray}
                  />
                  <XAxis 
                    dataKey="month" 
                    className="text-sm"
                    tick={{ fontSize: 12 }}
                    stroke={chartTheme.colors.muted}
                  />
                  <YAxis 
                    className="text-sm"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                    stroke={chartTheme.colors.muted}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill={chartTheme.colors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}