import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import {
  CURRENT_DATE,
  formatPendingDate,
  snackbarDuration,
} from 'src/app/shared/FormCConstants/formcUrlCons';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import {
  CountryModel,
  DistrictModel,
  StateModel,
} from 'src/app/shared/models/masterModels';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import {
  alphabets,
  alphabetsSpaceDot,
  numbers,
} from 'src/app/shared/validationRegex/regexpValidation';

@Component({
  selector: 'formc-arrival-nxtdes-details',
  templateUrl: './arrival-nxtdes-details.component.html',
  styleUrls: ['./arrival-nxtdes-details.component.css'],
})
export class ArrivalNxtdesDetailsComponent implements OnInit {
  @ViewChild('timepicker') timepicker: any;
  loading: boolean = false;
  @Input() isFromPendingAppl: boolean;
  @Input() isFromExistingAppl: boolean;
  @Input() splCatCodeFromParent: string;
  @Input() stepperNxtFunction: (args: any) => void;
  @ViewChild('myStepper') private myStepper: MatStepper;
  showInsideInd: boolean = false;
  showOutsideInd: boolean = false;
  arrivalNxtdesForm: any;
  isalreadySaved: boolean = false;
  isArrivalMandatory: boolean = false;
  isdateChanged: boolean = false;
  countries: CountryModel[];
  states: StateModel[];
  districts: DistrictModel[];
  maxDate: Date;
  constructor(
    private masterService: MasterServicesService,
    private ls: LocalStoreService,
    private formcService: FormcServicesService,
    private formbuilder: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.arrivalNxtdesForm = formbuilder.group({
      form_c_appl_id: [],
      arriplace: [, [Validators.pattern(alphabetsSpaceDot)]],
      arricit: [, [Validators.pattern(alphabets)]],
      arricoun: [, []],
      arridateind: [,],
      arridatehotel: [,],
      arritimehotel: [,],
      durationofstay: [, [Validators.pattern(numbers)]],
      // nextdestplaceinind:["",[Validators.pattern(alphabetsSpaceDot)]],
      // nextdestdistinind:["",],
      // nextdeststateinind:["",],
      nextdestcounflag: [, Validators.required],
      // nextdestplaceoutind:["",[Validators.pattern(alphabetsSpaceDot)]],
      // nextdestcityoutind:[""],
      // nextdestcounoutind:[""],
    });
  }
  defaultValue = { hour: 13, minute: 30 };
  setdateChanged() {
    this.isdateChanged = true;
  }
  timeChangeHandler(event: Event) {
    console.log(event);
  }

  invalidInputHandler() {
    // some error handling
  }

