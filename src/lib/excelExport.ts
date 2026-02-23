import * as XLSX from 'xlsx';
import type { Expense, Income, DashboardData } from '@/types';

const formatDate = (date: Date): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const getMonthName = (monthNum: number): string => {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return months[monthNum - 1] || '';
};

export const exportToExcel = (
  expenses: Expense[],
  incomes: Income[],
  dashboardData: DashboardData,
  year: number
): void => {
  const wb = XLSX.utils.book_new();
  
  // 1. Dashboard Sheet
  const dashboardData_sheet = createDashboardSheet(dashboardData, year);
  const wsDashboard = XLSX.utils.aoa_to_sheet(dashboardData_sheet);
  XLSX.utils.book_append_sheet(wb, wsDashboard, '📈 Dashboard');
  
  // 2. Gasto Mensual Sheet
  const gastoMensual = createMonthlyExpenseSheet(expenses);
  const wsGastoMensual = XLSX.utils.aoa_to_sheet(gastoMensual);
  XLSX.utils.book_append_sheet(wb, wsGastoMensual, '📈 Gasto Mensual');
  
  // 3. Ingreso Mensual Sheet
  const ingresoMensual = createMonthlyIncomeSheet(incomes);
  const wsIngresoMensual = XLSX.utils.aoa_to_sheet(ingresoMensual);
  XLSX.utils.book_append_sheet(wb, wsIngresoMensual, '📈 Ingreso Mensual');
  
  // 4. Agregar Gasto Sheet (raw data)
  const agregarGasto = createExpenseDataSheet(expenses);
  const wsAgregarGasto = XLSX.utils.aoa_to_sheet(agregarGasto);
  XLSX.utils.book_append_sheet(wb, wsAgregarGasto, '➕Agregar Gasto');
  
  // 5. Agregar Ingreso Sheet (raw data)
  const agregarIngreso = createIncomeDataSheet(incomes);
  const wsAgregarIngreso = XLSX.utils.aoa_to_sheet(agregarIngreso);
  XLSX.utils.book_append_sheet(wb, wsAgregarIngreso, '➕Agregar Ingreso');
  
  // 6. Category sheets for expenses
  const expenseCategories = [...new Set(expenses.map(e => e.categoria))];
  expenseCategories.forEach(category => {
    const categoryExpenses = expenses.filter(e => e.categoria === category);
    if (categoryExpenses.length > 0) {
      const sheetData = createCategorySheet(categoryExpenses);
      const wsCategory = XLSX.utils.aoa_to_sheet(sheetData);
      const sheetName = `📈 ${category}`.substring(0, 31);
      XLSX.utils.book_append_sheet(wb, wsCategory, sheetName);
    }
  });
  
  // 7. Category sheets for incomes
  const incomeCategories = [...new Set(incomes.map(i => i.categoria))];
  incomeCategories.forEach(category => {
    const categoryIncomes = incomes.filter(i => i.categoria === category);
    if (categoryIncomes.length > 0) {
      const sheetData = createIncomeCategorySheet(categoryIncomes);
      const wsCategory = XLSX.utils.aoa_to_sheet(sheetData);
      const sheetName = `📈 ${category}`.substring(0, 31);
      XLSX.utils.book_append_sheet(wb, wsCategory, sheetName);
    }
  });
  
  // 8. Configuración Sheet
  const configSheet = createConfigSheet(year);
  const wsConfig = XLSX.utils.aoa_to_sheet(configSheet);
  XLSX.utils.book_append_sheet(wb, wsConfig, 'Configuración');
  
  // Download
  XLSX.writeFile(wb, `Finanzas_${year}.xlsx`);
};

const createDashboardSheet = (data: DashboardData, year: number): unknown[][] => {
  const sheet: unknown[][] = [];
  
  // Header with totals
  sheet.push(['', '💰 Total de Ingresos', '', '', '💸 Total de Gastos', '', '', '⚖️ Balance I vs G']);
  sheet.push(['', data.totalIngresos, '', '', data.totalGastos, '', '', data.balance]);
  sheet.push(['', 'Promedio', data.promedioIngresos, 1, 'Promedio', data.promedioGastos]);
  
  // Empty rows
  for (let i = 0; i < 3; i++) sheet.push([]);
  
  // Monthly data
  sheet.push(['', '', '', '', '', '', '', '', '', '', '', '', 'Meses', 'Ingresos', 'Gastos', 'Diff']);
  data.datosMensuales.forEach(m => {
    sheet.push(['', '', '', '', '', '', '', '', '', '', '', '', m.mes, m.ingresos, m.gastos, m.diferencia]);
  });
  
  // Empty rows
  for (let i = 0; i < 3; i++) sheet.push([]);
  
  // Expense categories pie chart data
  sheet.push(['', 'Mis Gastos']);
  data.categoriasGasto.forEach(cat => {
    sheet.push(['', cat.porcentaje / 100]);
  });
  
  // Empty rows
  for (let i = 0; i < 5; i++) sheet.push([]);
  
  // Income categories
  sheet.push(['', 'Mis Ingresos']);
  data.categoriasIngreso.forEach(cat => {
    sheet.push(['', cat.total]);
  });
  
  // Summary
  sheet.push([]);
  sheet.push(['', '', '', '', '', '', '', '', '', '', '', 'En cuenta actual', data.totalPatrimonio]);
  sheet.push(['', '', '', '', '', '', '', '', '', '', '', `${year}-12-31`, data.totalPatrimonio]);
  
  return sheet;
};

