# FinanceTracker

Aplicación web profesional para gestión de finanzas personales con React, TypeScript y Vite.

## Características

- **Gestión de Gastos e Ingresos**: Añade, edita y elimina transacciones fácilmente
- **Dashboard Visual**: Gráficos dinámicos con Recharts para visualizar tu situación financiera
- **Exportación a Excel**: Exporta todos tus datos en formato Excel con el mismo formato que tu archivo original
- **Modo Claro/Oscuro**: Interfaz adaptable con excelente legibilidad en ambos modos
- **Seguridad**: Datos encriptados en localStorage y autenticación con contraseña
- **Diseño Minimalista**: Interfaz profesional y limpia usando Tailwind CSS y shadcn/ui

## Tecnologías

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn/ui (componentes)
- Recharts (gráficos)
- xlsx (exportación Excel)
- crypto-js (encriptación)

## Instalación

### Requisitos previos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Descomprimir el archivo ZIP**
   ```bash
   unzip finance-tracker.zip
   cd finance-tracker
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar en modo desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

4. **Construir para producción**
   ```bash
   npm run build
   ```
   Los archivos de producción se generarán en la carpeta `dist/`

5. **Previsualizar build de producción**
   ```bash
   npm run preview
   ```

## Uso

### Primer acceso

- **Usuario**: `admin`
- **Contraseña**: `admin123`

⚠️ **IMPORTANTE**: La primera vez que accedes, el sistema te obligará a cambiar la contraseña por seguridad.

### Funcionalidades principales

1. **Dashboard**: Vista general de tus finanzas con:
   - Total de ingresos, gastos y balance
   - Gráfico de evolución mensual
   - Distribución de gastos por categoría
   - Balance mensual
   - Transacciones recientes

2. **Añadir Gasto/Ingreso**: Formularios intuitivos para registrar nuevas transacciones

3. **Transacciones**: Lista completa con filtros y búsqueda

4. **Exportar**: Descarga tu datos en formato Excel con todas las hojas:
   - 📈 Dashboard
   - 📈 Gasto Mensual
   - 📈 Ingreso Mensual
   - ➕Agregar Gasto
   - ➕Agregar Ingreso
   - 📈 Hojas por categoría
   - Configuración

5. **Configuración**: Gestiona tu hucha de ahorros y plan de pensiones

## Estructura del proyecto

```
src/
├── components/
│   ├── charts/          # Gráficos reutilizables
│   ├── dashboard/       # Componentes del dashboard
│   ├── forms/           # Formularios de gastos/ingresos
│   ├── layout/          # Layout principal
│   └── ui/              # Componentes shadcn/ui
├── contexts/
│   ├── AuthContext.tsx  # Autenticación
│   └── ThemeContext.tsx # Tema claro/oscuro
├── hooks/
│   ├── useFinanceData.ts   # Gestión de datos financieros
│   └── useLocalStorage.ts  # LocalStorage encriptado
├── lib/
│   ├── encryption.ts    # Utilidades de encriptación
│   └── excelExport.ts   # Exportación a Excel
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── AddExpense.tsx
│   ├── AddIncome.tsx
│   ├── Transactions.tsx
│   ├── Export.tsx
│   ├── Settings.tsx
│   └── ChangePassword.tsx
├── types/
│   └── index.ts         # Tipos TypeScript
└── App.tsx
```

## Seguridad

- Todos los datos se almacenan en localStorage de forma encriptada usando AES
- Las contraseñas se hashean con SHA-256
- La autenticación es obligatoria para acceder a los datos

## Personalización

### Categorías de gastos

Las categorías predefinidas están en `src/components/forms/ExpenseForm.tsx`:
- Tarjeta de Crédito
- Gastos Fijos BCN
- Seguros
- Plan Pensiones
- Transporte
- Otros
- Compras
- Ropa & Calzado
- Extraescolares
- Colegio
- Restaurantes y Bares
- Veterinaria
- Ocio
- Financiera El Corte Ingles
- Gastos Fijos St Pau
- Hucha Ahorro
- Retiro Hucha Ahorro

### Categorías de ingresos

Las categorías predefinidas están en `src/components/forms/IncomeForm.tsx`:
- Salarios
- Traspaso
- Devolución Hacienda
- Hucha Ahorro
- Alquileres
- Negocio
- Jubilación o Pensión
- Otros

## Licencia

MIT License - Libre uso y modificación.
