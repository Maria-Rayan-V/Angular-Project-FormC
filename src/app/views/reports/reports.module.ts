import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GensummarycompComponent } from './gensummarycomp/gensummarycomp.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormcCommonmaterialModule } from 'src/app/shared/formc-commonmaterial/formc-commonmaterial.module';
import { RouterModule } from '@angular/router';
import { ReportRoutes } from './reports-routing.module';
import { BulkPrintComponent } from './bulk-print/bulk-print.component';
import { ReportsSubuserComponent } from './reports-subuser/reports-subuser.component';
import { PrintSubuserComponent } from './print-subuser/print-subuser.component';
import { SummarySubuserComponent } from './summary-subuser/summary-subuser.component';


@NgModule({
  declarations: [GensummarycompComponent, BulkPrintComponent, ReportsSubuserComponent, PrintSubuserComponent, SummarySubuserComponent],
  imports: [
    CommonModule,
    SharedModule,ReactiveFormsModule,FormcCommonmaterialModule,RouterModule.forChild(ReportRoutes)
  ],
  exports:[BulkPrintComponent,ReportsSubuserComponent]
})
export class ReportsModule { }
