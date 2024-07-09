import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubordinateRoutingModule } from './subordinate-routing.module';
import { AddSubordinateComponent } from './add-subordinate/add-subordinate.component';
import { FormcCommonmaterialModule } from 'src/app/shared/formc-commonmaterial/formc-commonmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubusersTableComponent } from './subusers-table/subusers-table.component';
import { DeleteSubuserDialogComponent } from './delete-subuser-dialog/delete-subuser-dialog.component';
import { EditaddSubuserDialogComponent } from './editadd-subuser-dialog/editadd-subuser-dialog.component';


@NgModule({
  declarations: [
    AddSubordinateComponent,
    SubusersTableComponent,
    DeleteSubuserDialogComponent,
    EditaddSubuserDialogComponent
  ],
  imports: [
    CommonModule,
    SubordinateRoutingModule,
    FormcCommonmaterialModule,FormsModule,ReactiveFormsModule
  ]
})
export class SubordinateModule { }
