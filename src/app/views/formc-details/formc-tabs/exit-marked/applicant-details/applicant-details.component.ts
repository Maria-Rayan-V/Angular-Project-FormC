import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormCDetails } from 'src/app/shared/models/formCModel.model';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { CustomTableComponent } from '../../custom-table/custom-table.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'formc-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.scss'],
})
export class ApplicantDetailsComponent implements OnInit {
  formcApplicantdetails: FormCDetails[];

  applicationId: any;
  imageSource: any;
  tableDataSource: MatTableDataSource<FormCDetails>;
  VisaColumns: string[] = [
    'visanum',
    'visaplace',
    'visacounDesc',
    'visadate',
    'visaexpdate',
    'visatypeDesc',
  ];
  PassportCols: string[] = [
    'passnum',
    'passplace',
    'passcounDesc',
    'passdate',
    'passexpdate',
  ];
  ArrivalCols: string[] = [
    'arriplace',
    'arricit',
    'arricounDesc',
    'arridateind',
    'arridatehotel',
    'arritimehotel',
    'durationofstay',
  ];
  NxtDestCols: string[] = [
    'nextdestplaceinind',
    'nextdestdistinindDesc',
    'nextdeststateinindDesc',
    'nextdestplaceoutind',
    'nextdestcityoutind',
    'nextdestcounoutindDesc',
  ];
  contactCols: string[] = ['mblnuminind', 'phnnuminind', 'mblnum', 'phnnum'];
  othersCols: string[] = [
    'employedinind',
    'splcategorycodeDesc',
    'purposeofvisitDesc',
  ];
  constructor(
    private formcService: FormcServicesService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<CustomTableComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.applicationId = data.userId;
    console.log('inside constructor', this.applicationId);
  }
  dialogClose() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.formcService.getApplicantDetails(this.applicationId).subscribe(
      (data: FormCDetails[]) => {
        this.formcApplicantdetails = data;
        console.log('appli details', this.formcApplicantdetails);
        this.imageSource =
          'data:image/jpeg;base64,' + this.formcApplicantdetails[0]['img'];

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
  close() {
    this.dialogRef.close();
  }
}
