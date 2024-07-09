import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleGuard } from 'src/app/shared/guards/user-role.guard';
import { AddAccoProfStepperComponent } from './add-acco-prof-stepper/add-acco-prof-stepper.component';
import { RegisterationLayoutComponent } from './registeration-layout/registeration-layout.component';
import { config } from 'src/config';
import { SubmittedForApprovalComponent } from './submitted-for-approval/submitted-for-approval.component';
import { PdfForApprovalComponent } from './pdf-for-approval/pdf-for-approval.component';
import { RegnHomeComponent } from './regn-home/regn-home.component';
export const regnRoutes: Routes = [
  {
    path: 'regn-layout',
    
    component: RegisterationLayoutComponent,
    children:[{
      path: 'add-acco-prof',
      loadChildren:()=>import("./add-acco-prof-stepper/add-acco-profile.module").then(
        (m)=>m.AddAccoProfileModule
      )
   
    },
    {
      path: 'submitted-approval',
     
      component: SubmittedForApprovalComponent,
      // data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
    },
    {
      path: 'pdf-approval',
     
      component: PdfForApprovalComponent,
      // data: { title: 'Form-C Details', breadcrumb: 'Form C ', roles: config.authRoles.user }
    },
    { path:'regn-home',
    component:AddAccoProfStepperComponent,
 },
   { path:'',
     component:AddAccoProfStepperComponent,
  }
  ]
    
  },
     
      
     
      {
        path: '',
        redirectTo: "regn-layout"
      }
];

@NgModule({
  imports: [RouterModule.forChild(regnRoutes)],
  exports: [RouterModule]
})
export class AccommodatorModuleRoutingModule { }
