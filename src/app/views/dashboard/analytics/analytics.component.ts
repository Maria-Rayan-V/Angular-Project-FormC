import { Component, OnInit, AfterViewInit } from '@angular/core';
import { matxAnimations } from 'src/app/shared/animations/matx-animations';
//import tinyColor from "tinycolor2";
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
} from 'ng-apexcharts';
import { RegnNavService } from 'src/app/shared/services/regnNav.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  animations: matxAnimations,
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  userId: String;
  totalFormC: any;
  SubmittedFormC: any;
  pendingFormC: any;
  checkOutFormC: any;
  chartSeries: ApexNonAxisChartSeries = [0, 0, 0, 0];
  isFormCApplnFound: boolean = false;
  chartDetails: ApexChart = {
    type: 'pie',
    offsetX: 450,
    // toolbar: {
    //   show: true
    // }
  };

  chartLabels = ['Checkout', 'Pending', 'Submitted', 'Total'];

  chartTitle: ApexTitleSubtitle = {
    text: 'Form C Applications',
    align: 'right',
  };

  chartDataLabels: ApexDataLabels = {
    enabled: true,
  };
  constructor(
    private formcService: FormcServicesService,
    private snackbar: MatSnackBar,
    private ls: LocalStoreService,
    private regnNav: RegnNavService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.regnNav.castchatSeries.subscribe(
      (series) => (this.chartSeries = series)
    );
    this.userId = this.ls.getItem('username');
    this.formcService.getFormCCnt(this.userId).subscribe(
      (data: any) => {
        this.checkOutFormC = data['checkoutentered'];
        this.pendingFormC = data['pending'];
        this.SubmittedFormC = data['totalsubmitted'];
        this.totalFormC =
          Number(this.SubmittedFormC) + Number(this.pendingFormC);
        this.regnNav.editchatSeries([
          Number(this.checkOutFormC),
          Number(this.pendingFormC),
          Number(this.SubmittedFormC),
          Number(this.totalFormC),
        ]);
        //  this.chartSeries.push(Number(this.checkOutFormC),Number(this.pendingFormC),Number(this.SubmittedFormC),Number(this.totalFormC));
        // this.chartSeries.push(43,43,34);
        this.isFormCApplnFound = true;
        console.log('total formc', this.chartSeries);
      },
      (err) => {
        //  this.snackbar.open('Something went wrong', '', {
        //    duration: snackbarDuration
        //  });
        //  alert(
        //    err
        //  )
      }
    );
    if (Number(this.totalFormC) > 0) {
      this.isFormCApplnFound = true;
    }
  }
}
