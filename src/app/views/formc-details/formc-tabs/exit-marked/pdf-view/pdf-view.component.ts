import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { PdfviewerdialogComponent } from '../../../pdfviewerdialog/pdfviewerdialog.component';
import { CustomTableComponent } from '../../custom-table/custom-table.component';

@Component({
  selector: 'formc-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss'],
})
export class PdfViewComponent implements OnInit {
  applicationId: any;
  fileURL: any;

  pdfFilePath: any;
  constructor(
    private dialog: MatDialog,
    private formcService: FormcServicesService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<CustomTableComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.applicationId = data.userId;
    console.log('inside constructor', this.applicationId);
  }

  ngOnInit(): void {
    this.formcService.getPdfReport(this.applicationId).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      this.pdfFilePath = fileURL;
      //  window.open(fileURL, '_blank');
      this.OpenDialog(fileURL);
    });
  }
  OpenDialog(obj: any) {
    const dialogRef = this.dialog.open(PdfviewerdialogComponent, {
      height: '90%',
      width: '100%',
      data: obj,
      disableClose: true,
      panelClass: 'my-dialog',
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
