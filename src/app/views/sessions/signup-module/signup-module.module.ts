import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupModuleRoutingModule } from './signup-module-routing.module';
import { SignupMenuComponent } from './signup-menu/signup-menu.component';
import { CommonRegFormComponent } from './common-reg-form/common-reg-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormcCommonmaterialModule } from 'src/app/shared/formc-commonmaterial/formc-commonmaterial.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IHStepperComponent } from './ihstepper/ihstepper.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    SignupMenuComponent,
    CommonRegFormComponent,
    IHStepperComponent
  ],
  imports: [
    CommonModule,SharedModule,FormcCommonmaterialModule,
    SignupModuleRoutingModule,ReactiveFormsModule,HttpClientModule
  ]
})
export class SignupModuleModule { }
