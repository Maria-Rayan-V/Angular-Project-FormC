 import { Routes } from '@angular/router';
import { config } from 'src/config';
import { UserRoleGuard } from '../../shared/guards/user-role.guard';

// import { AccomodatorProfileComponent } from '../sessions/accomodator-profile/accomodator-profile.component';
import { ChangepasscompComponent } from './changepasscomp/changepasscomp.component';
import { EditAccoProfileComponent } from './edit-acco-profile/edit-acco-profile.component';



export const OthersRoutes: Routes = [
  {
    path: '',
    children: [
      {
      path: 'change-password',
      // canActivate: [UserRoleGuard],
      component: ChangepasscompComponent,
      data: { title: 'Change Password', breadcrumb: 'Change Password', roles: config.authRoles.user }
    },
    // {
    //   path: 'acco-profile',
    //  // canActivate: [UserRoleGuard],
    //   component: AccomodatorProfileComponent,
    //   data: { title: 'Accomodator Profile', breadcrumb: 'Accomodation Profile',roles: config.authRoles.user}
    // }
     {
      path: 'edit-acco-profile',
      // canActivate: [UserRoleGuard],
      component: EditAccoProfileComponent,
      data: { title: 'Edit Profile', breadcrumb: 'Accomodation Profile', roles: config.authRoles.user , isFromEditAccoProfile:true }
    },
    // {
    //   path: 'sub-user-list',
    //   canActivate: [UserRoleGuard],
    //   component: SubusersListComponent,
    //   data: { title: 'Sub Users', breadcrumb: 'Subordinate', roles: config.authRoles.user}
    // },
  ]
  }
];
