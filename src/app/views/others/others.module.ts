import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormcCommonmaterialModule } from 'src/app/shared/formc-commonmaterial/formc-commonmaterial.module';
import { RouterModule } from '@angular/router';
import { OthersRoutes } from './others.routing';
import { ChangepasscompComponent } from './changepasscomp/changepasscomp.component';
import { OwnerinfodialogComponent } from './ownerinfodialog/ownerinfodialog.component';
import { InputuppercaseDirective } from 'src/app/shared/directives/inputuppercase.directive';
import { EditAccoProfileComponent } from './edit-acco-profile/edit-acco-profile.component';





@NgModule({
  declarations: [ EditAccoProfileComponent, ChangepasscompComponent, OwnerinfodialogComponent],
  imports: [
    CommonModule,
    SharedModule,ReactiveFormsModule,FormcCommonmaterialModule,RouterModule.forChild(OthersRoutes)
  ],
  exports:[
    ChangepasscompComponent
  ]
})
export class OthersModule {}
