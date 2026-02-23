import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  fecha: Date;
  categoria: string;
  descripcion: string;
  importe: number;
  type: 'expense' | 'income';
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  onDelete?: (id: string, type: 'expense' | 'income') => void;
}

export function RecentTransactions({ transactions, onDelete }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const handleDelete = (id: string, type: 'expense' | 'income') => {
    if (onDelete) {
      onDelete(id, type);
      toast.success('Transacción eliminada');
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Transacciones Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay transacciones registradas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                  {onDelete && <TableHead className="w-10"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(transaction.fecha), 'dd MMM yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === 'income' ? 'default' : 'destructive'}
                        className="gap-1"
                      >
                        {transaction.type === 'income' ? (
                          <>
                            <TrendingUp className="h-3 w-3" />
                            Ingreso
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3" />
                            Gasto
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.categoria}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {transaction.descripcion}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${
                      transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.importe)}
                    </TableCell>
                    {onDelete && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(transaction.id, transaction.type)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
