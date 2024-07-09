import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { RegnNavService } from 'src/app/shared/services/regnNav.service';
import { SubmittedForApprovalComponent } from '../submitted-for-approval/submitted-for-approval.component';

@Component({
  selector: 'formc-submit-confirmation',
  templateUrl: './submit-confirmation.component.html',
  styleUrls: ['./submit-confirmation.component.scss'],
})
export class SubmitConfirmationComponent implements OnInit {
  userIdtoSubmit: string;
  myStepper: any;
  // @ViewChild('linearVerticalStepper') private myStepper: MatStepper;
  constructor(
    private dialogRef: MatDialogRef<SubmittedForApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private formcService: FormcServicesService,
    private ls: LocalStoreService,
    private regnNav: RegnNavService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.myStepper = data.regnStepper;
  }

  ngOnInit(): void {}
  closedialog() {
    this.dialogRef.close();
  }
  submitForApprovalFun() {
    this.userIdtoSubmit = this.ls.getItem('verifiedUser');
    this.formcService.finalSubmitRegnDetails(this.userIdtoSubmit).subscribe(
      (data: any) => {
        console.log('data in final submit ', data);
        this.dialogRef.close();
        this.myStepper.next();
        // this.router.navigate(['sessions/formc-signin']);
        if (data['validStatus'] != null) {
          this.ls.setItem('validStatus', data['validStatus']);
        }
        this.regnNav.editisAddDisabled(true);
        this.regnNav.editisSubmitDisabled(true);
        this.regnNav.editisPdfDisabled(false);
        //  Swal.fire({
        //   title: 'Application form for Form C approval submitted successfully',
        //   icon: 'success',
        //   showConfirmButton: true,
        //   allowOutsideClick: false,
        //   allowEscapeKey: false
        // }).then((result)=>{

        //   // this.router.navigate(["regn/regn-home"]);

        // this.router.navigate(["sessions/formc-signin"]);
        //   // this.getPdfForApproval(this.userIdtoSubmit);
        // });
        // Swal.fire(
        //    'Generate Pdf ','', 'success').then((result)=>{
        //     this.router.navigate(["sessions/formc-signin"]);
        //     this.getPdfForApproval(this.userIdtoSubmit);
        //   });

        console.log('success');

        //  this.length = this.pendingFormCList.length;

        //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
      },
      (err) => {
        this.snackbar.open('Something went wrong', '', {
          duration: snackbarDuration,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
}
