import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import { StateModel, DistrictModel } from 'src/app/shared/models/masterModels';
import {
  alphabetsSpaceDot,
  alphaNumeric,
  alphaNumSpaceSpecial,
  emailValidation,
  numbers,
  phoneNumber,
} from 'src/app/shared/validationRegex/regexpValidation';

@Component({
  selector: 'formc-ownerinfodialog',
  templateUrl: './ownerinfodialog.component.html',
  styleUrls: ['./ownerinfodialog.component.scss'],
})
export class OwnerinfodialogComponent implements OnInit {
  ownerDetailsForm: any;
  states: StateModel[];
  districts: DistrictModel[];
  action: any;

  constructor(
    private formbuilder: FormBuilder,
    private masterService: MasterServicesService,
    public dialogRef: MatDialogRef<OwnerinfodialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.action = data.action;

    this.ownerDetailsForm = formbuilder.group({
      name: ['', [Validators.required, Validators.pattern(alphabetsSpaceDot)]],
      address: [
        '',
        [Validators.required, Validators.pattern(alphaNumSpaceSpecial)],
      ],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.pattern(emailValidation)]],
      phoneNum: ['', [Validators.required, Validators.pattern(phoneNumber)]],
      mobile: ['', [Validators.required, Validators.pattern(numbers)]],
    });
  }

  ngOnInit() {
    this.masterService.getState().subscribe(
      (data: StateModel[]) => {
        this.states = data;
        //     console.log(JSON.stringify(this.states,null,2))
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
  dialogClose() {
    this.dialogRef.close();
  }
  addRecord() {
    switch (this.action) {
      case 'Add':
        if (this.ownerDetailsForm.valid) {
          // State Index
          console.log('ownerdetails', this.ownerDetailsForm.value);
          const state_index = this.states.findIndex((obj) => {
            return obj.stateCode == this.ownerDetailsForm.value.state;
          });
          //console.log(state_index);
          const state_desc = this.states[state_index].ststeName;
          // District Index
          const cty_index = this.districts.findIndex((obj) => {
            return obj.districtCode == this.ownerDetailsForm.value.city;
          });
          // console.log('city index :', cty_index);
          const cty_desc = this.districts[cty_index].districtName;
          // console.log(JSON.stringify(this.ownerDetailsForm.value, null, 2));
          this.dialogRef.close({
            action: this.action,
            data: {
              formvalue: this.ownerDetailsForm.value,
              stateDesc: state_desc,
              cityDesc: cty_desc,
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
}
