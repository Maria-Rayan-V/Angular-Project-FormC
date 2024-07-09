import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormcTabsComponent } from './formc-tabs/formc-tabs.component';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormcCommonmaterialModule } from 'src/app/shared/formc-commonmaterial/formc-commonmaterial.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormcRoutes } from '../formc/formc-routing.module';
import { FormcTabsRoutes } from './formc-details-routing.module';



import { ApplicantDetailsComponent } from './formc-tabs/exit-marked/applicant-details/applicant-details.component';
import { SearchDialogComponent } from './formc-tabs/newentry-button/search-dialog/search-dialog.component';
import { CheckoutDialogComponent } from './formc-tabs/pending-for-exit/checkout-dialog/checkout-dialog.component';
import { ScanqrDialogComponent } from './formc-tabs/newentry-button/scanqr-dialog/scanqr-dialog.component';

import { CustomTableComponent } from './formc-tabs/custom-table/custom-table.component';
import { PdfViewComponent } from './formc-tabs/exit-marked/pdf-view/pdf-view.component';
import { DeleteConfirmdialogComponent } from './formc-tabs/draft/delete-confirmdialog/delete-confirmdialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfviewerdialogComponent } from './pdfviewerdialog/pdfviewerdialog.component';




@NgModule({
  declarations: [
    FormcTabsComponent,



    ApplicantDetailsComponent,
    SearchDialogComponent,
    CheckoutDialogComponent,
    ScanqrDialogComponent,

    CustomTableComponent,
    PdfViewComponent,
    DeleteConfirmdialogComponent,
    PdfviewerdialogComponent,


  ],
  imports: [
    CommonModule,
    FormcCommonmaterialModule, ReactiveFormsModule, SharedModule, RouterModule.forChild(FormcTabsRoutes)
  ],
  exports:[
    FormcTabsComponent,CustomTableComponent
  ]
})
export class FormcDetailsModule { }
