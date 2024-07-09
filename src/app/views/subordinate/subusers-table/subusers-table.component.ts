import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { SubUserListModel } from 'src/app/shared/models/SubUserListModel';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { EditAccoProfileComponent } from '../../others/edit-acco-profile/edit-acco-profile.component';
import { DeleteSubuserDialogComponent } from '../delete-subuser-dialog/delete-subuser-dialog.component';
import { EditaddSubuserDialogComponent } from '../editadd-subuser-dialog/editadd-subuser-dialog.component';

@Component({
  selector: 'formc-subusers-table',
  templateUrl: './subusers-table.component.html',
  styleUrls: ['./subusers-table.component.scss'],
})
export class SubusersTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  myFlagForSlideToggle: boolean = true;
  length: any;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15];
  showFirstLastButtons = true;
  pendingFormCDetails: any;
  displayedColumns: string[] = [
    'userid',
    'user_name',
    'e_mail_id',
    'phone_no',
    'action',
  ];
  dataSource: MatTableDataSource<SubUserListModel>;
  subUserDetails: any;
  constructor(
    private ls: LocalStoreService,
    private formcService: FormcServicesService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    var accoCode = this.ls.getItem('accoCode');
    var frroCode = this.ls.getItem('frroCode');
    this.formcService.getSubUserList(frroCode, accoCode).subscribe(
      (data: SubUserListModel[]) => {
        this.subUserDetails = data;

        this.dataSource = new MatTableDataSource(this.subUserDetails);
        this.dataSource.paginator = this.paginator;
      },
      (err) => {
        this.snackbar.open('Something went wrong', 'close', {
          duration: snackbarDuration,
        });
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  editRecord(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '50px',
      left: '500px',
    };
    dialogConfig.width = '550px';
    dialogConfig.height = '600px';
    (dialogConfig.panelClass = 'my-dialog'),
      (dialogConfig.data = {
        selectedRecord: data,
        isFromEdit: true,
      });
    this.dialog.open(EditaddSubuserDialogComponent, dialogConfig);
  }
  deleteSubUser(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.position = {
      top: '100px',
    };

    dialogConfig.height = '400px';
    dialogConfig.width = '400px';
    dialogConfig.data = {
      selectedRecord: data,
    };
    this.dialog.open(DeleteSubuserDialogComponent, dialogConfig);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '50px',
      left: '500px',
    };
    dialogConfig.width = '550px';
    dialogConfig.height = '600px';
    (dialogConfig.panelClass = 'my-dialog'),
      (dialogConfig.data = {
        isFromEdit: false,
      });
    this.dialog.open(EditaddSubuserDialogComponent, dialogConfig);
  }
}
