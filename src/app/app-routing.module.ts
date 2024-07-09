import { AdminModuleModule } from './views/admin-module/admin-module.module';
import { Routes } from '@angular/router';
// import { AccomodatorProfileComponent } from "./accomodator-profile/accomodator-profile.component";
// import { AfterFinalSubmitRegComponent } from "./after-final-submit-reg/after-final-submit-reg.component";
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';

import { RegisterationLayoutComponent } from './views/accommodator-module/registeration-layout/registeration-layout.component';
import { SubuserLayoutComponent } from './shared/components/layouts/subuser-layout/subuser-layout.component';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/analytics',
    pathMatch: 'full',
  },
  // {
  //   path: "acco-profile",
  //   component: AccomodatorProfileComponent,

  // },
  // {
  //   path: "finalSubmit_Regn",
  //   component: AfterFinalSubmitRegComponent,

  // },
  // {
  //   path: "signup-layout",
  //   component: SignUpModComponent,

  // },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () =>
          import('./views/sessions/sessions.module').then(
            (m) => m.SessionsModule
          ),
        data: { title: 'Session' },
      },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: SubuserLayoutComponent,
    children: [
      {
        path: 'subuser',

        loadChildren: () =>
          import('./views/subuser-menu/subuser-menu.module').then(
            (m) => m.SubuserMenuModule
          ),
        data: { title: 'Subuser' },
      },
    ],
  },
  {
    path: 'regn',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/accommodator-module/accommodator-module.module').then(
        (m) => m.AccommodatorModuleModule
      ),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'formc-details',
        loadChildren: () =>
          import('./views/formc-details/formc-details.module').then(
            (m) => m.FormcDetailsModule
          ),
      },
      {
        path: 'formc',
        loadChildren: () =>
          import('./views/formc/formc.module').then((m) => m.FormcModule),
        data: { title: 'Form C', breadcrumb: 'Form C' },
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./views/reports/reports.module').then((m) => m.ReportsModule),
        data: { title: 'Reports', breadcrumb: 'Reports' },
      },
      {
        path: 'others',
        loadChildren: () =>
          import('./views/others/others.module').then((m) => m.OthersModule),
        data: { title: 'Others', breadcrumb: 'Others' },
      },
      {
        path: 'subordinate',
        loadChildren: () =>
          import('./views/subordinate/subordinate.module').then(
            (m) => m.SubordinateModule
          ),
        data: { title: 'Subordinate', breadcrumb: 'Subordinate' },
      },
      {
        path: 'medVisa',
        loadChildren: () =>
          import('./views/medical-visa/medical-visa.module').then(
            (m) => m.MedicalVisaModule
          ),
        data: { title: 'Medical Visa', breadcrumb: 'Medical Visa' },
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./views/admin-module/admin-module.module').then(
            (m) => m.AdminModuleModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'sessions/404',
  },
];
