import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NumberValueAccessor,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {
  CURRENT_DATE,
  snackbarDuration,
} from 'src/app/shared/FormCConstants/formcUrlCons';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import {
  AccoGradeModel,
  AccoTypeModel,
  CountryModel,
  DistrictModel,
  FrroListModel,
  StateModel,
} from 'src/app/shared/models/masterModels';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import {
  userNameToRegr,
  alphabetsSpaceDot,
  numbers,
  emailValidation,
} from 'src/app/shared/validationRegex/regexpValidation';
import Swal from 'sweetalert2';
import { OwnerinfodialogComponent } from '../ownerinfodialog/ownerinfodialog.component';
import { Router } from '@angular/router';
var ownerDetails = [];
@Component({
  selector: 'formc-edit-acco-profile',
  templateUrl: './edit-acco-profile.component.html',
  styleUrls: ['./edit-acco-profile.component.scss'],
})
export class EditAccoProfileComponent implements OnInit {
  editAccoForm: FormGroup = new FormGroup({});
  ownerDetailsSource: any;

  maxDate: Date;
  loading: boolean = false;
  states: StateModel[];
  accoCode: string;
  frroCode: String;
  userId: String;
  frroList: FrroListModel[];
  districts: DistrictModel[];
  accoGradeList: AccoGradeModel[];
  accoTypeList: AccoTypeModel[];
  countries: CountryModel[];
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
  constructor(
    private masterService: MasterServicesService,
    private router: Router,
    public formcService: FormcServicesService,
    public _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ls: LocalStoreService,
    private snackbar: MatSnackBar
  ) {
    this.editAccoForm = new FormGroup({
      userId: new FormControl('', [
        Validators.required,
        Validators.pattern(userNameToRegr),
      ]),
      acco_code: new FormControl(''),
      gender: new FormControl('', [Validators.required]),
      dob: new FormControl(''),
      mobile_no: new FormControl('', []),
      user_name: new FormControl(''),
      e_mail_id: new FormControl(''),
      designation: new FormControl('', [
        Validators.required,
        Validators.pattern(alphabetsSpaceDot),
      ]),
      phoneNo: new FormControl('', [
        Validators.required,
        Validators.pattern(numbers),
      ]),
      nationality: new FormControl('', [Validators.required]),
      accomName: new FormControl('', [
        Validators.required,
        Validators.pattern(alphabetsSpaceDot),
      ]),
      accomCapacity: new FormControl('', Validators.required),
      accomAddress: new FormControl('', Validators.required),
      accomState: new FormControl('', Validators.required),
      accomCityDist: new FormControl(''),
      frroTypeCode: new FormControl('', [
        Validators.required,
        Validators.pattern(numbers),
      ]),
      accomodationType: new FormControl('', [Validators.required]),
      accomodationGrade: new FormControl('', Validators.required),
      accomMobile: new FormControl(''),
      accomPhoneNum: new FormControl(''),
      accomEmail: new FormControl('', [
        Validators.required,
        Validators.pattern(emailValidation),
      ]),
      ownerDetails: this._formBuilder.array([this.initItemRows()]),
    });
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
  ngOnInit(): void {
    this.maxDate = CURRENT_DATE;
    this.accoCode = this.ls.getItem('accoCode');
    this.frroCode = this.ls.getItem('frroCode');
    this.userId = this.ls.getItem('username');
    this.formcService
      .getAccomodatorDetails(this.accoCode, this.frroCode, this.userId)
      .subscribe(
        (data: any) => {
          ownerDetails = data['ownerDetails'];
          this.ownerDetailsSource = new MatTableDataSource(ownerDetails);
          console.log('Inside edit stepper acco', data['ownerDetails']);
          this.editAccoForm.patchValue(data);
          console.log('state ', data['accomState']);

          if (data['accomState'] && data['accomCityDist']) {
            this.onChangedCity();

            this.editAccoForm.patchValue({
              accomCityDist: data['frroTypeCode'],
            });
          }
          if (data['accomState']) {
            this.onChangeState(data['accomState']);
            this.editAccoForm.patchValue({
              accomCityDist: data['accomCityDist'],
            });
          }
        },
        (err) => {}
      );
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
  }
  OpenDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OwnerinfodialogComponent, {
      minHeight: '400px',
      width: '550px',
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

  onChangeState(state_code: any) {
    console.log('districts url called');
    this.masterService.getFrroDistrict(state_code).subscribe(
      (data: DistrictModel[]) => {
        this.districts = data;
        console.log(JSON.stringify(this.districts, null, 2));
      },
      (err) => {}
    );
  }
  onChangedCity() {
    console.log('frro url called', this.editAccoForm.get('accomState').value);
    this.masterService
      .getFrroList(
        this.editAccoForm.get('accomState').value,
        this.editAccoForm.get('accomCityDist').value
      )
      .subscribe(
        (data: FrroListModel[]) => {
          this.frroList = data;
          console.log(JSON.stringify(this.frroList, null, 2));
        },
        (err) => {}
      );
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
      this.editAccoForm.get('userId').setValue(this.ls.getItem('username'));
      this.editAccoForm.get('acco_code').setValue(this.ls.getItem('accoCode'));
      //  console.log('Registered user', this.formArray.get([1]).get('userId').value);
      const userRegnDetails = { ...this.editAccoForm.value, ownerDetails };
      //   const userRegnDetails=
      //  this.editAccoForm.value;
      console.log('In userRegnDetails', userRegnDetails);
      this.formcService.updateAccomDetails(userRegnDetails).subscribe(
        (data: any) => {
          this.loading = false;
          console.log('loading aft', this.loading);

          console.log(JSON.stringify(data, null, 2));
          Swal.fire({
            title: 'Accomodator details updated successfully',
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            // this.router.navigate(["formc-details/formc-tabs"])
            window.location.reload();
          });
          // Swal.fire(

          //   'Accomodator details updated successfully.','', 'success').then((result)=>{
          //     window.location.reload();
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
}
