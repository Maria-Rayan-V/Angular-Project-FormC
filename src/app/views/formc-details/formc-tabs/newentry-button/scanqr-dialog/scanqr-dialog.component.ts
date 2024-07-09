import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormcTabsComponent } from '../../formc-tabs.component';
import { Router } from '@angular/router';

@Component({
  selector: 'formc-scanqr-dialog',
  templateUrl: './scanqr-dialog.component.html',
  styleUrls: ['./scanqr-dialog.component.scss'],
})
export class ScanqrDialogComponent implements OnInit {
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<FormcTabsComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {}

  ngOnInit(): void {}
  output: string;
  splitOutput: any;
  givenName: string;
  // @ViewChild('action', { static: true }) action: NgxScannerQrcodeComponent;
  // TODO something this.action

  public onError(e): void {
    alert(e);
  }
  dataFromQR(e) {
    this.output = e;
    //   this.splitOutput=this.output.split('\n',10);
    // this.givenName=  this.splitOutput[0].slice(12).split('<<');
    //   console.log('split output',this.splitOutput,this.splitOutput[0].slice(0,12));

    let jsonFromQr = JSON.parse(this.output);
    console.log('qr output', jsonFromQr);
    console.log('First name in qr', jsonFromQr['first_name']);
    if (this.output != null) {
      this.dialogRef.close();
      this.router.navigate(['formc/add-formc-stepper'], {
        state: {
          qrDetails: jsonFromQr,
          isFromQr: true,
        },
      });
    }
  }
  dialogClose() {
    this.dialogRef.close();
  }
}
