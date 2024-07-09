import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'formc-approve-user',
  templateUrl: './approve-user.component.html',
  styleUrls: ['./approve-user.component.css'],
})
export class ApproveUserComponent implements OnInit {
  approveUsrForm: any;
  frroCode: any;
  userId: any;
  accommodatorDetails: any;
  constructor(
    private formbuilder: FormBuilder,
    private dialog: MatDialog,
    private formcService: FormcServicesService,
    private ls: LocalStoreService
  ) {
    this.approveUsrForm = this.formbuilder.group({
      userId: ['', [Validators.required]],
      newpassword: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
      frro_fro_code: [''],
    });
  }

  ngOnInit(): void {
    this.frroCode = this.ls.getItem('frroCode');
  }

  getUserDts() {
    this.formcService
      .getUnapprovedUsrDetails(this.frroCode, this.approveUsrForm.value.userId)
      .subscribe({
        next: (data) => {
          {
            this.accommodatorDetails = data;
            this.viewDetails();
            // console.log('Acco dts', this.accommodatorDetails['user_name']);
            // console.log('Acco details in nav', this.ownerDetails[0]);
            // this.ownerDetailsSource = new MatTableDataSource(
            //   this.accommodatorDetails['ownerDetails']
            // );
          }
        },
        error: (err) => {
          console.log('Error in userid', err);
          console.log('Error in userid', err.error['errors']);

          Swal.fire({
            title: err.error['errors'],
            // icon: 'error',
            // showCancelButton: true,
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            // window.location.href = window.location.href;

            window.location.reload();
          });
        },
      });
  }
  viewDetails() {
    // console.log('userid', data.form_c_appl_id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.position = {
      top: '0px',
      left: '250px',
      bottom: '250px',
    };

    dialogConfig.panelClass = 'my-dialog';
    dialogConfig.width = '99%';
    dialogConfig.height = '92%';
    dialogConfig.data = {
      userId: this.approveUsrForm.value.userId,
      frroCode: this.frroCode,
      accomDetails: this.accommodatorDetails,
    };
    this.dialog.open(UserDetailsComponent, dialogConfig);
  }
}
