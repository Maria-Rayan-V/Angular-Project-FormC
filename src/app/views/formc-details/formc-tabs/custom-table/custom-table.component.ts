import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormCDetails } from 'src/app/shared/models/formCModel.model';
import { PendingListModel } from 'src/app/shared/models/formcPendingList.model';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { PdfviewerdialogComponent } from '../../pdfviewerdialog/pdfviewerdialog.component';
import { DeleteConfirmdialogComponent } from '../draft/delete-confirmdialog/delete-confirmdialog.component';
import { ApplicantDetailsComponent } from '../exit-marked/applicant-details/applicant-details.component';
import { CheckoutDialogComponent } from '../pending-for-exit/checkout-dialog/checkout-dialog.component';
import { MedVisaModel } from 'src/app/shared/models/MedVisaModel.model';

@Component({
  selector: 'formc-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent implements OnInit, OnChanges {
  @Input() action: string;
  @Input() tabledata: any;
  @Input() displayedColumns: string[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: MatTableDataSource<PendingListModel>;
  length: any;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15];
  showFirstLastButtons = true;
  pendingFormCDetails: any;
  isExtn: boolean = false;
  pendingMedvisaDts: any;
  constructor(
    private dialog: MatDialog,
    private formcService: FormcServicesService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    console.log('Inside viewinit custom', this.displayedColumns);

    this.dataSource.paginator = this.paginator;
  }
  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.tabledata);

    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPdf(name) {
    console.log('userid', name.form_c_appl_id);

    this.formcService.getPdfReport(name.form_c_appl_id).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      // this.pdfFilePath=fileURL;
      //  window.open(fileURL, '_blank');
      this.OpenDialog(fileURL);
    });
  }
  getMedvisaPdf(name) {
    console.log('userid', name.fileRefno);

    this.formcService.getMedvisaPdf(name.fileRefno).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      // this.pdfFilePath=fileURL;
      //  window.open(fileURL, '_blank');
      this.OpenDialog(fileURL);
    });
  }
  getIndividualPdf(name) {
    console.log('userid', name.form_c_appl_id);

    this.formcService
      .getIndividualFormcPdf(name.form_c_appl_id)
      .subscribe((res) => {
        const fileURL = URL.createObjectURL(res);
        // this.pdfFilePath=fileURL;
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
    });
  }

  deletePendingRecord(data) {
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
    this.dialog.open(DeleteConfirmdialogComponent, dialogConfig);
  }
  deletePendingMedvisa(data) {
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
      isMedvisa: true,
    };
    this.dialog.open(DeleteConfirmdialogComponent, dialogConfig);
  }
  viewDetails(data) {
    console.log('userid', data.form_c_appl_id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.position = {
      top: '0px',
      left: '250px',
      bottom: '250px',
    };

    dialogConfig.panelClass = 'my-dialog';
    dialogConfig.width = '90%';
    dialogConfig.height = '92%';
    dialogConfig.data = {
      userId: data.form_c_appl_id,
    };
    this.dialog.open(ApplicantDetailsComponent, dialogConfig);
  }
  openCheckoutDialog(data) {
    console.log('userid', data.form_c_appl_id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.position = {
      top: '100px',
    };
    dialogConfig.width = '55%';
    dialogConfig.height = '70%';
    dialogConfig.data = {
      userId: data.form_c_appl_id,
      fullData: data,
    };
    (dialogConfig.panelClass = 'my-dialog'),
      this.dialog.open(CheckoutDialogComponent, dialogConfig);
  }
  editRecord(data) {
    this.formcService.getPendingDetailsById(data.form_c_appl_id).subscribe(
      (data: FormCDetails[]) => {
        console.log('inside get appldetails fn');
        this.pendingFormCDetails = data;
        //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
        this.router.navigate(['formc/add-formc-stepper'], {
          state: {
            existingApplication: this.pendingFormCDetails,
            isPending: true,
          },
        });
      },
      (err) => {
        this.snackbar.open('Something went wrong', 'close', {
          duration: snackbarDuration,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
  editMedvisa(data) {
    this.formcService.getPreviewDts(data.fileRefno).subscribe(
      (data: MedVisaModel[]) => {
        console.log('inside get appldetails fn');

        this.pendingMedvisaDts = data;
        console.log(JSON.stringify(this.pendingMedvisaDts, null, 2));
        console.log(
          'medical visa ref no',
          this.pendingMedvisaDts['medVisaRefno']
        );
        // if(this.pendingMedvisaDts['medVisaRefno']!=null && this.pendingMedvisaDts['medVisaRefno']!="")
        // {
        //    this.isExtn==true;
        // }else{
        //   this.isExtn=false;
        // }
        // if(this.pendingMedvisaDts[''])
        this.router.navigate(['medVisa/visa-invitation'], {
          state: {
            existingMedvisaDts: this.pendingMedvisaDts,
            isPending: true,
          },
        });
      },
      (err) => {
        this.snackbar.open('Something went wrong', 'close', {
          duration: snackbarDuration,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
  editMedvisaExtn(data) {
    this.formcService.getPreviewDts(data.fileRefno).subscribe(
      (data: MedVisaModel[]) => {
        console.log('inside get appldetails fn');
        this.pendingMedvisaDts = data;
        console.log(JSON.stringify(this.pendingMedvisaDts, null, 2));
        this.router.navigate(['medVisa/visa-invitation'], {
          state: {
            existingMedvisaDts: this.pendingMedvisaDts,
            isVisExtn: true,
          },
        });
      },
      (err) => {
        this.snackbar.open('Something went wrong', 'close', {
          duration: snackbarDuration,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
}
