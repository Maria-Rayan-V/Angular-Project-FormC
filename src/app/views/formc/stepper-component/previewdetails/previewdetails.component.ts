import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormCDetails } from 'src/app/shared/models/formCModel.model';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { SubmitconfirmdialogComponent } from '../submitconfirmdialog/submitconfirmdialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'formc-previewdetails',
  templateUrl: './previewdetails.component.html',
  styleUrls: ['./previewdetails.component.scss'],
})
export class PreviewdetailsComponent implements OnInit, OnChanges {
  @Input() randomNumberFromParent: any;
  formcApplicantdetails: FormCDetails[];
  imageSource: any;
  loading: boolean = false;
  previewDetailsForm: any;
  successMessage: any;
  tableDataSource: MatTableDataSource<FormCDetails>;
  VisaColumns: string[] = [
    'visanum',
    'visaplace',
    'visacounDesc',
    'visadate',
    'visaexpdate',
    'visatypeDesc',
  ];
  PassportCols: string[] = [
    'passnum',
    'passplace',
    'passcounDesc',
    'passdate',
    'passexpdate',
  ];
  ArrivalCols: string[] = [
    'arriplace',
    'arricit',
    'arricounDesc',
    'arridateind',
    'arridatehotel',
    'arritimehotel',
    'durationofstay',
  ];
  NxtDestCols: string[] = [
    'nextdestplaceinind',
    'nextdestdistinindDesc',
    'nextdeststateinindDesc',
    'nextdestplaceoutind',
    'nextdestcityoutind',
    'nextdestcounoutindDesc',
  ];
  contactCols: string[] = ['mblnuminind', 'phnnuminind', 'mblnum', 'phnnum'];
  othersCols: string[] = [
    'employedinind',
    'splcategorycodeDesc',
    'purposeofvisitDesc',
  ];
  constructor(
    private formcService: FormcServicesService,
    private ls: LocalStoreService,
    private snackbar: MatSnackBar,
    private formbuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.previewDetailsForm = formbuilder.group({
      confirmDetails: ['', Validators.required],
    });
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    console.log('Random Number from pare', this.randomNumberFromParent);
    if (this.randomNumberFromParent != null) {
      let applicationId = this.ls.getItem('formCApplid');
      this.formcService.getPendingDetailsById(applicationId).subscribe(
        (data: FormCDetails[]) => {
          this.formcApplicantdetails = data;
          console.log('appli details', this.formcApplicantdetails);

          this.imageSource =
            'data:image/jpeg;base64,' + this.formcApplicantdetails[0]['img'];
          this.tableDataSource = new MatTableDataSource(
            this.formcApplicantdetails
          );
          //  this.length = this.pendingFormCList.length;

          //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
        },
        (err) => {
          this.snackbar.open('Something went wrong', 'X', {
            duration: snackbarDuration,
          });
          //  alert(
          //    err
          //  )
        }
      );
    }
  }

  ngOnInit(): void {}
  onCancelClicked() {
    this.router.navigate(['formc-details']);
  }

  openConfirmationDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.position = {
      top: '300px',
    };
    dialogConfig.width = '500px';
    dialogConfig.height = '150px';
    dialogConfig.data = {
      userId: this.ls.getItem('formCApplid'),
    };
    (dialogConfig.panelClass = 'my-dialog'),
      this.dialog.open(SubmitconfirmdialogComponent, dialogConfig);
  }
}
