import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import {
  StateModel,
  PurposeModel,
  SplCategoryModel,
  DistrictModel,
} from 'src/app/shared/models/masterModels';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import {
  alphaNumSpaceSpecial,
  numbers,
  phoneNumber,
  pincode,
} from 'src/app/shared/validationRegex/regexpValidation';

@Component({
  selector: 'formc-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.css'],
})
export class ReferenceDetailsComponent implements OnInit {
  @Input() stepperNxtFunction: (args: any) => void;
  @ViewChild('myStepper') private myStepper: MatStepper;
  loading: boolean = false;
  districts: DistrictModel[];
  states: StateModel[];
  povList: PurposeModel[];
  splCategories: SplCategoryModel[];
  referenceContactForm: FormGroup;
  constructor(
    private masterService: MasterServicesService,
    private formbuilder: FormBuilder,
    private formcService: FormcServicesService,
    private snackbar: MatSnackBar,
    private ls: LocalStoreService
  ) {
    this.referenceContactForm = formbuilder.group({
      form_c_appl_id: [],
      addrofrefinind: [
        ,
        [Validators.required, Validators.pattern(alphaNumSpaceSpecial)],
      ],
      stateofrefinind: [, Validators.required],
      cityofrefinind: [, Validators.required],
      pincodeofref: [, [Validators.required, Validators.pattern(pincode)]],
      mblnuminind: [, [Validators.pattern(numbers)]],
      phnnuminind: [, [Validators.pattern(phoneNumber)]],
      mblnum: [, [Validators.pattern(numbers)]],
      phnnum: [, [Validators.pattern(phoneNumber)]],
      employedinind: [, Validators.required],

      purposeofvisit: [, Validators.required],
    });
  }
  // postRefContactData()
  // {
  //    console.log(this.referenceContactForm.value)
  // }

  onChangeState(state_code: any) {
    console.log('districts url called');
    this.masterService.getDistrict(state_code.value).subscribe(
      (data: DistrictModel[]) => {
        this.districts = data;
        // console.log(JSON.stringify(this.districts,null,2))
      },
      (err) => {}
    );
  }
  postRefContactData() {
    console.log('inside post ref', this.referenceContactForm);

    console.log('loading bf', this.loading);
    this.referenceContactForm.value.form_c_appl_id =
      this.ls.getItem('formCApplid');
    const referenceDetails = this.referenceContactForm.value;
    if (this.referenceContactForm.valid) {
      this.loading = true;
      this.formcService.postReferenceDetails(referenceDetails).subscribe(
        (data: any) => {
          this.loading = false;
          console.log('loading aft', this.loading);
          this.stepperNxtFunction(this.myStepper);

          console.log(JSON.stringify(data, null, 2));
          this.snackbar.open('Reference details saved successfully', 'X', {
            duration: snackbarDuration,
            verticalPosition: 'top',
            panelClass: ['blue-snackbar'],
          });
        },
        (err) => {
          this.loading = false;

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

  ngOnInit() {
    console.log('before getitem');
    var stateToPass = this.ls.getItem('stateOfRef');
    console.log('in init state', stateToPass);
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
    this.masterService.getSplCategory().subscribe(
      (data: SplCategoryModel[]) => {
        this.splCategories = data;
        // console.log(JSON.stringify(this.states,null,2))
      },
      (err) => {
        //  alert(
        //    err
        //  )
      }
    );

    this.masterService.getPurposeOfVisit().subscribe(
      (data: PurposeModel[]) => {
        this.povList = data;
        // console.log(JSON.stringify(this.states,null,2))
      },
      (err) => {
        //  alert(
        //    err
        //  )
      }
    );
    if (stateToPass != null) {
      this.masterService.getDistrict(stateToPass).subscribe(
        (data: DistrictModel[]) => {
          this.districts = data;
          this.ls.setItem('stateOfRef', null);
        },
        (err) => {}
      );
    }
  }
}
