import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { config } from 'src/config';
import { ApproveUserComponent } from './approve-user/approve-user.component';
import { PendingUnapprovedComponent } from './pending-unapproved/pending-unapproved.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'approve-user',
        // canActivate: [UserRoleGuard],
        component: ApproveUserComponent,
        data: {
          title: 'Approve User',
          breadcrumb: 'Add',
          roles: config.authRoles.user,
        },
      },
      {
        path: '',
        redirectTo: 'approve-user',
      },
      {
        path: 'pending-list',
        component: PendingUnapprovedComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminModuleRoutingModule {}
