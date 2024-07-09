import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { config } from 'src/config';
import { VisaInvitationComponent } from './visa-invitation/visa-invitation.component';
import { CustomTableComponent } from '../formc-details/formc-tabs/custom-table/custom-table.component';
import { DraftMedvisaComponent } from './draft-medvisa/draft-medvisa.component';
import { VisaExtnComponent } from './visa-extn/visa-extn.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'visa-invitation',
        // canActivate: [UserRoleGuard],
        component: VisaInvitationComponent,
        data: {
          title: 'Form-C Entry',
          breadcrumb: 'Add',
          roles: config.authRoles.user,
        },
      },
      {
        path: 'draft-medvisa',
        // canActivate: [UserRoleGuard],
        component: DraftMedvisaComponent,
        data: {
          title: 'Form-C Entry',
          breadcrumb: 'Add',
          roles: config.authRoles.user,
        },
      },
      {
        path: 'medvisa-extn',
        // canActivate: [UserRoleGuard],
        component: VisaExtnComponent,
        data: {
          title: 'Form-C Entry',
          breadcrumb: 'Add',
          roles: config.authRoles.user,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalVisaRoutingModule {}
