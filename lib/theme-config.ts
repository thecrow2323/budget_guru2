import { useTheme } from 'next-themes';

export const useChartTheme = () => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return {
    colors: {
      primary: isDark ? '#60A5FA' : '#3B82F6',
      secondary: isDark ? '#34D399' : '#10B981',
      accent: isDark ? '#F472B6' : '#EC4899',
      warning: isDark ? '#FBBF24' : '#F59E0B',
      error: isDark ? '#F87171' : '#EF4444',
      success: isDark ? '#4ADE80' : '#22C55E',
      muted: isDark ? '#6B7280' : '#9CA3AF',
      background: isDark ? '#1F2937' : '#FFFFFF',
      foreground: isDark ? '#F9FAFB' : '#111827',
      border: isDark ? '#374151' : '#E5E7EB',
    },
    chartColors: isDark 
      ? ['#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#F87171', '#A78BFA', '#FB7185', '#4ADE80', '#38BDF8', '#FDE047']
      : ['#3B82F6', '#10B981', '#EC4899', '#F59E0B', '#EF4444', '#8B5CF6', '#E11D48', '#22C55E', '#0EA5E9', '#EAB308'],
    grid: {
      stroke: isDark ? '#374151' : '#E5E7EB',
      strokeDasharray: '3 3',
    },
    tooltip: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      border: isDark ? '#374151' : '#E5E7EB',
      color: isDark ? '#F9FAFB' : '#111827',
    },
  };
};

export const getThemeAwareChartConfig = (isDark: boolean) => ({
  colors: {
    primary: isDark ? '#60A5FA' : '#3B82F6',
    secondary: isDark ? '#34D399' : '#10B981',
    accent: isDark ? '#F472B6' : '#EC4899',
    warning: isDark ? '#FBBF24' : '#F59E0B',
    error: isDark ? '#F87171' : '#EF4444',
    success: isDark ? '#4ADE80' : '#22C55E',
    muted: isDark ? '#6B7280' : '#9CA3AF',
  },
  chartColors: isDark 
    ? ['#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#F87171', '#A78BFA', '#FB7185', '#4ADE80', '#38BDF8', '#FDE047']
    : ['#3B82F6', '#10B981', '#EC4899', '#F59E0B', '#EF4444', '#8B5CF6', '#E11D48', '#22C55E', '#0EA5E9', '#EAB308'],
});