const createMonthlyExpenseSheet = (expenses: Expense[]): unknown[][] => {
  const sheet: unknown[][] = [];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  // Calculate monthly totals by category
  const categories = [...new Set(expenses.map(e => e.categoria))];
  
  sheet.push(['Categoría', ...months, 'Total']);
  
  categories.forEach(cat => {
    const row: unknown[] = [cat];
    let total = 0;
    for (let i = 1; i <= 12; i++) {
      const monthTotal = expenses
        .filter(e => e.categoria === cat && e.numeroMes === i)
        .reduce((sum, e) => sum + e.importe, 0);
      row.push(monthTotal);
      total += monthTotal;
    }
    row.push(total);
    sheet.push(row);
  });
  
  return sheet;
};

const createMonthlyIncomeSheet = (incomes: Income[]): unknown[][] => {
  const sheet: unknown[][] = [];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  const categories = [...new Set(incomes.map(i => i.categoria))];
  
  sheet.push(['Categoría', ...months, 'Total']);
  
  categories.forEach(cat => {
    const row: unknown[] = [cat];
    let total = 0;
    for (let i = 1; i <= 12; i++) {
      const monthTotal = incomes
        .filter(inc => inc.categoria === cat && inc.numeroMes === i)
        .reduce((sum, inc) => sum + inc.importe, 0);
      row.push(monthTotal);
      total += monthTotal;
    }
    row.push(total);
    sheet.push(row);
  });
  
  return sheet;
};

const createExpenseDataSheet = (expenses: Expense[]): unknown[][] => {
  const sheet: unknown[][] = [];
  sheet.push(['Fecha', 'Gasto', 'Descripción', 'Importe', 'Número de Mes', 'Nombre de Mes', 'Devuelto']);
  
  expenses.forEach(e => {
    sheet.push([
      formatDate(e.fecha),
      e.categoria,
      e.descripcion,
      e.importe,
      e.numeroMes,
      getMonthName(e.numeroMes),
      e.devuelto ? 1 : ''
    ]);
  });
  
  return sheet;
};

const createIncomeDataSheet = (incomes: Income[]): unknown[][] => {
  const sheet: unknown[][] = [];
  sheet.push(['Fecha', 'Ingreso', 'Descripción', 'Importe', 'Comentario', 'Numero Mes']);
  
  incomes.forEach(i => {
    sheet.push([
      formatDate(i.fecha),
      i.categoria,
      i.descripcion,
      i.importe,
      i.comentario || '',
      i.numeroMes
    ]);
  });
  
  return sheet;
};

const createCategorySheet = (expenses: Expense[]): unknown[][] => {
  const sheet: unknown[][] = [];
  sheet.push(['Fecha', 'Gasto', 'Descripción', 'Importe', 'Número de Mes']);
  
  expenses.forEach(e => {
    sheet.push([
      formatDate(e.fecha),
      e.categoria,
      e.descripcion,
      e.importe,
      e.numeroMes
    ]);
  });
  
  return sheet;
};

const createIncomeCategorySheet = (incomes: Income[]): unknown[][] => {
  const sheet: unknown[][] = [];
  sheet.push(['Fecha', 'Ingreso', 'Descripción', 'Importe', 'Comentario', 'Numero Mes']);
  
  incomes.forEach(i => {
    sheet.push([
      formatDate(i.fecha),
      i.categoria,
      i.descripcion,
      i.importe,
      i.comentario || '',
      i.numeroMes
    ]);
  });
  
  return sheet;
};

const createConfigSheet = (year: number): unknown[][] => {
  const sheet: unknown[][] = [];
  
  sheet.push(['', 'Configuración']);
  sheet.push(['', 'Categorías de los datos', '', '', `Año ${year}`]);
  sheet.push(['', 'Gastos', 'Ingresos', '', 'Meses']);
  
  const gastos = ['Alquileres', 'Compras', 'Entretenimiento', 'Supermercado', 'Servicios', 'Restaurantes y Bares', 'Transporte', 'Vacaciones', 'Tarjeta de Crédito', 'Deudas', 'Otros', 'Gastos Fijos St Pau', 'Plan Pensiones', 'Alhambra', 'Extraescolares', 'Talones Asistencia', 'Ropa & Calzado', 'Financiera El Corte Ingles', 'Retiro Hucha Ahorro', 'Parking', 'Colegio', 'Can Fargues', 'Gastos Fijos BCN', 'ViaT', 'Movistar', 'Gasoil', 'Hucha Ahorro', 'Veterinaria', 'Ocio', 'Seguros', 'Luz - St Pau'];
  const ingresos = ['Salarios', 'Jubilación o Pensión', 'Alquileres', 'Negocio', 'Otros', 'Traspaso', 'Devolución Hacienda', 'Hucha Ahorro'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  const maxRows = Math.max(gastos.length, ingresos.length, meses.length);
  for (let i = 0; i < maxRows; i++) {
    sheet.push(['', gastos[i] || '', ingresos[i] || '', '', meses[i] || '']);
  }
  
  return sheet;
};
