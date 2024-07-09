import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepperComponentComponent } from './stepper-component/stepper-component.component';
import { config } from 'src/config';
import { UserRoleGuard } from '../../shared/guards/user-role.guard';
import { PendingSearchComponent } from './pending-search/pending-search.component';
import { GetdatetoprintComponent } from './getdatetoprint/getdatetoprint.component';
import { CheckoutfilterComponent } from './checkoutfilter/checkoutfilter.component';
import { NewformcEntryComponent } from './stepper-component/newformc-entry/newformc-entry.component';
import { PendingFormcListComponent } from './pending-formc-list/pending-formc-list.component';
import { FormcLogoutComponent } from './formc-logout/formc-logout.component';

export const FormcRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'add-formc-entry',
        // canActivate: [UserRoleGuard],
        component: NewformcEntryComponent,
        data: {
          title: 'Form-C Entry',
          breadcrumb: 'Search ',
          roles: config.authRoles.user,
        },
      },
      {
        path: 'add-formc-stepper',
        // canActivate: [UserRoleGuard],
        component: StepperComponentComponent,
        data: {
          title: 'Form-C Entry',
          breadcrumb: 'Add',
          roles: config.authRoles.user,
        },
      },
      {
        path: 'pending-formc-entry',
        // canActivate: [UserRoleGuard],
        component: PendingSearchComponent,
        data: {
          title: 'Pending Form-C',
          breadcrumb: 'Pending ',
          roles: config.authRoles.user,
        },
      },
      {
        path: 'print-formc',
        // canActivate: [UserRoleGuard],
        component: GetdatetoprintComponent,
        data: {
          title: 'Print Form-C',
          breadcrumb: 'Print ',
          roles: config.authRoles.user,
        },
      },
      {
        path: 'checkout-formc',
        // canActivate: [UserRoleGuard],
        component: CheckoutfilterComponent,
        data: {
          title: 'Departure Entry',
          breadcrumb: 'Departure Entry',
          roles: config.authRoles.user,
        },
      },
      {
        path: 'pending-formc-list',
        // canActivate: [UserRoleGuard],
        component: PendingFormcListComponent,
        data: {
          title: 'Pending Form-C',
          breadcrumb: 'Pending ',
          roles: config.authRoles.user,
        },
      },
      {
        path: 'formc-logout',
        // canActivate: [UserRoleGuard],
        component: FormcLogoutComponent,
        data: {
          title: ' Form-C Logout',
          breadcrumb: 'Logout ',
          roles: config.authRoles.user,
        },
      },
      {
        path: '',
        redirectTo: 'add-formc-entry',
      },
    ],
  },
];
