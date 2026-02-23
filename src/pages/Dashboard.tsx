import { useFinanceData } from '@/hooks/useFinanceData';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { MonthlyChart } from '@/components/charts/MonthlyChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { BalanceLineChart } from '@/components/charts/BalanceLineChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

export function Dashboard() {
  const { dashboardData, recentTransactions, deleteExpense, deleteIncome } = useFinanceData(2024);
  const navigate = useNavigate();

  const handleDelete = (id: string, type: 'expense' | 'income') => {
    if (type === 'expense') {
      deleteExpense(id);
    } else {
      deleteIncome(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen de tu situación financiera
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/add-expense')} variant="outline">
            <TrendingDown className="h-4 w-4 mr-2 text-rose-500" />
            Gasto
          </Button>
          <Button onClick={() => navigate('/add-income')} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
            Ingreso
          </Button>
          <Button onClick={() => navigate('/export')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Ingresos"
          amount={dashboardData.totalIngresos}
          type="income"
          subtitle={`Promedio: ${new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
          }).format(dashboardData.promedioIngresos)}/mes`}
        />
        <SummaryCard
          title="Total Gastos"
          amount={dashboardData.totalGastos}
          type="expense"
          subtitle={`Promedio: ${new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
          }).format(dashboardData.promedioGastos)}/mes`}
        />
        <SummaryCard
          title="Balance"
          amount={dashboardData.balance}
          type="balance"
          subtitle={dashboardData.balance >= 0 ? 'Superávit' : 'Déficit'}
        />
        <SummaryCard
          title="Patrimonio Total"
          amount={dashboardData.totalPatrimonio}
          type="savings"
          subtitle={`Hucha: ${new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
          }).format(dashboardData.totalHucha)}`}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MonthlyChart data={dashboardData.datosMensuales} />
        <CategoryPieChart
          data={dashboardData.categoriasGasto}
          title="Distribución de Gastos"
          type="expense"
        />
        <BalanceLineChart data={dashboardData.datosMensuales} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={recentTransactions}
        onDelete={handleDelete}
      />
    </div>
  );
}
