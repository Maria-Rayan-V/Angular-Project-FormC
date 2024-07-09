import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import Swal from 'sweetalert2';
import { CustomTableComponent } from '../../custom-table/custom-table.component';
import { FormcTabsComponent } from '../../formc-tabs.component';

@Component({
  selector: 'formc-delete-confirmdialog',
  templateUrl: './delete-confirmdialog.component.html',
  styleUrls: ['./delete-confirmdialog.component.scss'],
})
export class DeleteConfirmdialogComponent implements OnInit {
  @ViewChild(FormcTabsComponent) tabsComp: FormcTabsComponent;
  applicationId: any;
  pendingFormCDetails: any;
  isMedvisa: boolean = false;
  fileRefno: any;
  constructor(
    private dialogRef: MatDialogRef<CustomTableComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private formcService: FormcServicesService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.pendingFormCDetails = data.selectedRecord;
    console.log('pending recor', this.pendingFormCDetails);
    this.applicationId = data.selectedRecord.form_c_appl_id;
    if (data.isMedvisa != null) {
      this.fileRefno = data.selectedRecord.fileRefno;
      this.isMedvisa = data.isMedvisa;
    }
  }

  ngOnInit() {}
  dialogClose() {
    this.dialogRef.close();
  }
  deleteRecord() {
    this.dialogRef.close();
    if (this.isMedvisa) {
      this.formcService.deletePendingMedvisa(this.fileRefno).subscribe(
        (data: any) => {
          //   this.openDialog(this.ls.getItem('formCApplid'));
          Swal.fire({
            title: 'Deleted Successfully Application Id: ' + this.fileRefno,
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            // window.location.href = window.location.href;

            window.location.reload();
          });

          // Swal.fire(

          //   'Deleted Successfully',`Application Id: ${this.applicationId}` , 'success').then((result)=>{
          //     window.location.reload();
          //   });
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
    } else {
      this.formcService.deletePendingRecord(this.applicationId).subscribe(
        (data: any) => {
          //   this.openDialog(this.ls.getItem('formCApplid'));
          Swal.fire({
            title: 'Deleted Successfully Application Id: ' + this.applicationId,
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            // window.location.href = window.location.href;

            window.location.reload();
          });

          // Swal.fire(

          //   'Deleted Successfully',`Application Id: ${this.applicationId}` , 'success').then((result)=>{
          //     window.location.reload();
          //   });
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
  }
  closedialog() {
    this.dialogRef.close();
  }
}
