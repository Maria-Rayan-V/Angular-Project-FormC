import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import Swal from 'sweetalert2';
import { PreviewdetailsComponent } from '../previewdetails/previewdetails.component';
import { VisaInvitationComponent } from 'src/app/views/medical-visa/visa-invitation/visa-invitation.component';
@Component({
  selector: 'formc-submitconfirmdialog',
  templateUrl: './submitconfirmdialog.component.html',
  styleUrls: ['./submitconfirmdialog.component.scss'],
})
export class SubmitconfirmdialogComponent implements OnInit {
  applicationId: any;
  successMessage: any;
  loading: boolean = false;
  fileRefno: any;
  constructor(
    private ls: LocalStoreService,
    private router: Router,
    private snackbar: MatSnackBar,
    private formcService: FormcServicesService,
    private dialogRefMed: MatDialogRef<VisaInvitationComponent>,
    @Inject(MAT_DIALOG_DATA) MedData,
    private dialogRef: MatDialogRef<PreviewdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.applicationId = data.userId;
    this.fileRefno = MedData.fileRefNo;
  }

  ngOnInit(): void {}
  finalSubmit() {
    this.dialogRef.close();
    this.loading = true;

    this.formcService.finalSubmitApplication(this.applicationId).subscribe(
      (data: any) => {
        console.log('data in final submit ', data);
        this.loading = false;
        this.successMessage = data;
        Swal.fire({
          title: this.successMessage,
          icon: 'success',
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          this.router.navigate(['formc-details/formc-tabs']);
        });

        console.log('success');

        //  this.length = this.pendingFormCList.length;

        //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
      },
      (err) => {
        this.loading = false;
        this.snackbar.open('Something went wrong', '', {
          duration: snackbarDuration,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
  closeConfirmdialog() {
    this.dialogRef.close();
  }
}
