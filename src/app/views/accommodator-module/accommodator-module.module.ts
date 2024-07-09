import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccommodatorModuleRoutingModule, regnRoutes } from './accommodator-module-routing.module';
import { RegisterationLayoutComponent } from './registeration-layout/registeration-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormcCommonmaterialModule } from 'src/app/shared/formc-commonmaterial/formc-commonmaterial.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SubmittedForApprovalComponent } from './submitted-for-approval/submitted-for-approval.component';
import { PdfForApprovalComponent } from './pdf-for-approval/pdf-for-approval.component';
import { RegnHomeComponent } from './regn-home/regn-home.component';
import { SubmitConfirmationComponent } from './submit-confirmation/submit-confirmation.component';


@NgModule({
  declarations: [
    RegisterationLayoutComponent,
    SubmittedForApprovalComponent,
    PdfForApprovalComponent,
    RegnHomeComponent,
    SubmitConfirmationComponent,
    
  ],
  imports: [
    CommonModule,FormcCommonmaterialModule, ReactiveFormsModule, SharedModule,
    AccommodatorModuleRoutingModule,RouterModule
  ]
})
export class AccommodatorModuleModule { }
