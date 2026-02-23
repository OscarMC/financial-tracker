import { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { exportToExcel } from '@/lib/excelExport';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileSpreadsheet, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

export function Export() {
  const { dashboardData, expenses, incomes } = useFinanceData(2024);
  const [year, setYear] = useState('2024');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      exportToExcel(expenses, incomes, dashboardData, parseInt(year));
      toast.success('Excel exportado correctamente');
    } catch (error) {
      toast.error('Error al exportar el Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exportar Datos</h1>
        <p className="text-muted-foreground">
          Exporta tus datos financieros a Excel
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Ingresos</p>
              <p className="text-xl font-bold">{formatCurrency(dashboardData.totalIngresos)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Gastos</p>
              <p className="text-xl font-bold">{formatCurrency(dashboardData.totalGastos)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transacciones</p>
              <p className="text-xl font-bold">{expenses.length + incomes.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Form */}
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Exportar a Excel
          </CardTitle>
          <CardDescription>
            El archivo incluirá todas las hojas con el mismo formato que el original:
            Dashboard, Gasto Mensual, Ingreso Mensual, y hojas por categoría.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Año</Label>
            <div className="flex gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-2" />
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max="2100"
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">El archivo incluirá:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 📈 Dashboard con resumen general</li>
              <li>• 📈 Gasto Mensual por categorías</li>
              <li>• 📈 Ingreso Mensual por categorías</li>
              <li>• ➕Agregar Gasto (datos completos)</li>
              <li>• ➕Agregar Ingreso (datos completos)</li>
              <li>• 📈 Hojas por cada categoría</li>
              <li>• Configuración</li>
            </ul>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Exportando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Descargar Excel
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
