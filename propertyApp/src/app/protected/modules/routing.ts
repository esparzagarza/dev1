import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'resumen',
    loadChildren: () => import('./summary/summary.module').then(m => m.SummaryModule)
  },
  {
    path: 'administracion-de-inmuebles',
    loadChildren: () => import('./item/item.module').then(m => m.ItemModule)
  },
  {
    path: 'administracion-de-inquilinos',
    loadChildren: () => import('./ente/ente.module').then(m => m.EnteModule)
  },
  {
    path: 'administracion-de-servicios',
    loadChildren: () => import('./expense/expense.module').then(m => m.ExpenseModule)
  },
  {
    path: 'administracion-de-contratos',
    loadChildren: () => import('./contract/contract.module').then(m => m.ContractModule)
  },
  {
    path: 'administracion-de-pagos',
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
  },
  {
    path: 'administracion-de-rentas',
    loadChildren: () => import('./rent/rent.module').then(m => m.RentModule)
  },
  {
    path: 'control-de-usuarios',
    loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule)
  },
  {
    path: 'ajustes-de-sistema',
    loadChildren: () => import('./config/config.module').then(m => m.ConfigModule)
  },
  {
    path: 'reporte-de-rentas',
    loadChildren: () => import('./_overviewreport/overviewreport.module').then(m => m.OverviewReportModule)
  },
  {
    path: 'reporte-de-inquilino',
    loadChildren: () => import('./_entereport/entereport.module').then(m => m.EnteReportModule)
  },
  {
    path: 'reporte-de-inmueble',
    loadChildren: () => import('./_itemreport/itemreport.module').then(m => m.ItemReportModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

export { Routing }
