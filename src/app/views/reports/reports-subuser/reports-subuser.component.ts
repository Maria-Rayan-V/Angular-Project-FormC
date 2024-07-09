import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CURRENT_DATE } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { PdfviewerdialogComponent } from '../../formc-details/pdfviewerdialog/pdfviewerdialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'formc-reports-subuser',
  templateUrl: './reports-subuser.component.html',
  styleUrls: ['./reports-subuser.component.scss'],
})
export class ReportsSubuserComponent implements OnInit {
  @Input() public isBulkPrint: boolean = false;
  @Input() public isGenSumm: boolean = false;
  maxDate: any;
  reportsSubusrForm: any;
  subusers: string[] = ['ALL'];
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private formbuilder: FormBuilder,
    private formcService: FormcServicesService,
    private ls: LocalStoreService,
    private snackbar: MatSnackBar
  ) {
    this.reportsSubusrForm = this.formbuilder.group({
      entered_by: ['', [Validators.required]],
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
      acco_code: [''],
      frro_fro_code: [''],
    });
  }
  ngOnInit(): void {
    this.maxDate = CURRENT_DATE;
    var acco_code = this.ls.getItem('accoCode');
    var frro_fro_code = this.ls.getItem('frroCode');
    this.formcService.getSubUsers(frro_fro_code, acco_code).subscribe(
      (data: []) => {
        this.subusers.push(...data);
      },
      (err) => {
        this.snackbar.open('Something went wrong');
      }
    );
  }

  postSummaryData() {
    // console.log(  this.reportsSubusrForm.value);
    var startDate = this.reportsSubusrForm.value.from_date.format('DD-MM-YYYY');
    var endDate = this.reportsSubusrForm.value.to_date.format('DD-MM-YYYY');
    var startDate1 = moment(startDate, 'DD-MM-YYYY');
    var endDate1 = moment(endDate, 'DD-MM-YYYY');
    var dayDiff = endDate1.diff(startDate1, 'days');
    console.log('Days:' + dayDiff);
    let fromDate = new DatePipe('en-Us').transform(
      this.reportsSubusrForm.value.from_date,
      'dd/MM/yyyy'
    );
    this.reportsSubusrForm.value.from_date = fromDate;

    let toDate = new DatePipe('en-Us').transform(
      this.reportsSubusrForm.value.to_date,
      'dd/MM/yyyy'
    );
    this.reportsSubusrForm.value.to_date = toDate;
    // this.reportsSubusrForm.value.entered_by=this.ls.getItem('username');
    this.reportsSubusrForm.value.acco_code = this.ls.getItem('accoCode');
    this.reportsSubusrForm.value.frro_fro_code = this.ls.getItem('frroCode');
    const requestData = this.reportsSubusrForm.value;
    if (this.reportsSubusrForm.valid && dayDiff <= 30) {
      if (this.isBulkPrint == true) {
        console.log('Inside subuser bulk');
        if (this.reportsSubusrForm.value.entered_by == 'ALL') {
          console.log('Inside subuser bulk ALL');
          this.formcService
            .getBulkPrintAllSubuser(requestData)
            .subscribe((res) => {
              const fileURL = URL.createObjectURL(res);
              // this.pdfFilePath=fileURL;
              this.reportsSubusrForm.reset();

              this.OpenDialog(fileURL);
              //  window.open(fileURL, '_blank');
            });
        } else {
          console.log('Inside subuser bulk else All');
          this.formcService
            .getBulkFormCSubuser(requestData)
            .subscribe((res) => {
              const fileURL = URL.createObjectURL(res);
              // this.pdfFilePath=fileURL;
              this.reportsSubusrForm.reset();

              this.OpenDialog(fileURL);
              //  window.open(fileURL, '_blank');
            });
        }
      }

      if (this.isGenSumm == true) {
        console.log('Inside subuser bulk');
        if (this.reportsSubusrForm.value.entered_by == 'ALL') {
          console.log('Inside subuser bulk ALL');
          this.formcService
            .getSummaryAllSubuser(requestData)
            .subscribe((res) => {
              const fileURL = URL.createObjectURL(res);
              // this.pdfFilePath=fileURL;
              this.reportsSubusrForm.reset();
              // this.generateSummaryForm.controls['selectedRadio'].enable();
              //  window.open(fileURL, '_blank');
              this.OpenDialog(fileURL);
            });
        } else {
          this.formcService.getSummarySubuser(requestData).subscribe((res) => {
            const fileURL = URL.createObjectURL(res);
            // this.pdfFilePath=fileURL;
            this.reportsSubusrForm.reset();

            this.OpenDialog(fileURL);
            //  window.open(fileURL, '_blank');
          });
        }
      }
    } else {
      alert('Enter Required Fields, Date range cannot be more than 30 days.');
    }
  }
  OpenDialog(obj: any) {
    const dialogRef = this.dialog.open(PdfviewerdialogComponent, {
      height: '90%',
      width: '100%',
      data: obj,
      disableClose: true,
    });
  }
}
