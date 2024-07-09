import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { config } from 'src/config';
import { UserRoleGuard } from '../../shared/guards/user-role.guard';
import { GensummarycompComponent } from './gensummarycomp/gensummarycomp.component';
import { BulkPrintComponent } from './bulk-print/bulk-print.component';
import { ReportsSubuserComponent } from './reports-subuser/reports-subuser.component';
import { PrintSubuserComponent } from './print-subuser/print-subuser.component';
import { SummarySubuserComponent } from './summary-subuser/summary-subuser.component';



export const ReportRoutes: Routes = [
  {
    path: '',
    children: [
    {
      path: 'generate-summary',
      // canActivate: [UserRoleGuard],
      component: GensummarycompComponent,
      data: { title: 'Generate Summary', breadcrumb: 'Generate Summary', roles: config.authRoles.user }
    },
    {
      path: 'bulk-pdf',
      // canActivate: [UserRoleGuard],
      component: BulkPrintComponent,
      data: { title: 'Bulk Print', breadcrumb: 'Bulk Print', roles: config.authRoles.user }
    },
    {
      path: 'reports-subuser',
      // canActivate: [UserRoleGuard],
      component: ReportsSubuserComponent,
      data: { title: 'Report', breadcrumb: 'Report', roles: config.authRoles.user }
    },
    {
      path: 'print-subuser',
      // canActivate: [UserRoleGuard],
      component: PrintSubuserComponent,
      data: { title: 'Report', breadcrumb: 'Report', roles: config.authRoles.user }
    },
    {
      path: 'summary-subuser',
      // canActivate: [UserRoleGuard],
      component: SummarySubuserComponent,
      data: { title: 'Summary', breadcrumb: 'Report', roles: config.authRoles.user }
    },
   
    {
      path: '',
      redirectTo: "generate-summary"
    }
  ]
  }
];