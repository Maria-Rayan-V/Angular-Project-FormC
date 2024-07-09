import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAccoProfileRoutingModule } from './add-acco-profile-routing.module';
import { AddAccoProfStepperComponent } from './add-acco-prof-stepper.component';
import { FormcCommonmaterialModule } from 'src/app/shared/formc-commonmaterial/formc-commonmaterial.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddAccoProfStepperComponent],
  imports: [
    CommonModule,
    AddAccoProfileRoutingModule,FormcCommonmaterialModule,SharedModule,ReactiveFormsModule
  ]
})
export class AddAccoProfileModule { }
