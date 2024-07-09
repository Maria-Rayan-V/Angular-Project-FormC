import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, Navigation } from '@angular/router';
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
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { RegnNavService } from 'src/app/shared/services/regnNav.service';
import {
  phoneNumber,
  alphabetsSpaceDot,
  numbers,
  emailValidation,
} from 'src/app/shared/validationRegex/regexpValidation';
import { PdfviewerdialogComponent } from '../../formc-details/pdfviewerdialog/pdfviewerdialog.component';
import { OwnerinfodialogComponent } from '../../others/ownerinfodialog/ownerinfodialog.component';
import { SubmitConfirmationComponent } from '../submit-confirmation/submit-confirmation.component';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';

var ownerDetails = [];

@Component({
  selector: 'formc-add-acco-prof-stepper',
  templateUrl: './add-acco-prof-stepper.component.html',
  styleUrls: ['./add-acco-prof-stepper.component.scss'],
})
export class AddAccoProfStepperComponent implements OnInit {
  @ViewChild('linearVerticalStepper') private myStepper: MatStepper;
  isFromEditAccoProf: boolean = false;
  loading: boolean = false;
  userName: string;
  maxDate: Date;
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
  isIHRegn: boolean = false;
  userId: string;
  frroCode: string;
  accommodatorDetails: any;
  ownerDetails: MatTableDataSource<OwnerDetail>;
  constructor(
    public jwtAuth: JwtAuthService,
    public activatedRoute: ActivatedRoute,
    public _formBuilder: FormBuilder,
    public dialog: MatDialog,
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
          accomodationType: [''],
          accomodationGrade: [''],
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
      ]),
    });
    if (nav.extras && nav.extras.state && nav.extras.state['userId'] != null) {
      console.log('Inside Stepper nav with data', nav.extras.state['userId']);
      this.ls.setItem('verifiedUser', nav.extras.state['userId']);
      this.isIHRegn = nav.extras.state['isIHRegn'];
    }
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
  ngOnDestroy(): void {
    ownerDetails = [];
  }

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
          //       const index = this.accoTypeList.indexOf('Individual House');
          // console.log(index);
          // if (index !== -1) {
          //   arr.splice(index, 1);
          // }
          //       // console.log(JSON.stringify(this.states,null,2))
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

  getPdfForApproval() {
    console.log('userid', this.userId);

    // this.router.navigate(["sessions/formc-signin"]);
    this.formcService.getPdfForApproval(this.userId).subscribe((res) => {
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
  sendOwnerDetails() {
    if (this.ownerDetailForm.valid) {
      var datatosend = {
        ownerdetails: ownerDetails,
      };
      console.log('form value', datatosend);
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
