import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupMenuComponent } from './signup-menu/signup-menu.component';
import { CommonRegFormComponent } from './common-reg-form/common-reg-form.component';
import { IHStepperComponent } from './ihstepper/ihstepper.component';

const routes: Routes = [ {
  path: '',
  // canActivate: [UserRoleGuard],
  component: SignupMenuComponent,
  //  data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
},
{
path: 'RegnForm',
// canActivate: [UserRoleGuard],
component: CommonRegFormComponent,
//  data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
},
{
  path: 'IHRegn',
  // canActivate: [UserRoleGuard],
  component: IHStepperComponent,
  //  data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupModuleRoutingModule { }
