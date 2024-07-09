import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { config } from 'src/config';
import { UserRoleGuard } from 'src/app/shared/guards/user-role.guard';

import { FormcTabsComponent } from './formc-tabs/formc-tabs.component';

export const FormcTabsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'formc-tabs',
        // canActivate: [UserRoleGuard],
        component: FormcTabsComponent,
        data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
      },
     
      {
        path: '',
        redirectTo: "formc-tabs"
      }
    ]
  }
];

