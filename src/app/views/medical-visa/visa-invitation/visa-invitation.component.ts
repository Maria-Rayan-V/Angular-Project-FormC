import {
  CURRENT_DATE,
  POST_PATIENT_DETAILS,
  formatPendingDate,
} from './../../../shared/FormCConstants/formcUrlCons';
import { MatSelectModule } from '@angular/material/select';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  MAX_REGN_YR,
  snackbarDuration,
} from 'src/app/shared/FormCConstants/formcUrlCons';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import {
  AttendantModel,
  MedVisaModel,
} from 'src/app/shared/models/MedVisaModel.model';
import {
  CountryModel,
  DistrictModel,
  StateModel,
} from 'src/app/shared/models/masterModels';
import {
  numbers,
  phoneNumber,
  pincode,
} from 'src/app/shared/validationRegex/regexpValidation';
import { OwnerinfodialogComponent } from '../../others/ownerinfodialog/ownerinfodialog.component';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { AttendantDialogComponent } from '../attendant-dialog/attendant-dialog.component';
import { DatePipe } from '@angular/common';
import { Navigation, Route, Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { SubmitconfirmdialogComponent } from '../../formc/stepper-component/submitconfirmdialog/submitconfirmdialog.component';
import { PdfviewerdialogComponent } from '../../formc-details/pdfviewerdialog/pdfviewerdialog.component';
var attendantDetails = [];

@Component({
  selector: 'formc-visa-invitation',
  templateUrl: './visa-invitation.component.html',
  styleUrls: ['./visa-invitation.component.scss'],
})
export class VisaInvitationComponent implements OnInit, OnDestroy {
  @ViewChild('medvisaStepper') private myStepper: MatStepper;
  loading: boolean = false;
  ispreview: boolean = false;
  isRegnNoAvail: boolean = false;
  formGroup: any;
  refnoToDisplay: any;
  hosRegnNum: any;
  maxDate: Date;
  isshowExtn: boolean = false;
  previewpplicantdetails: any;
  tableDataSource: MatTableDataSource<MedVisaModel>;
  @Input() isPreviewCall: boolean = false;
  userRegnDetails: any = [];
  countries: CountryModel[];
  isPending: boolean = false;
  isExisting: boolean = false;
  isExtn: boolean = false;
  states: StateModel[];
  pendingMedvisaDts: MedVisaModel[];
  exitsingMedvisaDts: MedVisaModel[];
  districts: DistrictModel[];
  attendantDetailsSource: any;
  srCount: number = 0;
  attendantDetails: MatTableDataSource<AttendantModel>;
  displayColumn: string[] = [
    'name',
    'address',
    'emailId',
    'phnNum',
    'relationship',
    'action',
  ];
  displayColumns: string[] = [
    'name',
    'address',
    'emailId',
    'phnNum',
    'relationship',
  ];
  successMessage: any;
  constructor(
    public _formBuilder: FormBuilder,
    private masterService: MasterServicesService,
    private ls: LocalStoreService,
    private snackbar: MatSnackBar,
    private router: Router,
    private location: Location,
    private formcService: FormcServicesService,
    private dialog: MatDialog
  ) {
    let nav: Navigation = this.router.getCurrentNavigation();
    if (nav.extras.state)
      if (
        nav.extras.state['existingMedvisaDts'] != null ||
        nav.extras.state['existingApplication'] != null
      ) {
        this.exitsingMedvisaDts = nav.extras.state['existingMedvisaDts'];
        this.isExisting = nav.extras.state['isExisting'];
        this.isPending = nav.extras.state['isPending'];
        this.isExtn = nav.extras.state['isVisExtn'];
        if (
          this.exitsingMedvisaDts['medVisaRefno'] != null &&
          this.exitsingMedvisaDts['medVisaRefno'] != ''
        ) {
          this.isshowExtn = true;
        }

        console.log('inside state---------', this.isPending);

        console.log(
          'state value in patient',
          this.exitsingMedvisaDts['patientState']
        );
        if (this.exitsingMedvisaDts['attendantDetails'] != null) {
          this.attendantDetails = this.exitsingMedvisaDts['attendantDetails'];
          attendantDetails = this.exitsingMedvisaDts['attendantDetails'];
          this.attendantDetailsSource = new MatTableDataSource(
            attendantDetails
          );
          this.srCount = attendantDetails.length;
          console.log('Attendant details in nav', attendantDetails.length);
        }
        // this.attendantDetails=this.exitsingMedvisaDts['attendantDetails'];
        //  this.srCount= attendantDetails['attSrno'];
      }
    this.formGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          fileRefNo: [''],
          medVisaRefno: [''],
          acco_code: [''],
          frro_fro_code: [''],
          entered_by: [''],
          entered_on: [''],
          medvisa_ref_no: [''],
          patientName: ['', Validators.required],
          patientGender: ['', Validators.required],
          patientNationality: ['', Validators.required],
          patientState: ['', Validators.required],
          patientCity: ['', Validators.required],
        }),
        this._formBuilder.group({
          fileRefNo: [''],
          surname: ['', Validators.required],
          dob: ['', Validators.required],
          pptNum: ['', Validators.required],
          addressNative: ['', Validators.required],
          addressIndia: ['', Validators.required],
          pincodeOfPatient: [
            '',
            [Validators.required, Validators.pattern(pincode)],
          ],
          contactNative: ['', Validators.required],
          contactIndia: ['', Validators.required],
          emailId: ['', Validators.required],
          visaNum: [''],
          treatmentTaken: [''],
          startingDate: [''],
        }),
        this._formBuilder.group({
          fileRefNo: [''],
          accoCode: [''],
          frroCode: [''],
          diagnosis: ['', Validators.required],
          doctorName: ['', Validators.required],
          department: ['', Validators.required],
          cost: ['', [Validators.required, Validators.pattern(numbers)]],
          duration: ['', [Validators.required, Validators.pattern(numbers)]],
          treatmentBeingTaken: [''],
          startingDate: [''],
          tentativeDuration: [
            '',
            [Validators.required, Validators.pattern(numbers)],
          ],
          hosRegnNo: ['', Validators.required],
        }),
        this._formBuilder.group({
          attendantDetails: this._formBuilder.array([this.initItemRows()]),
        }),
        //   this._formBuilder.group({

        //     surname:["",Validators.required],
        //     givenName:["",Validators.required],
        //     gender:["",Validators.required]     ,
        //     dob:["",Validators.required],
        //     nationality:["",Validators.required],
        //     pptNum:["",Validators.required],
        //     addressNative:["",Validators.required],
        //     addressIndia:["",Validators.required],
        //     patientState:["",Validators.required],
        //     patientCity:["",Validators.required],
        //     pincodeOfPatient:["",Validators.required],
        //     contactNative:["",Validators.required],
        //     contactIndia:["",Validators.required],
        //     emailId:["",Validators.required],
        //     relationship:["",Validators.required]

        // }),
        // this._formBuilder.group({

        //   regNo:["",Validators.required]

        // })
      ]),
    });
  }

  ngOnDestroy(): void {
    attendantDetails = [];
  }

  parseDate(dateString: any) {
    if (dateString) {
      const [day, month, year] = dateString.split('/');
      dateString = year + '-' + month + '-' + day;
      console.log('original Date', dateString);
      console.log('Date Inside Fn moment', moment(dateString));

      return moment(dateString);
    }
    return null;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      console.log('Existing details', this.exitsingMedvisaDts);

      this.formGroup.patchValue(this.exitsingMedvisaDts);
      if (
        this.exitsingMedvisaDts['dob'] != null &&
        this.exitsingMedvisaDts['dob'] != ''
      ) {
        this.formArray
          .get([1])
          .get('dob')
          .patchValue({
            dob: this.parseDate(this.exitsingMedvisaDts['dob']),
          });
      }
      this.formArray.get([2]).patchValue(this.exitsingMedvisaDts);
      this.formArray.get([1]).patchValue(this.exitsingMedvisaDts);
      this.formArray.get([0]).patchValue(this.exitsingMedvisaDts);
      if (this.exitsingMedvisaDts['patientState']) {
        this.onChangeState(this.exitsingMedvisaDts['patientState']);
        this.formArray.get([0]).patchValue({
          patientCity: this.exitsingMedvisaDts['patientCity'],
        });
      }
      if (this.hosRegnNum != null && this.hosRegnNum != '') {
        console.log(
          'Inside patch start',
          this.formArray.get([2]).get('hosRegnNo').value
        );
        this.isRegnNoAvail = true;
        this.formArray.get([2]).get('hosRegnNo').patchValue(this.hosRegnNum);
        console.log(
          'Inside patch end',
          this.formArray.get([2]).get('hosRegnNo').value
        );
      }
      // this.srCount=this.attendantDetails.length;
    }, 0);
  }
  initItemRows() {
    return this._formBuilder.group({
      fileRefno: [''],
      surname: [''],
      givenName: [''],
      gender: [''],
      dob: [''],
      nationality: [''],
      pptNum: [''],
      addressNative: [''],
      addressIndia: [''],
      attendanttState: [''],
      attendantCity: [''],
      pincodeOfAttendant: [''],
      contactNative: [''],
      contactIndia: [''],
      emailId: [''],
      relationship: [''],
    });
  }
  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }
  ngOnInit(): void {
    this.maxDate = CURRENT_DATE;
    this.masterService.getCountry().subscribe(
      (data: CountryModel[]) => {
        this.countries = data;
        // console.log(JSON.stringify(this.states,null,2))
      },
      (err) => {
        alert(err);
      }
    ),
      this.masterService.getState().subscribe(
        (data: StateModel[]) => {
          this.states = data;
          // console.log(JSON.stringify(this.states,null,2))
        },
        (err) => {
          //  alert(
          //    err
          //  )
        }
      );
    console.log('Type of dob', typeof this.formArray.get([1]).get('dob').value);
    this.hosRegnNum = this.ls.getItem('hosRegnNo');
    console.log('Regn no in init', this.hosRegnNum);
  }
  OpenDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(AttendantDialogComponent, {
      height: 'fit-content',
      width: '650px',

      data: obj,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      switch (action) {
        case 'Add':
          if (result.action == 'Cancel') {
            console.log('Dialog Closed');
          } else {
            console.log('In hotel owner info', result.data.formvalue.givenName);
            // this.addnlplaceofvisit = result.data;
            this.srCount = this.srCount + 1;
            console.log('////////////');
            attendantDetails.push({
              attSrno: attendantDetails.length + 1,
              entered_by: this.ls.getItem('username'),
              fileRefno: this.ls.getItem('medvisaRefno'),
              surname: result.data.formvalue.surname,
              givenName: result.data.formvalue.givenName,
              gender: result.data.formvalue.gender,
              dob: result.data.formvalue.dob,
              nationality: result.data.formvalue.nationality,
              pptNum: result.data.formvalue.pptNum,
              addressNative: result.data.formvalue.addressNative,
              addressIndia: result.data.formvalue.addressIndia,
              attendanttState: result.data.formvalue.attendanttState,
              attendantCity: result.data.formvalue.attendantCity,
              pincodeOfAttendant: result.data.formvalue.pincodeOfAttendant,
              contactNative: result.data.formvalue.contactNative,
              contactIndia: result.data.formvalue.contactIndia,
              emailId: result.data.formvalue.emailId,
              relationship: result.data.formvalue.relationship,
            });
            console.log('Attendant details in push', attendantDetails);
            this.attendantDetailsSource = new MatTableDataSource(
              attendantDetails
            );
          }
          break;
        case 'Delete':
          if (result.action == 'Cancel') {
            console.log('Dialog Closed');
          } else {
            console.log(result);
            let index = attendantDetails.indexOf(result.data);
            attendantDetails.splice(index, 1);
            this.attendantDetailsSource = new MatTableDataSource(
              attendantDetails
            );
          }
          break;
      }
    });
  }

  onChangeState(state_code: any) {
    console.log('districts url called');
    this.masterService
      .getFrroDistrict(this.formArray?.get([0]).get('patientState').value)
      .subscribe(
        (data: DistrictModel[]) => {
          this.districts = data;
          console.log(JSON.stringify(this.districts, null, 2));
        },
        (err) => {}
      );
  }

  genRefId() {
    this.formArray
      .get([0])
      .get('acco_code')
      .setValue(this.ls.getItem('accoCode'));
    this.formArray
      .get([0])
      .get('entered_by')
      .setValue(this.ls.getItem('username'));
    this.formArray
      .get([0])
      .get('frro_fro_code')
      .setValue(this.ls.getItem('frroCode'));
    this.userRegnDetails = this.formGroup.value.formArray[0];
    // this.formArray.get([0]).get('userid').setValue(this.ls.getItem('verifiedUser'));
    if (this.isPending == true) {
      this.formcService.updateRefnoDts(this.userRegnDetails).subscribe(
        (data: any) => {
          this.myStepper.next();

          console.log(JSON.stringify(data, null, 2));
          this.ls.setItem('medvisaRefno', data['fileRefNo']);
          console.log('aft nxt /////////', this.myStepper);
          // Swal.fire(

          //   'Accomodator details saved successfully.','', 'success').then((result)=>{
          //     this.submitForApprovalFun()
          //  });
          // this.snackbar.open('Accomodator details saved successfully', 'X', {
          //   duration: snackbarDuration,
          //   verticalPosition: 'bottom',
          //   panelClass: ['blue-snackbar']
          // });
          // this.router.navigate(["sessions/signin"]);
          this.snackbar.open('Patient details updated successfully', 'X', {
            duration: snackbarDuration,
            verticalPosition: 'top',
            panelClass: ['blue-snackbar'],
          });
        },
        (err) => {
          console.log('Failure');
          this.snackbar.open('Something went wrong', 'X', {
            duration: snackbarDuration,
          });
          //  alert(
          //    err
          //  )
        }
      );
    }
    if (this.isExtn == true) {
      this.formcService.postMedExtnRefno(this.userRegnDetails).subscribe(
        (data: any) => {
          this.myStepper.next();

          console.log(JSON.stringify(data, null, 2));
          this.ls.setItem('medvisaRefno', data['fileRefNo']);
          console.log('aft nxt /////////', this.myStepper);
          // Swal.fire(

          //   'Accomodator details saved successfully.','', 'success').then((result)=>{
          //     this.submitForApprovalFun()
          //  });
          // this.snackbar.open('Accomodator details saved successfully', 'X', {
          //   duration: snackbarDuration,
          //   verticalPosition: 'bottom',
          //   panelClass: ['blue-snackbar']
          // });
          // this.router.navigate(["sessions/signin"]);
          this.snackbar.open('Reference number generated successfully', 'X', {
            duration: snackbarDuration,
            verticalPosition: 'top',
            panelClass: ['blue-snackbar'],
          });
        },
        (err) => {
          console.log('Failure');
          this.snackbar.open('Something went wrong', 'X', {
            duration: snackbarDuration,
          });
          //  alert(
          //    err
          //  )
        }
      );
    }
    if (this.isExtn == false && this.isPending == false) {
      this.formcService.generateMedvisaRefno(this.userRegnDetails).subscribe(
        (data: any) => {
          this.myStepper.next();
          this.isPreviewCall = true;
          console.log(JSON.stringify(data, null, 2));
          this.ls.setItem('medvisaRefno', data['fileRefNo']);
          console.log('aft nxt /////////', this.myStepper);
          // Swal.fire(

          //   'Accomodator details saved successfully.','', 'success').then((result)=>{
          //     this.submitForApprovalFun()
          //  });
          // this.snackbar.open('Accomodator details saved successfully', 'X', {
          //   duration: snackbarDuration,
          //   verticalPosition: 'bottom',
          //   panelClass: ['blue-snackbar']
          // });
          // this.router.navigate(["sessions/signin"]);
          this.snackbar.open('Reference number generated successfully', 'X', {
            duration: snackbarDuration,
            verticalPosition: 'top',
            panelClass: ['blue-snackbar'],
          });
        },
        (err) => {
          console.log('Failure');
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

  submitPatientDts() {
    // let dobAfterTransform = new DatePipe('en-Us').transform(
    this.formArray.get([1]).value.dob = formatPendingDate(
      this.formArray.get([1]).value.dob,
      'dd/MM/YYYY'
    );
    if (
      this.formArray.get([1]).value.startingDate != null &&
      this.formArray.get([1]).value.startingDate != ''
    ) {
      this.formArray.get([1]).value.startingDate = formatPendingDate(
        this.formArray.get([1]).value.startingDate,
        'dd/MM/YYYY'
      );
    }
    this.formArray.get([1]).value.fileRefNo = this.ls.getItem('medvisaRefno');

    this.userRegnDetails = { ...this.formGroup.value.formArray[1] };
    console.log('In userRegnDetails', this.userRegnDetails);

    this.formcService.postPatientDts(this.userRegnDetails).subscribe(
      (data: any) => {
        console.log('before stepper next-------');
        this.myStepper.next();
        console.log('After stepper next-------');
        console.log(JSON.stringify(data, null, 2));
      },
      (err) => {
        console.log('Failure');
        this.snackbar.open('Something went wrong', 'X', {
          duration: snackbarDuration,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
  submitTreatmentDts() {
    this.formArray.get([2]).value.fileRefNo = this.ls.getItem('medvisaRefno');
    this.formArray
      .get([2])
      .get('accoCode')
      .setValue(this.ls.getItem('accoCode'));

    this.formArray
      .get([2])
      .get('frroCode')
      .setValue(this.ls.getItem('frroCode'));

    this.userRegnDetails = { ...this.formGroup.value.formArray[2] };
    console.log('In userRegnDetails', this.userRegnDetails);

    this.formcService.postTreatmentDts(this.userRegnDetails).subscribe(
      (data: any) => {
        this.ls.setItem('hosRegnNo', this.formArray.get([2]).value.hosRegnNo);
        this.myStepper.next();
        console.log(JSON.stringify(data, null, 2));
      },
      (err) => {
        console.log('Failure');
        this.snackbar.open('Something went wrong', 'X', {
          duration: snackbarDuration,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
  onChangeStepper(event: any) {
    console.log('/hgfcnxjifrdhtuuuuuuuuuuuuuuuuuu', event.selectedIndex);
    if (event.selectedIndex == 2) {
      console.log('medical visa ref', this.ls.getItem('medvisaRefno'));
      this.refnoToDisplay = this.ls.getItem('medvisaRefno');
      console.log('Ref no', this.refnoToDisplay);
    }
    // if(event.selectedIndex==4)
    // {

    //   this.previewpplicantdetails=  {... this.formGroup.value.formArray[0],... this.formGroup.value.formArray[1] ,... this.formGroup.value.formArray[2],attendantDetails};
    //    console.log('preview applicant dts',this.previewpplicantdetails);
    //   //  console.log('0 index',this.previewpplicantdetails[0]);
    // }
  }
  submitAttendantDts() {
    if (attendantDetails.length > 0) {
      this.formArray.get([2]).value.fileRefNo = this.ls.getItem('medvisaRefno');
      this.previewpplicantdetails = {
        ...this.formGroup.value.formArray[0],
        ...this.formGroup.value.formArray[1],
        ...this.formGroup.value.formArray[2],
        attendantDetails,
      };
      console.log(
        'preview applicant dts',
        this.previewpplicantdetails['surname']
      );
      this.userRegnDetails = {
        ...this.formGroup.value.formArray[1],
        ...this.formGroup.value.formArray[2],
        attendantDetails,
      };
      console.log('In userRegnDetails', this.userRegnDetails);
      this.formcService.postAttendantDts(this.userRegnDetails).subscribe(
        (data: any) => {
          this.myStepper.next();
          console.log(JSON.stringify(data, null, 2));
        },
        (err) => {
          console.log('Failure');
          this.snackbar.open('Something went wrong', 'X', {
            duration: snackbarDuration,
          });
          //  alert(
          //    err
          //  )
        }
      );
    } else {
      this.snackbar.open('Add atleast one attendant detail', 'X', {
        duration: snackbarDuration,
      });
    }
  }
  getPdfForMedvisa() {
    console.log('userid', this.ls.getItem('medvisaRefno'));

    // this.router.navigate(["sessions/formc-signin"]);
    this.formcService
      .getMedvisaPdf(this.ls.getItem('medvisaRefno'))
      .subscribe((res) => {
        const fileURL = URL.createObjectURL(res);
        // this.pdfFilePath=fileURL;
        //  window.open(fileURL, '_blank');
        // this.router.navigate(["regn/regn-home"]);
        this.OpenPdfDialog(fileURL);
      });
  }
  OpenPdfDialog(obj: any) {
    const dialogRef = this.dialog.open(PdfviewerdialogComponent, {
      height: '90%',
      width: '100%',
      data: obj,
      disableClose: true,
    });
  }

  submitFunc() {
    // let dobAfterTransform = new DatePipe('en-Us').transform(

    if (attendantDetails.length > 0) {
      this.formArray.get([1]).value.dob = formatPendingDate(
        this.formArray.get([1]).value.dob,
        'dd/MM/YYYY'
      );

      this.formArray.get([1]).value.fileRefNo = this.ls.getItem('medvisaRefno');

      this.userRegnDetails = {
        ...this.formGroup.value.formArray[1],
        ...this.formGroup.value.formArray[2],
        ...this.attendantDetails,
      };
      console.log('In userRegnDetails', this.userRegnDetails);
      this.formcService.postMedvisaDts(this.userRegnDetails).subscribe(
        (data: any) => {
          this.myStepper.next();
          console.log(JSON.stringify(data, null, 2));
        },
        (err) => {
          console.log('Failure');
          this.snackbar.open('Something went wrong', 'X', {
            duration: snackbarDuration,
          });
          //  alert(
          //    err
          //  )
        }
      );
    } else {
      this.snackbar.open('Add atleast one attendant detail', 'X', {
        duration: snackbarDuration,
      });
    }
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
      isMedvisa: true,
      fileRefno: this.ls.getItem('medvisaRefno'),
    };
    (dialogConfig.panelClass = 'my-dialog'),
      this.dialog.open(SubmitconfirmdialogComponent, dialogConfig);
  }
  onCancelClicked() {
    this.location.back();
  }
  finalSubmit() {
    this.loading = true;
    if (this.isExtn == true || this.isshowExtn == true) {
      this.formcService
        .finalSubmitMedvisaExtn(this.ls.getItem('medvisaRefno'))
        .subscribe(
          (data: any) => {
            console.log('data in final submit ', data);
            this.loading = false;
            this.successMessage = data;
            Swal.fire({
              title: this.successMessage,
              icon: 'success',
              showConfirmButton: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              this.getPdfForMedvisa();
              this.router.navigate(['medVisa/draft-medvisa']);
            });

            console.log('success');

            //  this.length = this.pendingFormCList.length;

            //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
          },
          (err) => {
            this.loading = false;
            this.snackbar.open('Something went wrong', '', {
              duration: snackbarDuration,
            });
            //  alert(
            //    err
            //  )
          }
        );
    } else {
      this.formcService
        .finalSubmitMedvisa(this.ls.getItem('medvisaRefno'))
        .subscribe(
          (data: any) => {
            console.log('data in final submit ', data);
            this.loading = false;
            this.successMessage = data;
            Swal.fire({
              title: this.successMessage,
              icon: 'success',
              showConfirmButton: true,
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              this.getPdfForMedvisa();
              this.router.navigate(['medVisa/draft-medvisa']);
            });

            console.log('success');

            //  this.length = this.pendingFormCList.length;

            //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
          },
          (err) => {
            this.loading = false;
            this.snackbar.open('Something went wrong', '', {
              duration: snackbarDuration,
            });
            //  alert(
            //    err
            //  )
          }
        );
    }
  }
  previewDtsFn() {
    let fileRefno = this.ls.getItem('medvisaRefno');
    this.formcService.getPreviewDts(fileRefno).subscribe({
      next: (data: MedVisaModel[]) => {
        console.log('inside get appldetails fn');
        this.previewpplicantdetails = data;
        this.ispreview = true;
      },
      error: (err) => {
        this.snackbar.open('Something went wrong', 'close', {
          duration: snackbarDuration,
        });
      },
      complete: () => {
        console.log('preview dets', this.previewpplicantdetails);
        console.log(
          '--------------------------------------------------------- pending medvisa by id completed-------------------------------------------'
        );
      },
    });
  }
}
