import { useNavigate } from 'react-router-dom';
import { useFinanceData } from '@/hooks/useFinanceData';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function AddIncome() {
  const navigate = useNavigate();
  const { addIncome } = useFinanceData(2024);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Añadir Ingreso</h1>
          <p className="text-muted-foreground">
            Registra un nuevo ingreso en tu cuenta
          </p>
        </div>
      </div>

      {/* Form */}
      <IncomeForm onSubmit={addIncome} />
    </div>
  );
}
