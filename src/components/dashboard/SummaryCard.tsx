import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance' | 'savings' | 'pension';
  subtitle?: string;
  trend?: number;
}

const icons = {
  income: TrendingUp,
  expense: TrendingDown,
  balance: Wallet,
  savings: PiggyBank,
  pension: TrendingDown,
};

const gradients = {
  income: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
  expense: 'from-rose-500/20 to-rose-500/5 border-rose-500/30',
  balance: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
  savings: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
  pension: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
};

const iconColors = {
  income: 'text-emerald-500',
  expense: 'text-rose-500',
  balance: 'text-blue-500',
  savings: 'text-amber-500',
  pension: 'text-purple-500',
};

export function SummaryCard({ title, amount, type, subtitle, trend }: SummaryCardProps) {
  const Icon = icons[type];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <Card className={cn(
      'relative overflow-hidden bg-gradient-to-br transition-all duration-300 hover:shadow-lg',
      gradients[type]
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Icon className="h-24 w-24" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className={cn('h-4 w-4', iconColors[type])} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {formatCurrency(amount)}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 mt-2 text-xs',
            trend >= 0 ? 'text-emerald-500' : 'text-rose-500'
          )}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            <span className="text-muted-foreground">vs mes anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
