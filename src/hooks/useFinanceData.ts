import { useCallback, useMemo } from 'react';
import type { Expense, Income, DashboardData, MonthlyData, CategorySummary } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const getMonthName = (monthNum: number): string => {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return months[monthNum - 1] || '';
};

export function useFinanceData(year: number = 2024) {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(`expenses_${year}`, []);
  const [incomes, setIncomes] = useLocalStorage<Income[]>(`incomes_${year}`, []);
  const [hucha, setHucha] = useLocalStorage<number>(`hucha_${year}`, 0);
  const [planPensiones, setPlanPensiones] = useLocalStorage<number>(`plan_pensiones_${year}`, 0);

  // Add expense
  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'numeroMes'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      numeroMes: new Date(expense.fecha).getMonth() + 1,
    };
    setExpenses(prev => [...prev, newExpense]);
    return newExpense;
  }, [setExpenses]);

  // Add income
  const addIncome = useCallback((income: Omit<Income, 'id' | 'numeroMes'>) => {
    const newIncome: Income = {
      ...income,
      id: crypto.randomUUID(),
      numeroMes: new Date(income.fecha).getMonth() + 1,
    };
    setIncomes(prev => [...prev, newIncome]);
    return newIncome;
  }, [setIncomes]);

  // Delete expense
  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, [setExpenses]);

  // Delete income
  const deleteIncome = useCallback((id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  }, [setIncomes]);

  // Update hucha
  const addToHucha = useCallback((amount: number) => {
    setHucha(prev => prev + amount);
  }, [setHucha]);

  // Update plan pensiones
  const addToPlanPensiones = useCallback((amount: number) => {
    setPlanPensiones(prev => prev + amount);
  }, [setPlanPensiones]);

  // Calculate dashboard data
  const dashboardData: DashboardData = useMemo(() => {
    const totalIngresos = incomes.reduce((sum, i) => sum + i.importe, 0);
    const totalGastos = expenses.reduce((sum, e) => sum + e.importe, 0);
    const balance = totalIngresos - totalGastos;
    
    const activeMonths = new Set([
      ...expenses.map(e => e.numeroMes),
      ...incomes.map(i => i.numeroMes)
    ]).size || 1;
    
    const promedioIngresos = totalIngresos / activeMonths;
    const promedioGastos = totalGastos / activeMonths;
    
    // Monthly data
    const datosMensuales: MonthlyData[] = [];
    for (let i = 1; i <= 12; i++) {
      const ingresosMes = incomes
        .filter(inc => inc.numeroMes === i)
        .reduce((sum, inc) => sum + inc.importe, 0);
      const gastosMes = expenses
        .filter(e => e.numeroMes === i)
        .reduce((sum, e) => sum + e.importe, 0);
      
      datosMensuales.push({
        mes: getMonthName(i),
        numeroMes: i,
        ingresos: ingresosMes,
        gastos: gastosMes,
        diferencia: ingresosMes - gastosMes,
      });
    }
    
    // Expense categories
    const expenseByCategory: Record<string, number> = {};
    expenses.forEach(e => {
      expenseByCategory[e.categoria] = (expenseByCategory[e.categoria] || 0) + e.importe;
    });
    
    const categoriasGasto: CategorySummary[] = Object.entries(expenseByCategory)
      .map(([categoria, total]) => ({
        categoria,
        total,
        porcentaje: totalGastos > 0 ? (total / totalGastos) * 100 : 0,
        mediaMensual: total / activeMonths,
      }))
      .sort((a, b) => b.total - a.total);
    
    // Income categories
    const incomeByCategory: Record<string, number> = {};
    incomes.forEach(i => {
      incomeByCategory[i.categoria] = (incomeByCategory[i.categoria] || 0) + i.importe;
    });
    
    const categoriasIngreso: CategorySummary[] = Object.entries(incomeByCategory)
      .map(([categoria, total]) => ({
        categoria,
        total,
        porcentaje: totalIngresos > 0 ? (total / totalIngresos) * 100 : 0,
        mediaMensual: total / activeMonths,
      }))
      .sort((a, b) => b.total - a.total);
    
    return {
      totalIngresos,
      totalGastos,
      balance,
      promedioIngresos,
      promedioGastos,
      totalHucha: hucha,
      totalPlanPensiones: planPensiones,
      totalPatrimonio: balance + hucha + planPensiones,
      datosMensuales,
      categoriasGasto,
      categoriasIngreso,
    };
  }, [expenses, incomes, hucha, planPensiones]);

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    const allTransactions = [
      ...expenses.map(e => ({ ...e, type: 'expense' as const })),
      ...incomes.map(i => ({ ...i, type: 'income' as const })),
    ];
    return allTransactions
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 10);
  }, [expenses, incomes]);

  // Get expenses by month
  const getExpensesByMonth = useCallback((month: number) => {
    return expenses.filter(e => e.numeroMes === month);
  }, [expenses]);

  // Get incomes by month
  const getIncomesByMonth = useCallback((month: number) => {
    return incomes.filter(i => i.numeroMes === month);
  }, [incomes]);

  return {
    expenses,
    incomes,
    hucha,
    planPensiones,
    dashboardData,
    recentTransactions,
    addExpense,
    addIncome,
    deleteExpense,
    deleteIncome,
    addToHucha,
    addToPlanPensiones,
    getExpensesByMonth,
    getIncomesByMonth,
  };
}
