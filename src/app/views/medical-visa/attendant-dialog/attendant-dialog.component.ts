import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAX_REGN_YR } from 'src/app/shared/FormCConstants/formcUrlCons';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import {
  StateModel,
  DistrictModel,
  CountryModel,
} from 'src/app/shared/models/masterModels';
import {
  alphaNumSpaceSpecial,
  alphabetsSpaceDot,
  emailValidation,
  numbers,
  passportAndVisaRegExp,
  pincode,
} from 'src/app/shared/validationRegex/regexpValidation';

@Component({
  selector: 'formc-attendant-dialog',
  templateUrl: './attendant-dialog.component.html',
  styleUrls: ['./attendant-dialog.component.scss'],
})
export class AttendantDialogComponent implements OnInit {
  attendantDetailsForm: any;
  states: StateModel[];
  districts: DistrictModel[];
  action: any;
  countries: CountryModel[];
  maxDate: any;
  constructor(
    private formbuilder: FormBuilder,
    private masterService: MasterServicesService,
    public dialogRef: MatDialogRef<AttendantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.action = data.action;
    this.attendantDetailsForm = formbuilder.group({
      fileRefno: [''],
      surname: [
        '',
        [Validators.required, Validators.pattern(alphabetsSpaceDot)],
      ],
      givenName: [
        '',
        [Validators.required, Validators.pattern(alphabetsSpaceDot)],
      ],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      pptNum: [
        '',
        [Validators.required, Validators.pattern(passportAndVisaRegExp)],
      ],
      addressNative: [
        '',
        [Validators.required, Validators.pattern(alphaNumSpaceSpecial)],
      ],
      addressIndia: [
        '',
        [Validators.required, Validators.pattern(alphaNumSpaceSpecial)],
      ],
      attendanttState: ['', [Validators.required]],
      attendantCity: ['', [Validators.required]],
      pincodeOfAttendant: [
        '',
        [Validators.required, Validators.pattern(pincode)],
      ],
      contactNative: ['', [Validators.required, Validators.pattern(numbers)]],
      contactIndia: ['', [Validators.required, Validators.pattern(numbers)]],
      emailId: ['', [Validators.required, Validators.pattern(emailValidation)]],
      relationship: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.maxDate = MAX_REGN_YR;
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
  }
  onChangeState(state_code: any) {
    this.masterService.getDistrict(state_code.value).subscribe(
      (data: DistrictModel[]) => {
        this.districts = data;
        //   console.log(JSON.stringify(this.districts,null,2))
      },
      (err) => {}
    );
  }
  addRecord() {
    switch (this.action) {
      case 'Add':
        console.log('Attendantdetails', this.attendantDetailsForm.value);
        if (this.attendantDetailsForm.valid) {
          // State Index
          console.log('ownerdetails', this.attendantDetailsForm.value);
          let dobFormatedDate = new DatePipe('en-Us').transform(
            this.attendantDetailsForm.value.dob,
            'dd/MM/yyyy'
          );
          this.attendantDetailsForm.value.dob = dobFormatedDate;
          // const state_index = this.states.findIndex((obj) => {
          //   return (
          //     obj.stateCode ==
          //     this.attendantDetailsForm.value.state
          //   );
          // });
          // //console.log(state_index);
          // const state_desc = this.states[state_index].ststeName;
          // // District Index
          // const cty_index = this.districts.findIndex((obj) => {
          //   return (
          //     obj.districtCode ==
          //     this.attendantDetailsForm.value.city
          //   );
          // });
          // // console.log('city index :', cty_index);
          // const cty_desc = this.districts[cty_index].districtName;
          // console.log(JSON.stringify(this.attendantDetailsForm.value, null, 2));
          this.dialogRef.close({
            action: this.action,
            data: {
              formvalue: this.attendantDetailsForm.value,
              // stateDesc: state_desc,
              // cityDesc: cty_desc,
            },
          });
        } else {
          alert('Enter Mandatory Fields');
        }
        break;
      case 'Delete':
        this.dialogRef.close({
          action: this.action,
          data: this.data,
        });
        break;
    }
  }
  dialogClose() {
    this.dialogRef.close();
  }
}
