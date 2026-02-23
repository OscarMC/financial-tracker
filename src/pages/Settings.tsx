import { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  PiggyBank, 
  TrendingDown, 
  Trash2, 
  AlertTriangle,
  Save
} from 'lucide-react';

export function Settings() {
  const { hucha, planPensiones, addToHucha, addToPlanPensiones } = useFinanceData(2024);
  const [huchaAmount, setHuchaAmount] = useState('');
  const [pensionAmount, setPensionAmount] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const handleUpdateHucha = () => {
    const amount = parseFloat(huchaAmount);
    if (isNaN(amount)) {
      toast.error('Introduce un importe válido');
      return;
    }
    addToHucha(amount);
    setHuchaAmount('');
    toast.success('Hucha actualizada correctamente');
  };

  const handleUpdatePension = () => {
    const amount = parseFloat(pensionAmount);
    if (isNaN(amount)) {
      toast.error('Introduce un importe válido');
      return;
    }
    addToPlanPensiones(amount);
    setPensionAmount('');
    toast.success('Plan de pensiones actualizado correctamente');
  };

  const handleClearData = () => {
    localStorage.clear();
    toast.success('Todos los datos han sido eliminados');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona la configuración de tu cuenta
        </p>
      </div>

      <Tabs defaultValue="savings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="savings">Ahorros</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
        </TabsList>

        <TabsContent value="savings" className="space-y-4">
          {/* Hucha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-amber-500" />
                Hucha de Ahorros
              </CardTitle>
              <CardDescription>
                Gestiona tu hucha de ahorros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Saldo actual</p>
                <p className="text-3xl font-bold">{formatCurrency(hucha)}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Importe a añadir/retirar"
                  value={huchaAmount}
                  onChange={(e) => setHuchaAmount(e.target.value)}
                />
                <Button onClick={handleUpdateHucha}>
                  <Save className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Usa valores negativos para retirar dinero de la hucha
              </p>
            </CardContent>
          </Card>

          {/* Plan de Pensiones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-purple-500" />
                Plan de Pensiones
              </CardTitle>
              <CardDescription>
                Gestiona tu plan de pensiones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Saldo actual</p>
                <p className="text-3xl font-bold">{formatCurrency(planPensiones)}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Importe a añadir"
                  value={pensionAmount}
                  onChange={(e) => setPensionAmount(e.target.value)}
                />
                <Button onClick={handleUpdatePension}>
                  <Save className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Zona de Peligro
              </CardTitle>
              <CardDescription>
                Acciones irreversibles para tus datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Eliminar todos los datos</p>
                    <p className="text-sm text-destructive/80">
                      Esta acción eliminará permanentemente todos tus gastos, ingresos 
                      y configuraciones. No se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar todos los datos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminarán permanentemente 
                      todos tus datos financieros, incluyendo gastos, ingresos, 
                      configuraciones y credenciales.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearData} className="bg-destructive">
                      Sí, eliminar todo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
