import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, Navigation } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, ReplaySubject } from 'rxjs';
import {
  MAX_REGN_YR,
  snackbarDuration,
} from 'src/app/shared/FormCConstants/formcUrlCons';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import { OwnerDetail } from 'src/app/shared/models/AccommodatorModel.model';
import {
  StateModel,
  FrroListModel,
  DistrictModel,
  AccoGradeModel,
  AccoTypeModel,
  CountryModel,
} from 'src/app/shared/models/masterModels';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { RegnNavService } from 'src/app/shared/services/regnNav.service';
import {
  phoneNumber,
  alphabetsSpaceDot,
  numbers,
  emailValidation,
} from 'src/app/shared/validationRegex/regexpValidation';
import { SubmitConfirmationComponent } from 'src/app/views/accommodator-module/submit-confirmation/submit-confirmation.component';
import { PdfviewerdialogComponent } from 'src/app/views/formc-details/pdfviewerdialog/pdfviewerdialog.component';
import { OwnerinfodialogComponent } from 'src/app/views/others/ownerinfodialog/ownerinfodialog.component';
import Swal from 'sweetalert2';
var ownerDetails = [];
export interface PeriodicElement {
  documents: string;
  docId: number;

  // position: number;
  // weight: number;
  // symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { documents: 'Identity Proof', docId: 1 },
  { documents: 'Address Proof', docId: 2 },
];
@Component({
  selector: 'formc-ihstepper',
  templateUrl: './ihstepper.component.html',
  styleUrls: ['./ihstepper.component.scss'],
})
export class IHStepperComponent implements OnInit {
  displayedColumns1: string[] = ['documents', 'upload', 'status', 'view'];
  dataSource = ELEMENT_DATA;
  @ViewChild('IHStepper') private myStepper: MatStepper;
  isFromEditAccoProf: boolean = false;
  loading: boolean = false;
  showFlag: boolean = false;
  base64DocString: string;
  maxDate: Date;
  previewCaptcha: string;
  formcCaptcha: any;
  uploadStatus: boolean[] = [false, false, false];
  formGroup: any;
  ownerDetailForm: any;
  ownerDetailsSource: any;
  displayColumn: string[] = [
    'name',
    'address',
    'state',
    'city',
    'emailId',
    'phnNum',
    'mblNum',
    'action',
  ];
  states: StateModel[];
  frroList: FrroListModel[];
  districts: DistrictModel[];
  accoGradeList: AccoGradeModel[];
  accoTypeList: AccoTypeModel[];
  countries: CountryModel[];
  userRegnDetails: any = [];
  isSubmitDisabled: boolean;
  isAddDisabled: boolean;
  isPdfDisabled: boolean;
  userIdtoSubmit: any;
  accoCode: string;
  userName: string;
  isIHRegn: boolean = false;
  userId: string;
  hide = true;
  frroCode: string;
  accommodatorDetails: any;
  docDetails: any;
  ownerDetails: MatTableDataSource<OwnerDetail>;
  constructor(
    public activatedRoute: ActivatedRoute,
    public _formBuilder: FormBuilder,
    public dialog: MatDialog,
    public jwtAuth: JwtAuthService,
    private regnNav: RegnNavService,
    private router: Router,
    private ls: LocalStoreService,
    private snackbar: MatSnackBar,
    private masterService: MasterServicesService,
    private formcService: FormcServicesService
  ) {
    let nav: Navigation = this.router.getCurrentNavigation();
    this.formGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([
        // this._formBuilder.group({
        //   // securityQues: ["", [Validators.required]],
        //   // answer: [""],
        //   // name: ["", Validators.required],
        //   gender: ["", Validators.required],
        //   dob: ["", Validators.required],
        //   designation: ["", Validators.required],
        //   // emailId: ["", [Validators.required, Validators.pattern(alphaNumSpaceSpecial)]],
        //   // mobile: ["", [Validators.required, Validators.pattern(alphabetsSpaceDot)]],
        //   // phnNum: ["", Validators.required],
        //   nationality: ["", Validators.required]

        // }),
        this._formBuilder.group({
          userid: [''],
          gender: ['', [Validators.required]],
          dob: ['', [Validators.required]],
          designation: ['', [Validators.required]],
          phoneNo: ['', [Validators.required, Validators.pattern(phoneNumber)]],
          nationality: ['', [Validators.required]],
        }),

        this._formBuilder.group({
          userId: [''],
          accomName: [
            '',
            [Validators.required, Validators.pattern(alphabetsSpaceDot)],
          ],
          accomCapacity: [
            '',
            [Validators.required, Validators.pattern(numbers)],
          ],
          accomAddress: ['', Validators.required],
          accomState: ['', Validators.required],
          accomCityDist: ['', Validators.required],
          frroTypeCode: ['', Validators.required],
          accomodationType: ['IH'],
          accomodationGrade: ['5s'],
          accomMobile: ['', [Validators.required, Validators.pattern(numbers)]],
          accomPhoneNum: [
            '',
            [Validators.required, Validators.pattern(phoneNumber)],
          ],
          accomEmail: [
            '',
            [Validators.required, Validators.pattern(emailValidation)],
          ],
        }),
        this._formBuilder.group({
          ownerDetails: this._formBuilder.array([this.initItemRows()]),
        }),
        this._formBuilder.group({
          username: [''],
        }),
      ]),
    });
    if (nav.extras && nav.extras.state && nav.extras.state['userId'] != null) {
      console.log('Inside Stepper nav with data', nav.extras.state['userId']);
      this.ls.setItem('verifiedUser', nav.extras.state['userId']);
      this.isIHRegn = nav.extras.state['isIHRegn'];
    }
  }
  getDocument(docsId: string) {
    this.formcService
      .getDocuments(this.ls.getItem('verifiedUser'), docsId)
      .subscribe(
        (data: []) => {
          console.log('Received data', data['fileData']);
          console.log('Converted Pdf ', atob(data['fileData']));
          var pdfStr = atob(data['fileData']);

          const fileURL = 'data:application/pdf;base64,' + pdfStr;

          this.OpenPdfDialog(fileURL);
        },
        (err) => {
          this.snackbar.open('Something went wrong');
        }
      );
  }

  uploadDoc(docEvent: any, docsId: any) {
    console.log('Photo Event', docEvent.target.files);
    this.convertFile(docEvent.target.files[0]).subscribe((base64) => {
      this.base64DocString = base64;
      var data = JSON.stringify({
        userid: this.ls.getItem('verifiedUser'),
        pdfString: this.base64DocString,
        docType: docsId,
        entered_by: 'formcindividualhouse',
      });
      this.formcService.documentUpload(data).subscribe(
        (data: any) => {
          console.log('data in final submit ', data);
          this.loading = false;

          Swal.fire({
            title: 'Uploaded Succesfully',
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            this.uploadStatus[docsId] = true;
          });

          console.log('success');

          //  this.length = this.pendingFormCList.length;

          //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
        },
        (err) => {
          this.loading = false;
          this.snackbar.open('Failed to upload document', '', {
            duration: snackbarDuration,
          });
          //  alert(
          //    err
          //  )
        }
      );
      console.log('Base64 String', this.base64DocString);
    });
  }
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }
  initItemRows() {
    return this._formBuilder.group({
      name: [''],
      address: [''],
      state: [''],
      cityDist: [''],
      emailId: [''],
      phoneNum: [''],
      mobile: [''],
    });
  }
  formCSignin() {
    // this.ls.setItem('salt',null);
    // this.ls.setItem('captcha',null);
    this.previewCaptcha = null;
    this.loading = true;
    const signinData = this.formArray?.get([3]).value;
    if (signinData.username != null && signinData.username != '') {
      this.jwtAuth.getSalt(signinData.username).subscribe(
        (data: any) => {
          this.loading = false;
          console.log(JSON.stringify(data, null, 2));
          console.log('Success' + data['salt']);

          //  this.ls.setItem('captcha',data['captcha']);

          if (data['salt'] != null && data['salt'] != '') {
            this.ls.setItem('username', signinData.username);
            this.ls.setItem('salt', data['salt']);
            this.formcCaptcha = data['captcha'];

            this.previewCaptcha = 'data:image/jpeg;base64,' + this.formcCaptcha;
            //  this.router.navigate(["sessions/formc-signin"]);
          } else {
            this.snackbar.open('Invalid Credentials', 'X', {
              duration: snackbarDuration,
              panelClass: ['error-snackbar'],
            });
          }
        },
        (err) => {
          this.loading = false;
          console.log('Failure', err);
          // this.signinForm.reset();
          this.snackbar.open('Please wait for sometime and retry', 'X', {
            duration: snackbarDuration,
            panelClass: ['error-snackbar'],
          });
          //  alert(
          //    err
          //  )
        }
      );
    } else {
      alert('Enter Username');
    }
  }
  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }
  displayedColumns: string[] = [
    'name',
    'address',
    'state',
    'cityDist',
    'emailId',
    'phoneNum',
    'mobile',
  ];
  ngOnInit() {
    this.userName = this.ls.getItem('username');
    // console.log('formgrp value',this.formGroup.get('formArray'));
    this.maxDate = MAX_REGN_YR;
    //   this.activatedRoute.data.subscribe( (data) => {0
    //     this.isFromEditAccoProf = data['isFromEditAccoProfile'];
    //        console.log('edit profile',this.isFromEditAccoProf);
    // });
    //   if(this.isFromEditAccoProf==true)
    //   {
    //     //call pending fn here
    //   }
    //   if(this.ls.getItem('accoCodeForRegn')!=null)
    //   {
    // this.accoCode=this.ls.getItem('accoCodeForRegn');
    // this.  userId=this.ls.getItem('verifiedUser');
    // this.frroCode=this.ls.getItem('frroCodeRegn');
    //   }
    this.userId = this.ls.getItem('username');
    // if(this.isIHRegn==false)
    // {
    //   this.formGroup.formArray?.get([1]).addControl('accomodationType', this._formBuilder.control('', [Validators.required]));
    //   this.formGroup.formArray?.get([1]).addControl('accomodationGrade', this._formBuilder.control('', [Validators.required]));

    // }else{
    //   this.formGroup.formArray?.get([1]).removeControl('accomodationType');
    //   this.formGroup.formArray?.get([1]).removeControl('accomodationGrade');
    // }
    if (this.ls.getItem('isRegAppFinalSubmit') == 'Y') {
      // this.isAddDisabled=true;
      this.regnNav.editisAddDisabled(true);
    } else {
      this.regnNav.editisAddDisabled(false);
    }
    if (this.ls.getItem('accoCode') != null) {
      this.regnNav.editaccoCodeRegn(this.ls.getItem('accoCode'));
      this.regnNav.editfrroCodeRegn(this.ls.getItem('frroCode'));
    }
    this.regnNav.castaccoCodeRegn.subscribe(
      (accoCode) => (this.accoCode = accoCode)
    );
    this.regnNav.castfrroCodeRegn.subscribe(
      (frroCode) => (this.frroCode = frroCode)
    );
    console.log('acco code in add', this.accoCode);
    if (this.accoCode != null && this.accoCode != '') {
      this.formcService
        .getAccomodatorDetails(this.accoCode, this.frroCode, this.userId)
        .subscribe(
          (data: any) => {
            this.accommodatorDetails = data;
            console.log('Doc details', this.accommodatorDetails['docDetails']);
            this.docDetails = this.accommodatorDetails['docDetails'];
            if (
              this.docDetails[0]['pdfData'] != null &&
              this.docDetails[0]['pdfData'] != ''
            ) {
              this.uploadStatus[1] = true;
            }
            if (
              this.docDetails[1]['pdfData'] != null &&
              this.docDetails[1]['pdfData'] != ''
            ) {
              this.uploadStatus[2] = true;
            }
            this.ownerDetails = this.accommodatorDetails['ownerDetails'];
            ownerDetails = data['ownerDetails'];
            this.ownerDetailsSource = new MatTableDataSource(ownerDetails);
            console.log('Inside edit stepper acco', data['ownerDetails']);
            this.formGroup.get('formArray').controls[1].patchValue(data);
            this.formGroup.get('formArray').controls[0].patchValue(data);

            //this.formGroup.get('formArray').value[0]=data;

            //this.formGroup.get('formArray').value[1].patchValue(data);
            // this.formGroup.get('formArray').value[0].patchValue(data);
            console.log('state ', data['accomState']);

            if (data['accomState'] && data['accomCityDist']) {
              this.onChangedCity();

              this.formGroup.patchValue({
                accomCityDist: data['frroTypeCode'],
              });
            }
            if (data['accomState']) {
              this.onChangeState(data['accomState']);
              this.formGroup.patchValue({
                accomCityDist: data['accomCityDist'],
              });
            }
          },
          (err) => {}
        );
    }
    this.masterService.getCountry().subscribe(
      (data: CountryModel[]) => {
        this.countries = data;
        // console.log(JSON.stringify(this.states,null,2))
      },
      (err) => {
        alert(err);
      }
    ),
      this.masterService.getAccoGrade().subscribe(
        (data: AccoGradeModel[]) => {
          this.accoGradeList = data;
          // console.log(JSON.stringify(this.states,null,2))
        },
        (err) => {
          alert(err);
        }
      ),
      this.masterService.getAccoType().subscribe(
        (data: AccoTypeModel[]) => {
          this.accoTypeList = data;
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
    this.regnNav.castaccoDetails.subscribe(
      (accoDetails) => (this.accommodatorDetails = accoDetails)
    );
    this.regnNav.castisSubmitDisabled.subscribe(
      (isSubmitDisabled) => (this.isSubmitDisabled = isSubmitDisabled)
    );
    this.regnNav.castisAddDisabled.subscribe(
      (isAddDisabled) => (this.isAddDisabled = isAddDisabled)
    );
    this.regnNav.castisPdfDisabled.subscribe(
      (isPdfDisabled) => (this.isPdfDisabled = isPdfDisabled)
    );
  }

  onChangeState(state_code: any) {
    console.log('districts url called');
    this.masterService
      .getFrroDistrict(this.formArray?.get([1]).get('accomState').value)
      .subscribe(
        (data: DistrictModel[]) => {
          this.districts = data;
          console.log(JSON.stringify(this.districts, null, 2));
        },
        (err) => {}
      );
  }
  onChangedCity() {
    console.log(
      'frro url called',
      this.formArray?.get([1]).get('accomState').value
    );
    this.masterService
      .getFrroList(
        this.formArray?.get([1]).get('accomState').value,
        this.formArray?.get([1]).get('accomCityDist').value
      )
      .subscribe(
        (data: FrroListModel[]) => {
          this.frroList = data;
          console.log(JSON.stringify(this.frroList, null, 2));
        },
        (err) => {}
      );
  }
  OpenDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OwnerinfodialogComponent, {
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
            console.log('In hotel owner info', result.data.formvalue.name);
            // this.addnlplaceofvisit = result.data;
            ownerDetails.push({
              name: result.data.formvalue.name,
              address: result.data.formvalue.address,
              state: result.data.formvalue.state,
              cityDist: result.data.formvalue.city,
              phoneNum: result.data.formvalue.phoneNum,
              mobile: result.data.formvalue.mobile,
              emailId: result.data.formvalue.emailId,
              stateDesc: result.data.stateDesc,
              cityDesc: result.data.cityDesc,
            });
            this.ownerDetailsSource = new MatTableDataSource(ownerDetails);
          }
          break;
        case 'Delete':
          if (result.action == 'Cancel') {
            console.log('Dialog Closed');
          } else {
            console.log(result);
            let index = ownerDetails.indexOf(result.data);
            ownerDetails.splice(index, 1);
            this.ownerDetailsSource = new MatTableDataSource(ownerDetails);
          }
          break;
      }
    });
  }

  submitFunc() {
    // let dobAfterTransform = new DatePipe('en-Us').transform(
    // this.formArray?.get([0]).get('dob').value,
    //   'dd/MM/yyyy'
    // );
    //    console.log('Transformed date',dobAfterTransform);
    //    this.formArray.get([0]).get('dob').setValue(dobAfterTransform) ;
    console.log('inside submit acco fn');
    console.log('//////////');
    if (ownerDetails.length > 0) {
      if (!this.isAddDisabled) {
        this.formArray
          .get([1])
          .get('userId')
          .setValue(this.ls.getItem('verifiedUser'));
        console.log(
          'Registered user',
          this.formArray.get([1]).get('userId').value
        );
        if (this.isIHRegn) {
          this.formArray.get([1]).get('accomodationType').setValue('IH');
          this.formArray.get([1]).get('accomodationGrade').setValue('5s');
        }
        this.userRegnDetails = {
          ...this.formGroup.value.formArray[1],
          ownerDetails,
        };
        console.log('In userRegnDetails', this.userRegnDetails);
        this.formcService.postAccomDetails(this.userRegnDetails).subscribe(
          (data: any) => {
            this.loading = false;
            console.log('loading aft', this.loading);
            if (data['frro_fro_code'] != null && data['frro_fro_code'] != '') {
              // this.ls.setItem('accoCodeForRegn',data['acco_code']);
              // this.ls.setItem('frroCodeRegn',data['frro_fro_code']);
              this.regnNav.editaccoCodeRegn(data['acco_code']);
              this.regnNav.editfrroCodeRegn(data['frro_fro_code']);
              this.formcService
                .getAccomodatorDetails(
                  this.accoCode,
                  this.frroCode,
                  this.userId
                )
                .subscribe(
                  (data: any) => {
                    this.accommodatorDetails = data;
                    this.regnNav.editaccoDetails(this.accommodatorDetails);
                    this.ownerDetails =
                      this.accommodatorDetails['ownerDetails'];
                    console.log('Acco details in nav', this.ownerDetails[0]);
                  },
                  (err) => {}
                );
              console.log(
                'data in post accom frro ',
                data['frro_fro_code'],
                this.accoCode
              );
            }
            this.myStepper.next();
            console.log(JSON.stringify(data, null, 2));
            // Swal.fire({
            //   title:"Form C",
            //   text: 'Accomodator details saved/updated successfully',

            //   icon: 'success',
            //   showConfirmButton: true,
            //   allowOutsideClick: false,
            //   allowEscapeKey: false
            // }).then((result)=>{
            //   this.isSubmitDisabled=false;
            //  this.editSubmitDisable(this.isSubmitDisabled);
            //  this.router.navigate(["regn/regn-home"]);
            //   // this.submitForApprovalFun()
            // });
            // Swal.fire(

            //   'Accomodator details saved successfully.','', 'success').then((result)=>{
            //     this.submitForApprovalFun()
            //  });
            // this.snackbar.open('Accomodator details saved successfully', 'X', {
            //   duration: snackbarDuration,0
            //   verticalPosition: 'bottom',
            //   panelClass: ['blue-snackbar']
            // });
            // this.router.navigate(["sessions/signin"]);
          },
          (err) => {
            this.loading = false;
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
        this.snackbar.open('Application already submitted for approval', 'X', {
          duration: snackbarDuration,
          verticalPosition: 'top',
          panelClass: ['blue-snackbar'],
        });
        this.myStepper.next();
      }
    } else {
      this.snackbar.open('Add atleast one owner detail', 'X', {
        duration: snackbarDuration,
      });
    }
    //      for(let i=0;i< this.formGroup.value.formArray.length;i++){
    //          console.log('length', this.formGroup.value.formArray.length);
    //    console.log(this.formGroup.value.formArray[i]);
    //          this.b=
    //          {... this.formGroup.value.formArray[0] , ... this.formGroup.value.formArray[1],ownerDetails};
    //         console.log('in b',this.b);
    // }
  }
  editSubmitDisable(isSubmitDisabled: boolean) {
    this.regnNav.editisSubmitDisabled(isSubmitDisabled);
  }
  submitUserProfile() {
    // let dobAfterTransform = new DatePipe('en-Us').transform(
    // this.formArray?.get([0]).get('dob').value,
    //   'dd/MM/yyyy'
    // );
    //    console.log('Transformed date',dobAfterTransform);
    //    this.formArray.get([0]).get('dob').setValue(dobAfterTransform) ;
    console.log('inside submit prof fn');

    this.formArray
      .get([0])
      .get('userid')
      .setValue(this.ls.getItem('verifiedUser'));
    let dobFormatedDate = new DatePipe('en-Us').transform(
      this.formArray.get([0]).value.dob,
      'dd/MM/yyyy'
    );
    this.formArray.get([0]).value.dob = dobFormatedDate;
    //  console.log('Registered user', this.formArray.get([0]).get('userId').value);
    this.userRegnDetails = this.formGroup.value.formArray[0];

    console.log('In userRegnDetails', this.userRegnDetails);

    console.log('FormArray valid', this.myStepper.color);
    if (!this.isAddDisabled) {
      this.formcService.postUserProfileDetails(this.userRegnDetails).subscribe(
        (data: any) => {
          this.myStepper.next();
          this.loading = false;
          console.log('loading aft', this.loading);
          console.log(JSON.stringify(data, null, 2));
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
          this.snackbar.open('user details updated/saved successfully', 'X', {
            duration: snackbarDuration,
            verticalPosition: 'top',
            panelClass: ['blue-snackbar'],
          });
        },
        (err) => {
          this.loading = false;

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
      this.myStepper.next();
      this.snackbar.open('Application already submitted for approval', 'X', {
        duration: snackbarDuration,
        verticalPosition: 'top',
        panelClass: ['blue-snackbar'],
      });
    }

    //      for(let i=0;i< this.formGroup.value.formArray.length;i++){
    //          console.log('length', this.formGroup.value.formArray.length);
    //    console.log(this.formGroup.value.formArray[i]);
    //          this.b=
    //          {... this.formGroup.value.formArray[0] , ... this.formGroup.value.formArray[1],ownerDetails};
    //         console.log('in b',this.b);
    // }
  }

  OpenPdfDialog(obj: any) {
    const dialogRef = this.dialog.open(PdfviewerdialogComponent, {
      height: '90%',
      width: '100%',
      data: obj,
      disableClose: true,
    });
  }
  sendOwnerDetails() {
    if (this.ownerDetailForm.valid) {
      var datatosend = {
        ownerdetails: ownerDetails,
      };
      console.log('form value', datatosend);
    }
  }
  checkDocs() {
    if (this.uploadStatus[1] == true && this.uploadStatus[2] == true) {
      this.myStepper.next();
    } else {
      this.snackbar.open('Please upload the documents', 'X', {
        duration: snackbarDuration,
      });
    }
  }
  submitApplCnfrm() {
    if (this.isPdfDisabled) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.position = {
        top: '300px',
      };

      dialogConfig.height = '200px';
      dialogConfig.width = '400px';
      dialogConfig.data = {
        regnStepper: this.myStepper,
      };
      this.dialog.open(SubmitConfirmationComponent, dialogConfig);
    } else {
      this.snackbar.open('Application already submitted for approval', 'X', {
        duration: snackbarDuration,
        verticalPosition: 'top',
        panelClass: ['blue-snackbar'],
      });
      this.myStepper.next();
    }
  }
}
