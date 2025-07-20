'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Budget } from '@/types/finance';
import { formatCurrency } from '@/lib/finance-utils';
import { Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface BudgetOverviewProps {
  budgets: Budget[];
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  if (budgets.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center md:text-left">
              <Target className="h-5 w-5" />
              Budget Overview
            </CardTitle>
            <CardDescription className="text-center md:text-left">
              Set up budgets to track your spending goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No budgets set up yet. Click "Setup Budget" to get started.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getBudgetStatus = (percentage: number) => {
    if (percentage >= 100) return { color: 'destructive', icon: AlertTriangle, text: 'Over Budget' };
    if (percentage >= 80) return { color: 'warning', icon: Clock, text: 'Near Limit' };
    return { color: 'success', icon: CheckCircle, text: 'On Track' };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center md:text-left">
            <Target className="h-5 w-5" />
            Budget Overview
          </CardTitle>
          <CardDescription className="text-center md:text-left">
            Track your spending against your monthly budgets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Budget Summary */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Overall Budget</h3>
              <Badge variant={overallPercentage >= 100 ? 'destructive' : overallPercentage >= 80 ? 'secondary' : 'default'}>
                {overallPercentage.toFixed(0)}%
              </Badge>
            </div>
            <Progress value={Math.min(100, overallPercentage)} className="mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Spent: {formatCurrency(totalSpent)}</span>
              <span>Budget: {formatCurrency(totalBudget)}</span>
            </div>
          </div>

          {/* Individual Budget Items */}
          <div className="space-y-4">
            {budgets.map((budget) => {
              const status = getBudgetStatus(budget.percentage);
              const StatusIcon = status.icon;
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{budget.category}</h4>
                      <Badge 
                        variant={status.color === 'destructive' ? 'destructive' : 
                                status.color === 'warning' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.text}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-center sm:text-right">
                      {budget.percentage.toFixed(0)}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.min(100, budget.percentage)} 
                    className={`h-2 ${
                      budget.percentage >= 100 ? '[&>div]:bg-destructive' :
                      budget.percentage >= 80 ? '[&>div]:bg-yellow-500' : ''
                    }`}
                  />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-muted-foreground gap-1">
                    <span>Spent: {formatCurrency(budget.spent)}</span>
                    <span className="text-center sm:text-right">
                      {budget.remaining > 0 
                        ? `${formatCurrency(budget.remaining)} left`
                        : `${formatCurrency(Math.abs(budget.remaining))} over`
                      }
                    </span>
                    <span className="text-right">Budget: {formatCurrency(budget.amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}