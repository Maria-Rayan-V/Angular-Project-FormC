import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';
import { CURRENT_DATE } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { PdfviewerdialogComponent } from '../../formc-details/pdfviewerdialog/pdfviewerdialog.component';
import { RegnNavService } from 'src/app/shared/services/regnNav.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'formc-gensummarycomp',
  templateUrl: './gensummarycomp.component.html',
  styleUrls: ['./gensummarycomp.component.css'],
})
export class GensummarycompComponent implements OnInit {
  selectedStatus: any;
  isSubUser: boolean = false;
  isGenSummSubuser: boolean = false;
  maxDate: any;
  subusers: string[] = ['ALL'];
  generateSummaryForm: any;
  selectedVal: string;
  selectedRadVal: any;
  reportVal: any;
  radioVals: any[] = [
    'FORMCFEDDURING',
    'BULK_PRINT',
    'DEPARTURE',
    'ALL',
    'SUBUSER',
  ];
  radioValues: any[] = [
    { val: 'FORMCFEDDURING', desc: 'Form C datewise' },
    { val: 'ARRIVAL', desc: 'Arrival' },
    { val: 'DEPARTURE', desc: 'Departure' },
    // { val: 'ALL', desc: 'All' },
    { val: 'SUBUSER', desc: 'Subuser' },
  ];
  hide = true;
  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private formbuilder: FormBuilder,
    private formcService: FormcServicesService,
    private ls: LocalStoreService,
    private regnNav: RegnNavService
  ) {
    this.generateSummaryForm = this.formbuilder.group({
      selectedRadio: ['', [Validators.required]],
      entered_by: [''],
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
      acco_code: [''],
      frro_fro_code: [''],
    });
  }
  radioChange(event: any) {
    this.selectedRadVal = event.value;

    this.regnNav.editreportVal(this.selectedRadVal);
    console.log('Radio val', this.selectedRadVal);
    console.log('Global val', this.reportVal);
  }
  postSummaryData(val: any) {
    console.log(this.generateSummaryForm.value);
    console.log('val', val);
    var startDate =
      this.generateSummaryForm.value.from_date.format('DD-MM-YYYY');
    var endDate = this.generateSummaryForm.value.to_date.format('DD-MM-YYYY');
    var startDate1 = moment(startDate, 'DD-MM-YYYY');
    var endDate1 = moment(endDate, 'DD-MM-YYYY');
    var dayDiff = endDate1.diff(startDate1, 'days');
    console.log('Days:' + dayDiff);
    let fromDate = new DatePipe('en-Us').transform(
      this.generateSummaryForm.value.from_date,
      'dd/MM/yyyy'
    );
    this.generateSummaryForm.value.from_date = fromDate;

    let toDate = new DatePipe('en-Us').transform(
      this.generateSummaryForm.value.to_date,
      'dd/MM/yyyy'
    );
    this.generateSummaryForm.value.to_date = toDate;
    this.generateSummaryForm.value.entered_by = this.ls.getItem('username');
    this.generateSummaryForm.value.acco_code = this.ls.getItem('accoCode');
    this.generateSummaryForm.value.frro_fro_code = this.ls.getItem('frroCode');
    const requestData = this.generateSummaryForm.value;

    if (this.generateSummaryForm.valid && dayDiff <= 30) {
      // this.generateSummaryForm.controls['selectedRadio'].disable();
      if (
        (val == '' || val == null) &&
        this.generateSummaryForm.controls['selectedRadio'].value == 'ARRIVAL'
      ) {
        this.formcService
          .getArrivalDetailsSummary(requestData)
          .subscribe((res) => {
            const fileURL = URL.createObjectURL(res);
            // this.pdfFilePath=fileURL;
            this.generateSummaryForm.reset();
            this.generateSummaryForm.controls['selectedRadio'].enable();
            this.OpenDialog(fileURL);
            //  window.open(fileURL, '_blank');
          });
      }
      if (
        (val == '' || val == null) &&
        this.generateSummaryForm.controls['selectedRadio'].value == 'DEPARTURE'
      ) {
        this.formcService
          .getDepartureDetailsSummary(requestData)
          .subscribe((res) => {
            const fileURL = URL.createObjectURL(res);
            // this.pdfFilePath=fileURL;
            this.generateSummaryForm.reset();
            this.generateSummaryForm.controls['selectedRadio'].enable();
            //  window.open(fileURL, '_blank');
            this.OpenDialog(fileURL);
          });
      }
      if (
        (val == '' || val == null) &&
        this.generateSummaryForm.controls['selectedRadio'].value ==
          'FORMCFEDDURING'
      ) {
        this.formcService
          .getSummarybyFormcdate(requestData)
          .subscribe((res) => {
            const fileURL = URL.createObjectURL(res);
            // this.pdfFilePath=fileURL;
            this.generateSummaryForm.reset();
            this.generateSummaryForm.controls['selectedRadio'].enable();
            //  window.open(fileURL, '_blank');
            this.OpenDialog(fileURL);
          });
      }
      if (val == 'BULK_PRINT') {
        this.formcService.getBulkFormC(requestData).subscribe((res) => {
          const fileURL = URL.createObjectURL(res);
          // this.pdfFilePath=fileURL;
          this.generateSummaryForm.reset();

          this.OpenDialog(fileURL);
          //  window.open(fileURL, '_blank');
        });
      }
    } else {
      console.log(this.generateSummaryForm);
      alert('Enter Required Fields, Date range cannot be more than 30 days.');
    }
  }

  ngOnInit(): void {
    this.maxDate = CURRENT_DATE;
    this.regnNav.castreportVal.subscribe(
      (reportVal) => (this.reportVal = reportVal)
    );
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

  loginSubmit() {
    if (this.generateSummaryForm.valid) {
      console.log(this.generateSummaryForm.value);
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
  postSubuserSummaryData(val: any) {
    // console.log(  this.generateSummaryForm.value);
    var startDate =
      this.generateSummaryForm.value.from_date.format('DD-MM-YYYY');
    var endDate = this.generateSummaryForm.value.to_date.format('DD-MM-YYYY');
    var startDate1 = moment(startDate, 'DD-MM-YYYY');
    var endDate1 = moment(endDate, 'DD-MM-YYYY');
    var dayDiff = endDate1.diff(startDate1, 'days');
    console.log('Days:' + dayDiff);
    let fromDate = new DatePipe('en-Us').transform(
      this.generateSummaryForm.value.from_date,
      'dd/MM/yyyy'
    );
    this.generateSummaryForm.value.from_date = fromDate;

    let toDate = new DatePipe('en-Us').transform(
      this.generateSummaryForm.value.to_date,
      'dd/MM/yyyy'
    );
    this.generateSummaryForm.value.to_date = toDate;
    // this.generateSummaryForm.value.entered_by=this.ls.getItem('username');
    this.generateSummaryForm.value.acco_code = this.ls.getItem('accoCode');
    this.generateSummaryForm.value.frro_fro_code = this.ls.getItem('frroCode');
    const requestData = this.generateSummaryForm.value;
    const invalid = [];
    const controls = this.generateSummaryForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        console.log('Invalid ctrls', invalid);
      }
    }
    if (this.generateSummaryForm.valid && dayDiff <= 30) {
      if (val == 'BULK_PRINT_SUBUSER') {
        console.log('Inside subuser bulk');
        if (this.generateSummaryForm.value.entered_by == 'ALL') {
          console.log('Inside subuser bulk ALL');
          this.formcService
            .getBulkPrintAllSubuser(requestData)
            .subscribe((res) => {
              const fileURL = URL.createObjectURL(res);
              // this.pdfFilePath=fileURL;
              this.generateSummaryForm.reset();

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
              this.generateSummaryForm.reset();

              this.OpenDialog(fileURL);
              //  window.open(fileURL, '_blank');
            });
        }
      }

      if (val == 'GENERATE_SUBUSER') {
        console.log('Inside subuser bulk');
        if (this.generateSummaryForm.value.entered_by == 'ALL') {
          console.log('Inside subuser bulk ALL');
          this.formcService
            .getSummaryAllSubuser(requestData)
            .subscribe((res) => {
              const fileURL = URL.createObjectURL(res);
              // this.pdfFilePath=fileURL;
              this.generateSummaryForm.reset();
              // this.generateSummaryForm.controls['selectedRadio'].enable();
              //  window.open(fileURL, '_blank');
              this.OpenDialog(fileURL);
            });
        } else {
          console.log('Inside else gensumm');
          this.formcService.getSummarySubuser(requestData).subscribe((res) => {
            const fileURL = URL.createObjectURL(res);
            // this.pdfFilePath=fileURL;
            this.generateSummaryForm.reset();

            this.OpenDialog(fileURL);
            //  window.open(fileURL, '_blank');
          });
        }
      }
    } else {
      alert('Enter Required Fields, Date range cannot be more than 30 days.');
    }
  }
}