  // postArrivalNxtdesData()
  // {
  //    console.log(this.arrivalNxtdesForm.value)
  // }
  postArrivalNxtdesData() {
    console.log('loading bf', this.loading);
    this.arrivalNxtdesForm.value.form_c_appl_id =
      this.ls.getItem('formCApplid');
    // if((this.isFromPendingAppl && !this.isalreadySaved) ||  this.isdateChanged ||(this.isFromExistingAppl && !this.isalreadySaved)){
    // let arrivalDate = new DatePipe('en-Us').transform(
    //   this.arrivalNxtdesForm.value.arridateind,
    //   'dd/MM/yyyy'
    // );
    // let arrivalDateInHotel = new DatePipe('en-Us').transform(
    //   this.arrivalNxtdesForm.value.arridatehotel,
    //   'dd/MM/yyyy'
    // );

    // this.arrivalNxtdesForm.value.arridatehotel = arrivalDateInHotel;
    // this.arrivalNxtdesForm.value.arridateind = arrivalDate;
    // }
    this.arrivalNxtdesForm.value.arridatehotel = formatPendingDate(
      this.arrivalNxtdesForm.value.arridatehotel,
      'dd/MM/YYYY'
    );
    this.arrivalNxtdesForm.value.arridateind = formatPendingDate(
      this.arrivalNxtdesForm.value.arridateind,
      'dd/MM/YYYY'
    );
    const arrivalNxtdesDetails = this.arrivalNxtdesForm.value;
    if (this.arrivalNxtdesForm.valid) {
      this.loading = true;
      this.formcService
        .postArrivalNxtdesDetails(arrivalNxtdesDetails)
        .subscribe(
          (data: any) => {
            this.loading = false;
            this.isalreadySaved = true;
            this.isdateChanged = false;
            this.stepperNxtFunction(this.myStepper);

            console.log(JSON.stringify(data, null, 2));
            this.snackbar.open('Arrival details saved successfully', 'X', {
              duration: snackbarDuration,
              verticalPosition: 'top',
              panelClass: ['blue-snackbar'],
            });
          },
          (err) => {
            this.loading = false;

            console.log('error', err);
            console.log('Failure');
            this.snackbar.open('Something went wrong', 'X', {
              duration: snackbarDuration,
              panelClass: ['error-snackbar'],
            });
            //  alert(
            //    err
            //  )
          }
        );
    }
  }
  ngOnInit() {
    console.log('isinsidetrue', this.showInsideInd);
    console.log('isoutsidetrue', this.showOutsideInd);
    this.maxDate = CURRENT_DATE;
    var stateToPass = this.ls.getItem('nxtDestState');
    this.masterService.getCountry().subscribe(
      (data: CountryModel[]) => {
        this.countries = data;
        //   console.log(JSON.stringify(this.countries,null,2))
      },
      (err) => {
        this.snackbar.open('Something went wrong');
      }
    );
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
    this.arrivalNxtdesForm
      .get('nextdestcounflag')
      .valueChanges.subscribe((nxtDesFlag) => {
        if (nxtDesFlag == 'I') {
          console.log('Inside I if');
          this.showInsideInd = true;
          this.showOutsideInd = false;

          this.removeOutsideIndField();

          this.addInsideIndField();
        }
        if (nxtDesFlag == 'O') {
          console.log('Inside yy if');
          this.showInsideInd = false;
          this.showOutsideInd = true;

          this.removeInsideIndField();

          this.addOutsideIndField();
        }

        this.arrivalNxtdesForm.updateValueAndValidity();
      });
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
  ngOnChanges(changes: SimpleChanges) {
    console.log('spl from parent in arrival', this.splCatCodeFromParent);
    this.isArrivalMandatory = false;
    if (
      this.splCatCodeFromParent == '3' ||
      this.splCatCodeFromParent == '10' ||
      this.splCatCodeFromParent == '9' ||
      this.splCatCodeFromParent == '11' ||
      this.splCatCodeFromParent == '5' ||
      this.splCatCodeFromParent == '7' ||
      this.splCatCodeFromParent == '4' ||
      this.splCatCodeFromParent == '12' ||
      this.splCatCodeFromParent == '6' ||
      this.splCatCodeFromParent == '8' ||
      this.splCatCodeFromParent == '2'
    ) {
      console.log('inside ppt mandatory');
      this.isArrivalMandatory = true;
    }
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
  addInsideIndField() {
    this.addDynamicFormCtrl('nextdestplaceinind');
    this.addDynamicFormCtrl('nextdestdistinind');
    this.addDynamicFormCtrl('nextdeststateinind');
    // let placeControl =  this.formbuilder.control('');
    // this.arrivalNxtdesForm.addControl("nextdestplaceinind", placeControl);
    // placeControl.setValidators(Validators.required);
    // placeControl.updateValueAndValidity();
    // let cityControl =  this.formbuilder.control('');
    // this.arrivalNxtdesForm.addControl("dob", cityControl);
    // cityControl.setValidators(Validators.required);
    // cityControl.updateValueAndValidity();
    // let stateControl =  this.formbuilder.control('');
    // this.arrivalNxtdesForm.addControl("dob", stateControl);
    // stateControl.setValidators(Validators.required);
    // stateControl.updateValueAndValidity();
  }
  removeInsideIndField() {
    this.arrivalNxtdesForm.removeControl('nextdestplaceinind');
    this.arrivalNxtdesForm.removeControl('nextdestdistinind');
    this.arrivalNxtdesForm.removeControl('nextdeststateinind');
  }
  addOutsideIndField() {
    this.addDynamicFormCtrl('nextdestplaceoutind');
    this.addDynamicFormCtrl('nextdestcityoutind');
    this.addDynamicFormCtrl('nextdestcounoutind');
  }
  removeOutsideIndField() {
    this.arrivalNxtdesForm.removeControl('nextdestplaceoutind');
    this.arrivalNxtdesForm.removeControl('nextdestcityoutind');
    this.arrivalNxtdesForm.removeControl('nextdestcounoutind');
  }
  addDynamicFormCtrl(dynamicformCtrl: String) {
    let placeControl = this.formbuilder.control('');
    this.arrivalNxtdesForm.addControl(dynamicformCtrl, placeControl);
    placeControl.setValidators(Validators.required);
    placeControl.updateValueAndValidity();
  }
}
