import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import Swal from 'sweetalert2';
import { CustomTableComponent } from '../../custom-table/custom-table.component';
import { FormCDetails } from 'src/app/shared/models/formCModel.model';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'formc-checkout-dialog',
  templateUrl: './checkout-dialog.component.html',
  styleUrls: ['./checkout-dialog.component.scss'],
})
export class CheckoutDialogComponent implements OnInit {
  checkOutForm: any;
  applicationIdToCheckOut: any;
  fullData: any;
  arrivalDate: any;
  arrivalTime: any;
  tableDataSource: any;
  imageSource: any;
  formcApplicantdetails: FormCDetails[];
  ArrivalCols: string[] = ['arridateind', 'arridatehotel', 'durationofstay'];
  constructor(
    private formbuilder: FormBuilder,
    private ls: LocalStoreService,
    private router: Router,
    private snackbar: MatSnackBar,
    private formcService: FormcServicesService,
    private dialogRef: MatDialogRef<CustomTableComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.checkOutForm = this.formbuilder.group({
      form_c_appl_id: [''],
      date_of_departure: ['', [Validators.required]],
      time_of_departure: ['', [Validators.required]],
      frro_fro_code: ['', []],
      entered_by: ['', []],
      entered_on: ['', []],
      departure_remark: ['', [Validators.required]],
    });
    this.applicationIdToCheckOut = data.userId;
    this.fullData = data.fullData;
    console.log('full data in checkout', this.fullData);
  }

  ngOnInit() {
    this.formcService
      .getApplicantDetails(this.applicationIdToCheckOut)
      .subscribe(
        (data: FormCDetails[]) => {
          this.formcApplicantdetails = data;
          console.log('appli details', this.formcApplicantdetails);
          this.imageSource =
            'data:image/jpeg;base64,' + this.formcApplicantdetails[0]['img'];
          this.arrivalDate = this.formcApplicantdetails[0]['arridatehotel'];
          this.arrivalTime = this.formcApplicantdetails[0]['arritimehotel'];
          if (this.arrivalDate != null && this.arrivalDate != '') {
            const [day, month, year] = this.arrivalDate.split('/');
            this.arrivalDate = year + '-' + month + '-' + day;

            console.log('dob in ppt', moment(this.arrivalDate));
          }
          this.tableDataSource = new MatTableDataSource(
            this.formcApplicantdetails
          );

          //  this.length = this.pendingFormCList.length;

          //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
        },
        (err) => {
          this.snackbar.open('Something went wrong', 'close', {
            duration: snackbarDuration,
          });
          //  alert(
          //    err
          //  )
        }
      );
  }
  compareTimes(
    previousDateStr: string,
    newDateStr: string,
    previousTime: string,
    newTime: string
  ): number {
    const previousDate = new Date(`${previousDateStr} ${previousTime}:00`);
    const newDate = new Date(`${newDateStr} ${newTime}:00`);

    if (previousDate < newDate) {
      console.log('greater'); // New time is greater
      return 1;
    } else if (previousDate > newDate) {
      console.log('smaller');
      return -1; // Previous time is greater
    } else {
      console.log('equal');
      return 0; // Times are equal
    }
  }
  timeChangeHandler(event: Event) {
    console.log(event);
  }
  dialogClose() {
    this.dialogRef.close();
  }
  postCheckout() {
    this.checkOutForm.value.form_c_appl_id = this.applicationIdToCheckOut;
    this.checkOutForm.value.entered_by = this.ls.getItem('username');
    this.checkOutForm.value.frro_fro_code = this.ls.getItem('frroCode');
    this.checkOutForm.value.entered_on = new Date();
    let dateOfDept = new DatePipe('en-Us').transform(
      this.checkOutForm.value.date_of_departure,
      'dd-MM-yyyy'
    );
    let dateOfDeptStr = new DatePipe('en-GB').transform(
      this.checkOutForm.value.date_of_departure,
      'yyyy-MM-dd'
    );
    console.log('date new str', dateOfDeptStr);
    this.checkOutForm.value.date_of_departure = dateOfDept;
    let enteredOn = new DatePipe('en-Us').transform(
      this.checkOutForm.value.entered_on,
      'dd-MM-yyyy'
    );
    console.log('time ', this.checkOutForm.value.time_of_departure);
    this.checkOutForm.value.entered_on = enteredOn;
    const checkoutDetails = this.checkOutForm.value;
    console.log(this.checkOutForm.value);

    let status = this.compareTimes(
      this.arrivalDate,
      dateOfDeptStr,
      this.arrivalTime,
      this.checkOutForm.value.time_of_departure
    );
    if (this.checkOutForm.valid) {
      console.log('inside valid personal');
      if (status == 1) {
        this.formcService.postCheckoutDetails(checkoutDetails).subscribe(
          (data: any) => {
            Swal.fire({
              title:
                'Checkout Details Submitted Successfully Application Id: ' +
                this.applicationIdToCheckOut,
              icon: 'success',
              showConfirmButton: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              window.location.reload();
            });
            // Swal.fire(
            //   'Checkout Details Submitted Successfully',`Application Id: ${this.applicationIdToCheckOut}`, 'success').then((result)=>{
            //     window.location.reload();
            //   });
          },

          (err) => {
            console.log('inside invalid personal');
            this.dialogRef.close();
            console.log('Failure');
            this.snackbar.open('Something went wrong', 'close', {
              duration: snackbarDuration,
            });
            //  alert(
            //    err
            //  )
          }
        );
      } else {
        this.snackbar.open(
          'Time of departure is smaller than time of arrival',
          'close',
          {
            duration: snackbarDuration,
          }
        );
      }
    }
  }
}
