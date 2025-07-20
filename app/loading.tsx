import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Loading Budget Guru</h3>
          <p className="text-muted-foreground">Please wait while we prepare your financial dashboard...</p>
        </div>
      </div>
    </div>
  );
}