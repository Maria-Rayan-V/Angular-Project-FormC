import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubuserMenuRoutingModule } from './subuser-menu-routing.module';
import { SuHomeComponent } from './su-home/su-home.component';
import { SuFormcComponent } from './su-formc/su-formc.component';
import { SuSummaryComponent } from './su-summary/su-summary.component';
import { SuBulkprintComponent } from './su-bulkprint/su-bulkprint.component';
import { FormcTabsComponent } from '../formc-details/formc-tabs/formc-tabs.component';
import { FormcDetailsModule } from '../formc-details/formc-details.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ReportsModule } from '../reports/reports.module';
import { SuChangePswdComponent } from './su-change-pswd/su-change-pswd.component';
import { OthersModule } from '../others/others.module';


@NgModule({
  declarations: [
    SuHomeComponent,
    SuFormcComponent,
    SuSummaryComponent,
    SuBulkprintComponent,
    SuChangePswdComponent,
    
  ],
  imports: [
    SubuserMenuRoutingModule,

    CommonModule,FormcDetailsModule,DashboardModule,ReportsModule,OthersModule
  ]
})
export class SubuserMenuModule { }
