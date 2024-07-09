import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CURRENT_DATE, CURRENT_YEAR, snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import * as _moment from 'moment';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import { CountryModel, SplCategoryModel } from 'src/app/shared/models/masterModels';
import { alphabetsSpaceDot, alphaNumSpaceSpecial, numbers } from 'src/app/shared/validationRegex/regexpValidation';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'formc-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetaisComponent implements OnInit {
  @Input() stepperNxtFunction: (args:any) => void;  @ViewChild('myStepper') private myStepper: MatStepper;
  @Input() isFromPendingAppl:boolean;
  @Input() isFromExistingAppl:boolean;
  
  // @Output() sendSplCatToStepper: EventEmitter<any> = new EventEmitter();
   @Output() sendDOBToStepper: EventEmitter<any> = new EventEmitter();
  minDate: Date;
  ageInYrs:any;
  isdateChanged:boolean=false;
  isalreadySaved:boolean=false;
  loading: boolean = false;
  showDDfield = false;
  showMMfield = false;
  showYYfield = false;
  showXXfield = false;
  monthInputCtrl: FormControl = new FormControl(new Date(2020, 0, 1));
  maxDate: Date;
  countries: CountryModel[];
  splCategories: SplCategoryModel[];
  personalDetailsForm: FormGroup
  constructor(private masterService: MasterServicesService,
    private formcService: FormcServicesService,
    private formbuilder: FormBuilder, private snackbar: MatSnackBar,
    private ls: LocalStoreService) {

    this.personalDetailsForm = formbuilder.group({
      form_c_appl_id: [],    
      gender:[],
      name:[],
      surname:new FormControl(),
      nationality:[],
      dobformat: [, Validators.required],
      addroutind: [, [Validators.required, Validators.pattern(alphaNumSpaceSpecial)]],
      cityoutind: [, [Validators.required, Validators.pattern(alphabetsSpaceDot)]],
      counoutind: [,[Validators.required]],
      // splcategorycode:[,[Validators.required]]
    })

  }
  userName:any;
  ngOnInit() {
    this.userName=this.ls.getItem('applicantName');
    console.log('username ',this.userName);
    this.personalDetailsForm.get('dobformat').valueChanges.subscribe(dobFormat => {
      if (dobFormat == 'XX') {
        console.log('Inside XXX if');
        this.showXXfield = true;
        this.showYYfield = false;
        this.showDDfield = false;
        this.showMMfield = false;
        this.removeDynamicYYField();
        this.removeDynamicDDField();
        this.removeDynamicMMField();
        this.addDynamicXXField();
      }
      if (dobFormat == 'YY') {
        console.log('Inside yy if');
        this.showYYfield = true
        this.showDDfield = false;
        this.showMMfield = false;
        this.showXXfield = false;
        this.removeDynamicXXField();
        this.removeDynamicDDField();
        this.removeDynamicMMField();
        this.addDynamicYYField();
      }
      if (dobFormat == 'MM') {
        console.log('Inside mm if');
        this.showMMfield = true;
        this.showDDfield = false;
        this.showYYfield = false;
        this.showXXfield = false;
        this.removeDynamicXXField();
        this.removeDynamicDDField();
        this.removeDynamicYYField();
        this.addDynamicMMField();
      }
      if (dobFormat == 'DD') {
        console.log(
          'inside dd if'
        );
        this.showDDfield = true;
        this.showMMfield = false;
        this.showYYfield = false;
        this.showXXfield = false;
        this.removeDynamicXXField();
        this.removeDynamicMMField();
        this.removeDynamicYYField();
        this.addDynamicDDField();
      }
      this.personalDetailsForm.updateValueAndValidity();
    });

    this.minDate = new Date(CURRENT_YEAR - 130, 0, 1);
    console.log(this.minDate.toDateString());
    this.maxDate = CURRENT_DATE;
    this.masterService.getCountry().subscribe((data: CountryModel[]) => {
      this.countries = data;
      //    console.log(JSON.stringify(this.countries,null,2))
    },
      (err) => {

        this.snackbar.open('Something went wrong', 'close', {
          duration:snackbarDuration
        });
        //  alert(
        //    err
        //  )
      },
    ),
      this.masterService.getSplCategory().subscribe((data: SplCategoryModel[]) => {
        this.splCategories = data;
        //  console.log(JSON.stringify(this.splCategories,null,2))
      },
        (err) => {
          //  alert(
          //    err
          //  )
        },
      )

  }
  setdateChanged()
  {
     
    this.isdateChanged=true;
  }
  addDynamicMMField() {

    let dobControl = this.formbuilder.control(moment());
    this.personalDetailsForm.addControl("dob", dobControl);
    dobControl.setValidators(Validators.required);
    dobControl.updateValueAndValidity();
  }
  removeDynamicMMField() {
    this.personalDetailsForm.removeControl("dob");
  }
  addDynamicDDField() {

    let dobControl = this.formbuilder.control('');
    this.personalDetailsForm.addControl("dob", dobControl);
    dobControl.setValidators(Validators.required);
    dobControl.updateValueAndValidity();
  }
  removeDynamicDDField() {
    this.personalDetailsForm.removeControl("dob");
  }
  addDynamicYYField() {

    let dobControl = this.formbuilder.control(moment());
    this.personalDetailsForm.addControl("dob", dobControl);
    dobControl.setValidators(Validators.required);
    dobControl.updateValueAndValidity();
  }
  removeDynamicYYField() {
    this.personalDetailsForm.removeControl("dob");
  }
  addDynamicXXField() {

    let dobControl = this.formbuilder.control('');
    this.personalDetailsForm.addControl("dob", dobControl);
    dobControl.setValidators([Validators.required,Validators.pattern(numbers)]);
    dobControl.updateValueAndValidity();
  }
  removeDynamicXXField() {
    this.personalDetailsForm.removeControl("dob");
  }
  // monthSelected(event, dp, input) {
  //   dp.close();
  //   input.value = event.toISOString().split('-').join('/').substr(0, 7);
  //   console.log('input value' + input.value);
  // }
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
     console.log('Inside set month function');
    const ctrlValue = this.personalDetailsForm.get('dob').value;
       console.log('ctrlvalue',ctrlValue);
    console.log('normalized month', normalizedMonthAndYear.year());
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.personalDetailsForm.get('dob').setValue(ctrlValue);
    datepicker.close();
    console.log('selected date', ctrlValue)
    let dob = new DatePipe('en-Us').transform(
      ctrlValue,
      '01/MM/yyyy'
    );
    this.personalDetailsForm.value.dob = dob;
    console.log('date of birth in month year', dob);
  }
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {

    const ctrlValue = this.personalDetailsForm.get('dob').value;
    console.log('normalized month', normalizedYear.year());
    datepicker.close();
    //   ctrlValue.day(normalizedYear.day());
    // ctrlValue.month(normalizedYear.month());
    ctrlValue.year(normalizedYear.year());
    this.personalDetailsForm.get('dob').setValue(ctrlValue);

    // console.log('selected date',ctrlValue)
    let dob = new DatePipe('en-Us').transform(
      ctrlValue,
      '01/01/yyyy'
    );
    this.personalDetailsForm.value.dob = dob;
    console.log('date of birth ', dob);
    //  input._destroyPopup()
  }

  postPersonalData() {
    this.changeIntoDatefn();
    console.log('dob', this.personalDetailsForm.value.dob)
    if((this.isFromPendingAppl && !this.isalreadySaved) ||  this.isdateChanged ||(this.isFromExistingAppl && !this.isalreadySaved)){
    let dob = new DatePipe('en-Us').transform(
      this.personalDetailsForm.value.dob,
      'dd/MM/yyyy'
    );
     
    this.personalDetailsForm.value.dob = dob;
    }
    this.personalDetailsForm.value.form_c_appl_id = this.ls.getItem('formCApplid');
    this.personalDetailsForm.value.gender = this.ls.getItem('gender');
    this.personalDetailsForm.value.name = this.ls.getItem('givenName');
    this.personalDetailsForm.value.surname = this.ls.getItem('surname');
    this.personalDetailsForm.value.nationality = this.ls.getItem('nationality');
    this.ls.setItem('SplCategory',this.personalDetailsForm.value.splcategorycode);
    const personalDetails = this.personalDetailsForm.value;
    console.log('dob after change', this.personalDetailsForm.value.dob); 
    console.log('form status',this.personalDetailsForm);
    if (this.personalDetailsForm.valid) {

      this.loading = true;
         console.log('inside valid personal');
      this.formcService.postPersonalDetails(personalDetails).subscribe((data: any) => {
        this.loading = false;
        this.isalreadySaved=true;
        this.isdateChanged=false;
        // this.sendSplCatToStepper.emit(this.ls.getItem('SplCategory'));
            this.sendDOBToStepper.emit(this.personalDetailsForm.value.dob);
        this.stepperNxtFunction(this.myStepper);
    
        console.log(JSON.stringify(data, null, 2));
        this.snackbar.open('Personal details saved successfully', 'X', {
          duration: snackbarDuration,
          verticalPosition: 'top',
          panelClass: ['blue-snackbar']
        });
      },
        (err) => {
          console.log('inside invalid personal');
          this.loading = false;
          console.log('Failure');
          this.snackbar.open('Something went wrong', 'X', {
            duration: snackbarDuration
          });
          //  alert(
          //    err
          //  )
        },
      );
    }
    console.log('at fn end');
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.personalDetailsForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
          console.log('inbalid',invalid);
        }
    }
    return invalid;
}
changeIntoDatefn()
{ 
  console.log('Age got in evt',this.ageInYrs);
 let birthYr= CURRENT_YEAR-this.ageInYrs;
   
  console.log('Birth Year',birthYr);
}

}
