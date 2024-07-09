import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OwnerDetail } from 'src/app/shared/models/AccommodatorModel.model';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { RegnNavService } from 'src/app/shared/services/regnNav.service';
import { SubmitConfirmationComponent } from '../submit-confirmation/submit-confirmation.component';

@Component({
  selector: 'formc-submitted-for-approval',
  templateUrl: './submitted-for-approval.component.html',
  styleUrls: ['./submitted-for-approval.component.scss'],
})
export class SubmittedForApprovalComponent implements OnInit {
  accoCode: any;
  userIdtoSubmit: any;
  isAddDisabled: boolean;
  isPdfDisabled: boolean;
  accommodatorDetails: any;
  loading: boolean = false;
  userId: any;
  frroCode: any;
  ownerDetails: MatTableDataSource<OwnerDetail>;
  displayedColumns: string[] = [
    'name',
    'address',
    'state',
    'cityDist',
    'emailId',
    'phoneNum',
    'mobile',
  ];
  constructor(
    private router: Router,
    private formcService: FormcServicesService,
    private regnNav: RegnNavService,
    private dialog: MatDialog,
    private ls: LocalStoreService,
    private snackbar: MatSnackBar
  ) {
    // let nav: Navigation = this.router.getCurrentNavigation();
    if (this.ls.getItem('accoCodeForRegn') != null) {
      this.accoCode = this.ls.getItem('accoCodeForRegn');
      this.userId = this.ls.getItem('verifiedUser');
      this.frroCode = this.ls.getItem('frroCodeRegn');
    }
    if (this.ls.getItem('accoCode') != null) {
      this.accoCode = this.ls.getItem('accoCode');
      this.userId = this.ls.getItem('username');
      this.frroCode = this.ls.getItem('frroCode');
    }
    // console.log('Inside Stepper nav with Acco',nav.extras.state['accoCode']);
    if (this.accoCode != null) {
      this.formcService
        .getAccomodatorDetails(this.accoCode, this.frroCode, this.userId)
        .subscribe(
          (data: any) => {
            this.accommodatorDetails = data;
            this.ownerDetails = this.accommodatorDetails['ownerDetails'];
            console.log('Acco details in nav', this.ownerDetails[0]);
          },
          (err) => {}
        );
    }
  }
  submitApplCnfrm() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.position = {
      top: '300px',
    };

    dialogConfig.height = '200px';
    dialogConfig.width = '400px';
    // dialogConfig.data = {
    //     selectedRecord:data
    // };
    this.dialog.open(SubmitConfirmationComponent, dialogConfig);
  }

  ngOnInit(): void {
    this.regnNav.castisAddDisabled.subscribe(
      (isAddDisabled) => (this.isAddDisabled = isAddDisabled)
    );
    this.regnNav.castisPdfDisabled.subscribe(
      (isPdfDisabled) => (this.isPdfDisabled = isPdfDisabled)
    );
  }
}
