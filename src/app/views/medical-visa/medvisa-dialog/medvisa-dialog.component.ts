import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { DraftMedvisaComponent } from '../draft-medvisa/draft-medvisa.component';
import { CountryModel } from 'src/app/shared/models/masterModels';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { MedVisaModel } from 'src/app/shared/models/MedVisaModel.model';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';

@Component({
  selector: 'formc-medvisa-dialog',
  templateUrl: './medvisa-dialog.component.html',
  styleUrls: ['./medvisa-dialog.component.scss'],
})
export class MedvisaDialogComponent implements OnInit {
  // fileRefno:any;
  existingDataSearch: any;
  countries: CountryModel[];
  exitsingFormCDetails: any;
  constructor(
    private masterService: MasterServicesService,
    private formbuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private formcService: FormcServicesService,
    private dialogRef: MatDialogRef<DraftMedvisaComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.existingDataSearch = this.formbuilder.group({
      fileRefno: [''],
    });
  }

  ngOnInit() {}

  dialogClose() {
    this.dialogRef.close();
  }

  save() {
    if (this.existingDataSearch.valid) {
      this.dialogRef.close(this.existingDataSearch.value);
      console.log(
        'value of filerefno',
        this.existingDataSearch.get('fileRefno').value
      );
      if (this.existingDataSearch.get('fileRefno').value != null) {
        this.formcService
          .getSubmittedDts(this.existingDataSearch.get('fileRefno').value)
          .subscribe(
            (data: MedVisaModel[]) => {
              console.log('inside get appldetails fn');
              this.exitsingFormCDetails = data;

              this.router.navigate(['medVisa/visa-invitation'], {
                state: {
                  existingMedvisaDts: this.exitsingFormCDetails,
                  isExisting: true,
                },
              });
            },
            (err) => {
              this.snackbar.open('Invalid Application Id', 'close', {
                duration: snackbarDuration,
              });
              //  alert(
              //    err
              //  )
            }
          );
      }
    }
  }
}
