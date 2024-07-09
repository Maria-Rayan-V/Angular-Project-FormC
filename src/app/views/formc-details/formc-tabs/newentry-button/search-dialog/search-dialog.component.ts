import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import { FormCDetails } from 'src/app/shared/models/formCModel.model';
import { CountryModel } from 'src/app/shared/models/masterModels';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { FormcTabsComponent } from '../../formc-tabs.component';
import { ScanqrDialogComponent } from '../scanqr-dialog/scanqr-dialog.component';

@Component({
  selector: 'formc-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss'],
})
export class SearchDialogComponent implements OnInit {
  existingDataSearch: any;
  countries: CountryModel[];
  exitsingFormCDetails: FormCDetails[];
  constructor(
    private masterService: MasterServicesService,
    private formbuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private formcService: FormcServicesService,
    private dialogRef: MatDialogRef<FormcTabsComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.existingDataSearch = this.formbuilder.group({
      getNationalitytosearch: [''],
      getPptnotosearch: [''],
      gender: [''],
    });
  }

  ngOnInit() {
    this.masterService.getCountry().subscribe(
      (data: CountryModel[]) => {
        this.countries = data;
        //    console.log(JSON.stringify(this.countries,null,2))
      },
      (err) => {
        this.snackbar.open('Something went wrong', '', {
          duration: 5,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
  onQRScanned() {
    console.log('Scan QR clicked');
  }

  dialogClose() {
    this.dialogRef.close();
  }
  openDialog() {
    this.dialogClose();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '50px',
      left: '500px',
    };
    dialogConfig.width = '600px';
    dialogConfig.height = '650px';

    this.dialog.open(ScanqrDialogComponent, dialogConfig);
  }
  save() {
    if (this.existingDataSearch.valid) {
      this.dialogRef.close(this.existingDataSearch.value);
      console.log('inside valid');
      if (this.existingDataSearch.get('getPptnotosearch').value != null) {
        this.formcService
          .getLatestFormC(
            this.existingDataSearch.get('getPptnotosearch').value,
            this.existingDataSearch.get('getNationalitytosearch').value
          )
          .subscribe(
            (data: FormCDetails[]) => {
              console.log('inside get appldetails fn');
              this.exitsingFormCDetails = data;
              //   console.log(JSON.stringify(this.exitsingFormCDetails,null,2));
              this.router.navigate(['formc/add-formc-stepper'], {
                state: {
                  isfromExisting: true,
                  existingApplication: this.exitsingFormCDetails,
                },
              });
            },
            (err) => {
              this.snackbar.open('Something went wrong', '', {
                duration: 5,
              });
              //  alert(
              //    err
              //  )
            }
          );
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
