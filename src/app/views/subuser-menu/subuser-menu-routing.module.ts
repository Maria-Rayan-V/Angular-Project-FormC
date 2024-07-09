import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuHomeComponent } from './su-home/su-home.component';
import { SuFormcComponent } from './su-formc/su-formc.component';
import { SuSummaryComponent } from './su-summary/su-summary.component';
import { SuBulkprintComponent } from './su-bulkprint/su-bulkprint.component';
import { config } from 'src/config';
import { UserRoleGuard } from 'src/app/shared/guards/user-role.guard';
import { SuChangePswdComponent } from './su-change-pswd/su-change-pswd.component';
const sroutes: Routes = [
  
  {
    path: '',
    // canActivate: [UserRoleGuard],
    component: SuHomeComponent,
    //  data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
  },
  {
    path: 'subusr-home',
    // canActivate: [UserRoleGuard],
    component: SuHomeComponent,
    //  data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
  },
  {
    path: 'subusr-formc',
    // canActivate: [UserRoleGuard],
    // data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user },
    component: SuFormcComponent,
 
  },
  {
    path: 'subusr-summary',
    // canActivate: [UserRoleGuard],
    // data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user },
    component: SuSummaryComponent,
 
  },
  {
    path: 'subusr-print',
    // canActivate: [UserRoleGuard],
    // data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user },
    component: SuBulkprintComponent,
  
  },
  {
    path: 'subusr-pswd',
    // canActivate: [UserRoleGuard],
    // data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user },
    component: SuChangePswdComponent,
  
  }
];

@NgModule({
  imports: [RouterModule.forChild(sroutes)],
  exports: [RouterModule]
})
export class SubuserMenuRoutingModule { }
