import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { SubmittedListModel } from 'src/app/shared/models/formc-submittedlistmode.model';
import { PendingListModel } from 'src/app/shared/models/formcPendingList.model';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { SearchDialogComponent } from './newentry-button/search-dialog/search-dialog.component';

@Component({
  selector: 'formc-formc-tabs',
  templateUrl: './formc-tabs.component.html',
  styleUrls: ['./formc-tabs.component.scss'],
})
export class FormcTabsComponent implements OnInit {
  dataSource: any;
  submittedFormCDetails: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  checkoutpendingDetails: any;
  pendingFormCDetails: any;
  isSubUser: boolean = false;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private ls: LocalStoreService,
    private formcService: FormcServicesService
  ) {}
  draftColumns: string[] = [
    'applicationId',
    'name',
    'country_outside_india_desc',
    'passnum',
    'dob',
    'entered_on',
    'editPending',
  ];
  submittedColumns: string[] = [
    'applicationId',
    'name',
    'country_outside_india_desc',
    'passnum',
    'dob',
    'entered_on',
    'viewDetails',
  ];
  pendingcheckoutColumns: string[] = [
    'applicationId',
    'name',
    'country_outside_india_desc',
    'passnum',
    'dob',
    'entered_on',
    'markCheckout',
  ];
  ngOnInit() {
    console.log('Inside tab oninit');
    var accoCode = this.ls.getItem('accoCode');
    var frroCode = this.ls.getItem('frroCode');
    var userTypeCode = this.ls.getItem('usrTypeCode');
    var userName = this.ls.getItem('username');

    if (userTypeCode == '5') {
      this.isSubUser = false;
    } else {
      this.isSubUser = true;
    }
    console.log('Is sub user', this.isSubUser);
    if (this.isSubUser) {
      this.formcService
        .getSubUsrSubmittedFormC(accoCode, frroCode, userName)
        .subscribe(
          (data: SubmittedListModel[]) => {
            this.submittedFormCDetails = data;
          },
          (err) => {
            this.snackbar.open('NO RECORDS FOUND', 'close', {
              duration: snackbarDuration,
            });
          }
        );
    } else {
      this.formcService.getSubmittedFormC(accoCode, frroCode).subscribe(
        (data: SubmittedListModel[]) => {
          this.submittedFormCDetails = data;
        },
        (err) => {
          this.snackbar.open('NO RECORDS FOUND', 'close', {
            duration: snackbarDuration,
          });
        }
      );
    }
    if (this.isSubUser) {
      this.formcService
        .getSubuserCheckoutPending(accoCode, frroCode, userName)
        .subscribe(
          (data: PendingListModel[]) => {
            this.checkoutpendingDetails = data;
          },
          (err) => {
            this.snackbar.open('NO RECORDS FOUND', 'close', {
              duration: snackbarDuration,
            });
          }
        );
    } else {
      this.formcService.getCheckoutPending(accoCode, frroCode).subscribe(
        (data: PendingListModel[]) => {
          this.checkoutpendingDetails = data;
        },
        (err) => {
          this.snackbar.open('NO RECORDS FOUND', 'close', {
            duration: snackbarDuration,
          });
        }
      );
    }
    //   if(this.isSubUser)
    //   {
    this.formcService
      .getSubuserPendingFormC(accoCode, frroCode, userName)
      .subscribe(
        (data: PendingListModel[]) => {
          this.pendingFormCDetails = data;
        },
        (err) => {
          this.snackbar.open('NO RECORDS FOUND', 'close', {
            duration: snackbarDuration,
          });
        }
      );
    // }
    // else{
    //   this.formcService.getPendingFormC(accoCode,frroCode).subscribe((data: PendingListModel[]) => {

    //     this.pendingFormCDetails = data;

    //   },
    //     (err) => {

    //       this.snackbar.open('NO RECORDS FOUND', 'close', {
    //         duration: snackbarDuration
    //       });

    //     },
    //   );
    // }
  }

  openDialog() {
    console.log('');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '220px',
      left: '500px',
    };
    dialogConfig.width = '500px';
    dialogConfig.height = '450px';
    (dialogConfig.panelClass = 'my-dialog'),
      this.dialog.open(SearchDialogComponent, dialogConfig);
  }
}
