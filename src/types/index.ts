// Tipos principales de la aplicación FinanceTracker

export interface Expense {
  id: string;
  fecha: Date;
  categoria: string;
  descripcion: string;
  importe: number;
  numeroMes: number;
  devuelto?: boolean;
}

export interface Income {
  id: string;
  fecha: Date;
  categoria: string;
  descripcion: string;
  importe: number;
  comentario?: string;
  numeroMes: number;
}

export interface MonthlyData {
  mes: string;
  numeroMes: number;
  ingresos: number;
  gastos: number;
  diferencia: number;
}

export interface CategorySummary {
  categoria: string;
  total: number;
  porcentaje: number;
  mediaMensual: number;
}

export interface DashboardData {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  promedioIngresos: number;
  promedioGastos: number;
  totalHucha: number;
  totalPlanPensiones: number;
  totalPatrimonio: number;
  datosMensuales: MonthlyData[];
  categoriasGasto: CategorySummary[];
  categoriasIngreso: CategorySummary[];
}

export interface User {
  username: string;
  passwordHash: string;
  mustChangePassword: boolean;
}

export interface AppSettings {
  moneda: string;
  año: number;
  categoriasGasto: string[];
  categoriasIngreso: string[];
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
}
