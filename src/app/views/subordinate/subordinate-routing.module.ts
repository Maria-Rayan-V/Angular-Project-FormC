import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubordinateComponent } from './add-subordinate/add-subordinate.component';
import { SubusersTableComponent } from './subusers-table/subusers-table.component';

const subordinateRoutes: Routes = [ {
  path: 'add-subuser',
 
  component: AddSubordinateComponent,
  // data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
},
{
  path: 'list-subuser',
 
  component: SubusersTableComponent,
  // data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
},
];

@NgModule({
  imports: [RouterModule.forChild(subordinateRoutes)],
  exports: [RouterModule]
})
export class SubordinateRoutingModule { }
