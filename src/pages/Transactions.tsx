import React, { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
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
import { Input } from '@/components/ui/input';
import { Trash2, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Transactions() {
  const { expenses, incomes, deleteExpense, deleteIncome } = useFinanceData(2024);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Get all unique categories
  const allCategories = React.useMemo(() => {
    const expenseCats = [...new Set(expenses.map(e => e.categoria))];
    const incomeCats = [...new Set(incomes.map(i => i.categoria))];
    return [...new Set([...expenseCats, ...incomeCats])];
  }, [expenses, incomes]);

  // Combine and filter transactions
  const allTransactions = React.useMemo(() => {
    const expenseTransactions = expenses.map(e => ({ ...e, type: 'expense' as const }));
    const incomeTransactions = incomes.map(i => ({ ...i, type: 'income' as const }));
    
    let transactions = [...expenseTransactions, ...incomeTransactions];
    
    // Apply filters
    if (filterType !== 'all') {
      transactions = transactions.filter(t => t.type === filterType);
    }
    
    if (filterCategory !== 'all') {
      transactions = transactions.filter(t => t.categoria === filterCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      transactions = transactions.filter(t =>
        t.descripcion.toLowerCase().includes(term) ||
        t.categoria.toLowerCase().includes(term)
      );
    }
    
    return transactions.sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [expenses, incomes, filterType, filterCategory, searchTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const handleDelete = (id: string, type: 'expense' | 'income') => {
    if (type === 'expense') {
      deleteExpense(id);
    } else {
      deleteIncome(id);
    }
    toast.success('Transacción eliminada');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transacciones</h1>
        <p className="text-muted-foreground">
          Gestiona todas tus transacciones
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transacciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Ingresos</SelectItem>
                  <SelectItem value="expense">Gastos</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {allTransactions.length} transacciones encontradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron transacciones
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
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTransactions.map((transaction) => (
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
