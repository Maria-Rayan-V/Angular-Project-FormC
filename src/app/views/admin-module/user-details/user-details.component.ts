import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApproveUserComponent } from '../approve-user/approve-user.component';
import { MatTableDataSource } from '@angular/material/table';
import { OwnerDetail } from 'src/app/shared/models/AccommodatorModel.model';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { FormCDetails } from 'src/app/shared/models/formCModel.model';
import Swal from 'sweetalert2';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'formc-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  accommodatorDetails: any;
  userId: any;
  frroCode: any;
  approvedBy: any;
  ownerDetailsSource: MatTableDataSource<OwnerDetail>;
  tableDataSource: MatTableDataSource<FormCDetails>;
  displayColumn: string[] = [
    'name',
    'state',
    'city',
    'emailId',
    'phnNum',
    'mblNum',
  ];
  constructor(
    private formcService: FormcServicesService,
    private ls: LocalStoreService,
    private dialogRef: MatDialogRef<ApproveUserComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    console.log('Userid ', data['userId']);
    this.frroCode = data['frroCode'];
    this.userId = data['userId'];
    this.accommodatorDetails = data['accomDetails'];
    this.ownerDetailsSource = new MatTableDataSource(
      this.accommodatorDetails['ownerDetails']
    );
  }

  ngOnInit(): void {
    this.approvedBy = this.ls.getItem('username');
    // this.formcService
    //   .getUnapprovedUsrDetails(this.frroCode, this.userId)
    //   .subscribe(
    //     (data: any) => {
    //       this.accommodatorDetails = data;
    //       // this.ownerDetails = this.accommodatorDetails['ownerDetails'];
    //       console.log('Acco dts', this.accommodatorDetails['user_name']);
    //       // console.log('Acco details in nav', this.ownerDetails[0]);
    //       this.ownerDetailsSource = new MatTableDataSource(
    //         this.accommodatorDetails['ownerDetails']
    //       );
    //     },
    //     (err) => {
    //       console.log('Error in apo', err['errors']);
    //       console.log('error in else', err);
    //       Swal.fire({
    //         title: 'Invalid Userid',
    //         icon: 'success',
    //         showConfirmButton: true,
    //         allowOutsideClick: false,
    //         allowEscapeKey: false,
    //       }).then((result) => {
    //         // window.location.href = window.location.href;
    //         window.location.reload();
    //       });
    //     }
    //   );
  }
  approveUser() {
    this.formcService
      .approveUsrDetails(this.frroCode, this.userId, this.approvedBy)
      .subscribe(
        (data: any) => {
          Swal.fire({
            title: '  User Approved Successfully',
            icon: 'success',
            // showCancelButton: true,
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            // window.location.href = window.location.href;

            window.location.reload();
          });
        },
        (err) => {
          console.log('Error in userid', err.error);

          Swal.fire({
            title: ' Invalid Userid/ User Already Approved ',
            icon: 'error',
            // showCancelButton: true,
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            // window.location.href = window.location.href;

            window.location.reload();
          });
        }
      );
  }
  dialogClose() {
    this.dialogRef.close();
  }
}
