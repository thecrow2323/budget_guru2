'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpendingInsight } from '@/types/finance';
import { AlertTriangle, TrendingUp, TrendingDown, Info, Lightbulb } from 'lucide-react';

interface SpendingInsightsProps {
  insights: SpendingInsight[];
}

export function SpendingInsights({ insights }: SpendingInsightsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle': return AlertTriangle;
      case 'TrendingUp': return TrendingUp;
      case 'TrendingDown': return TrendingDown;
      case 'Info': return Info;
      default: return Lightbulb;
    }
  };

  const getVariant = (type: SpendingInsight['type']) => {
    switch (type) {
      case 'warning': return 'destructive';
      case 'success': return 'default';
      case 'info': return 'secondary';
      default: return 'outline';
    }
  };

  const getIconColor = (type: SpendingInsight['type']) => {
    switch (type) {
      case 'warning': return 'text-red-600';
      case 'success': return 'text-green-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Spending Insights
        </CardTitle>
        <CardDescription>
          AI-powered insights about your spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Add more transactions to get personalized spending insights.
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = getIcon(insight.icon);
              return (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'warning' ? 'bg-red-100' :
                    insight.type === 'success' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    <Icon className={`h-4 w-4 ${getIconColor(insight.type)}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant={getVariant(insight.type)} className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}