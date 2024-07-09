import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAccoProfStepperComponent } from './add-acco-prof-stepper.component';

const routes: Routes = [{
  path:'',
  component:AddAccoProfStepperComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAccoProfileRoutingModule { }
