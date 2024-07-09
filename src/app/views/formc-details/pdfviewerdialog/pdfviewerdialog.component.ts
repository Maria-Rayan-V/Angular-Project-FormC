import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { CustomTableComponent } from '../formc-tabs/custom-table/custom-table.component';

@Component({
  selector: 'formc-pdfviewerdialog',
  templateUrl: './pdfviewerdialog.component.html',
  styleUrls: ['./pdfviewerdialog.component.scss'],
})
export class PdfviewerdialogComponent implements OnInit {
  fileUrl: any;
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CustomTableComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.fileUrl = data;
    console.log('Fileurl', this.fileUrl);
  }

  ngOnInit(): void {}
  dialogClose() {
    this.dialogRef.close();
  }
}
