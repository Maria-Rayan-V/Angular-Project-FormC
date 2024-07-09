import { PageEvent } from '@angular/material/paginator';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { DraftMedvisaModel } from 'src/app/shared/models/DraftMedvisa.model';

import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MedvisaDialogComponent } from '../medvisa-dialog/medvisa-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'formc-draft-medvisa',
  templateUrl: './draft-medvisa.component.html',
  styleUrls: ['./draft-medvisa.component.scss'],
})
export class DraftMedvisaComponent implements OnInit {
  pendingMedvisaDetails: any;
  submittedMedvisaDetails: any;
  medvisaExtnDetails: any;
  fileRefno: string;

  draftColumns: string[] = [
    'fileRefno',
    'patientName',
    'patientDob',
    'patientPassnum',
    'patientAddr',
    'editPendingMedvisa',
  ];
  submittedColumns: string[] = [
    'fileRefno',
    'patientName',
    'patientDob',
    'patientPassnum',
    'patientAddr',
    'submittedAction',
  ];
  extnColumns: string[] = [
    'rowNo',
    'fileRefno',
    'patientName',
    'patientDob',
    'patientPassnum',
    'extnAction',
  ];

  constructor(
    private formcService: FormcServicesService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formcService.getPendingMedvisa().subscribe(
      (data: DraftMedvisaModel[]) => {
        this.pendingMedvisaDetails = data;
      },
      (err) => {
        this.snackbar.open('NO RECORDS FOUND', 'close', {
          duration: snackbarDuration,
        });
      }
    );
    this.formcService.getSubmittedMedvisa().subscribe(
      (data: DraftMedvisaModel[]) => {
        this.submittedMedvisaDetails = data;
      },
      (err) => {
        this.snackbar.open('NO RECORDS FOUND', 'close', {
          duration: snackbarDuration,
        });
      }
    );
    this.formcService.getMedvisaExtn().subscribe(
      (data: DraftMedvisaModel[]) => {
        this.medvisaExtnDetails = data;
      },
      (err) => {
        this.snackbar.open('NO RECORDS FOUND', 'close', {
          duration: snackbarDuration,
        });
      }
    );
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(MedvisaDialogComponent, {
      width: '400px',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.fileRefno = result;
    });
  }

  goToMedvisaInv() {
    this.router.navigate(['medVisa/visa-invitation']);
  }
}
