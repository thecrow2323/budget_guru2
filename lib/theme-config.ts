import { useTheme } from 'next-themes';

export const useChartTheme = () => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return {
    colors: {
      primary: isDark ? 'hsl(217.2 91.2% 59.8%)' : 'hsl(221.2 83.2% 53.3%)',
      secondary: isDark ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(142.1 70.6% 45.3%)',
      accent: isDark ? 'hsl(330.4 81.2% 60.4%)' : 'hsl(330.4 81.2% 60.4%)',
      warning: isDark ? 'hsl(47.9 95.8% 53.1%)' : 'hsl(32.6 94.6% 43.7%)',
      error: isDark ? 'hsl(0 84.2% 60.2%)' : 'hsl(0 84.2% 60.2%)',
      success: isDark ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(142.1 70.6% 45.3%)',
      muted: isDark ? 'hsl(215 27.9% 16.9%)' : 'hsl(210 40% 96%)',
      background: isDark ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
      foreground: isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)',
      border: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
      card: isDark ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
      cardForeground: isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)',
    },
    chartColors: isDark 
      ? ['hsl(217.2 91.2% 59.8%)', 'hsl(142.1 76.2% 36.3%)', 'hsl(330.4 81.2% 60.4%)', 'hsl(47.9 95.8% 53.1%)', 'hsl(0 84.2% 60.2%)', 'hsl(263.4 70% 50.4%)', 'hsl(346.8 77.2% 49.8%)', 'hsl(142.1 76.2% 36.3%)', 'hsl(199.4 89.1% 48.4%)', 'hsl(47.9 95.8% 53.1%)']
      : ['hsl(221.2 83.2% 53.3%)', 'hsl(142.1 70.6% 45.3%)', 'hsl(330.4 81.2% 60.4%)', 'hsl(32.6 94.6% 43.7%)', 'hsl(0 84.2% 60.2%)', 'hsl(263.4 70% 50.4%)', 'hsl(346.8 77.2% 49.8%)', 'hsl(142.1 70.6% 45.3%)', 'hsl(199.4 89.1% 48.4%)', 'hsl(32.6 94.6% 43.7%)'],
    grid: {
      stroke: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
      strokeDasharray: '3 3',
    },
    tooltip: {
      backgroundColor: isDark ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
      border: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
      color: isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)',
    },
  };
};

export const getThemeAwareChartConfig = (isDark: boolean) => ({
  colors: {
    primary: isDark ? 'hsl(217.2 91.2% 59.8%)' : 'hsl(221.2 83.2% 53.3%)',
    secondary: isDark ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(142.1 70.6% 45.3%)',
    accent: isDark ? 'hsl(330.4 81.2% 60.4%)' : 'hsl(330.4 81.2% 60.4%)',
    warning: isDark ? 'hsl(47.9 95.8% 53.1%)' : 'hsl(32.6 94.6% 43.7%)',
    error: isDark ? 'hsl(0 84.2% 60.2%)' : 'hsl(0 84.2% 60.2%)',
    success: isDark ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(142.1 70.6% 45.3%)',
    muted: isDark ? 'hsl(215 27.9% 16.9%)' : 'hsl(210 40% 96%)',
  },
  chartColors: isDark 
    ? ['hsl(217.2 91.2% 59.8%)', 'hsl(142.1 76.2% 36.3%)', 'hsl(330.4 81.2% 60.4%)', 'hsl(47.9 95.8% 53.1%)', 'hsl(0 84.2% 60.2%)', 'hsl(263.4 70% 50.4%)', 'hsl(346.8 77.2% 49.8%)', 'hsl(142.1 76.2% 36.3%)', 'hsl(199.4 89.1% 48.4%)', 'hsl(47.9 95.8% 53.1%)']
    : ['hsl(221.2 83.2% 53.3%)', 'hsl(142.1 70.6% 45.3%)', 'hsl(330.4 81.2% 60.4%)', 'hsl(32.6 94.6% 43.7%)', 'hsl(0 84.2% 60.2%)', 'hsl(263.4 70% 50.4%)', 'hsl(346.8 77.2% 49.8%)', 'hsl(142.1 70.6% 45.3%)', 'hsl(199.4 89.1% 48.4%)', 'hsl(32.6 94.6% 43.7%)'],
});