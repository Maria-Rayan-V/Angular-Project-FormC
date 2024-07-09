import { SharedMaterialModule } from "src/app/shared/shared-material.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
//import { ChartsModule } from "ng2-charts";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedPipesModule } from "src/app/shared/pipes/shared-pipes.module";

import { DashboardRoutes } from "./dashboard.routing";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatCardModule } from "@angular/material/card";
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  imports: [
    CommonModule,
    SharedMaterialModule,
    FlexLayoutModule,
    //ChartsModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    NgApexchartsModule,
    NgxDatatableModule,
    SharedPipesModule,
    PerfectScrollbarModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [AnalyticsComponent],
  exports: [AnalyticsComponent]
})
export class DashboardModule {}
