import { DatePipe, formatDate } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { Moment } from 'moment';
import {
  CURRENT_DATE,
  formatPendingDate,
  snackbarDuration,
} from 'src/app/shared/FormCConstants/formcUrlCons';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import {
  CountryModel,
  VisaSubtypeModel,
  VisatypeModel,
} from 'src/app/shared/models/masterModels';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import {
  alphabetsSpaceDot,
  alphaNumeric,
} from 'src/app/shared/validationRegex/regexpValidation';

@Component({
  selector: 'formc-ppt-visa-details',
  templateUrl: './ppt-visa-details.component.html',
  styleUrls: ['./ppt-visa-details.component.css'],
})
export class PptVisaDetailsComponent implements OnInit {
  @Input() stepperNxtFunction: (args: any) => void;
  @ViewChild('myStepper') private myStepper: MatStepper;
  @Input() isFromPendingAppl: boolean;
  @Input() isFromExistingAppl: boolean;
  @Input() splCatCodeFromParent: string;
  @Input() dobFromParent: string;
  @Input() pptnumFromParent: string;
  isVisaMandatory: boolean = false;
  isPassportMandatory: boolean = false;
  dobDate: Date;
  maxDate: Date;
  userDOB: any;
  loading: boolean = false;
  isalreadySaved: boolean = false;
  isdateChanged: boolean = false;

  countries: CountryModel[];
  visatype: VisatypeModel[];
  visaSubtype: VisaSubtypeModel[];
  pptVisaForm: FormGroup;
  constructor(
    private masterService: MasterServicesService,
    private formbuilder: FormBuilder,
    private elementRef: ElementRef,
    private formcService: FormcServicesService,
    private snackbar: MatSnackBar,
    private ls: LocalStoreService
  ) {
    this.pptVisaForm = formbuilder.group({
      form_c_appl_id: [],
      passnum: [],
      passplace: [, [Validators.pattern(alphabetsSpaceDot)]],
      passcoun: [],
      passdate: [],
      passexpdate: [],
      visanum: [, [Validators.pattern(alphaNumeric)]],
      visaplace: [, [Validators.pattern(alphabetsSpaceDot)]],
      visacoun: [],
      visadate: [],
      visaexpdate: [],
      visatype: [],
      visasubtype: [],
    });
  }
  events: string[] = [];

  setdateChanged() {
    console.log('set date to true');
    this.isdateChanged = true;
  }

  transformDatefn(formcotrl: string, event: any) {
    const datefromtemp: Moment = event.value;
    console.log('Inside transform date');
    let transformedDate = new DatePipe('en-Us').transform(
      datefromtemp.toDate(),
      'dd/MM/yyyy'
    );
    console.log('after transform', transformedDate);
    console.log('form ctrl name', [`${formcotrl}`]);
    // console.log('value in passdate',  this.pptVisaForm.get(`'${formcotrl}'`).value);
    this.pptVisaForm.controls[`${formcotrl}`].setValue(datefromtemp);
    //  this.pptVisaForm.get(`${formcotrl}`).patchValue(transformedDate);
    console.log('transformed', transformedDate);
  }
  //  postPptVisaData()
  //  {console.log(this.pptVisaForm.value)}
  postPptVisaData() {
    //      if((this.isFromPendingAppl && !this.isalreadySaved) ||  this.isdateChanged ||(this.isFromExistingAppl && !this.isalreadySaved))
    //      {
    //       console.log('Inside pending date and not saved')
    // let pptIssueDate = new DatePipe('en-Us').transform(
    //   this.pptVisaForm.value.passdate,
    //   'dd/MM/yyyy'
    // );
    // this.pptVisaForm.value.passdate = pptIssueDate;
    //   console.log('Date before transform pptexp',this.pptVisaForm.value.passexpdate);
    // let pptExpDate = new DatePipe('en-Us').transform(
    //   this.pptVisaForm.value.passexpdate,
    //   'dd/MM/yyyy'
    // );
    // this.pptVisaForm.value.passexpdate = pptExpDate;
    // let visaIssueDate = new DatePipe('en-Us').transform(
    //   this.pptVisaForm.value.visadate,
    //   'dd/MM/yyyy'
    // );
    // this.pptVisaForm.value.visadate = visaIssueDate;
    // let visaExpDate = new DatePipe('en-Us').transform(
    //   this.pptVisaForm.value.visaexpdate,
    //   'dd/MM/yyyy'
    // );
    // this.pptVisaForm.value.visaexpdate = visaExpDate;
    //      }
    this.pptVisaForm.value.passdate = formatPendingDate(
      this.pptVisaForm.value.passdate,
      'dd/MM/YYYY'
    );
    this.pptVisaForm.value.passexpdate = formatPendingDate(
      this.pptVisaForm.value.passexpdate,
      'dd/MM/YYYY'
    );
    this.pptVisaForm.value.visadate = formatPendingDate(
      this.pptVisaForm.value.visadate,
      'dd/MM/YYYY'
    );
    this.pptVisaForm.value.visaexpdate = formatPendingDate(
      this.pptVisaForm.value.visaexpdate,
      'dd/MM/YYYY'
    );
    this.pptVisaForm.value.form_c_appl_id = this.ls.getItem('formCApplid');
    // this.pptVisaForm.value.passnum=this.ls.getItem('passportNumber');
    const pptVisaDetails = this.pptVisaForm.value;
    console.log('pptvisaform', this.pptVisaForm);
    if (this.pptVisaForm.valid) {
      this.loading = true;
      this.formcService.postPptVisaDetails(pptVisaDetails).subscribe(
        (data: any) => {
          this.loading = false;
          console.log('loading aft', this.loading);
          this.isalreadySaved = true;
          this.isdateChanged = false;
          this.stepperNxtFunction(this.myStepper);

          console.log(JSON.stringify(data, null, 2));
          this.snackbar.open('Passport, Visa details saved successfully', 'X', {
            duration: snackbarDuration,
            verticalPosition: 'bottom',
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
    }
  }

  onChangeVisatype(visatype_code: any) {
    this.masterService.getVisaSubtype(visatype_code.value).subscribe(
      (data: VisaSubtypeModel[]) => {
        this.visaSubtype = data;
        //   console.log(JSON.stringify(this.districts,null,2))
      },
      (err) => {}
    );
  }
  ngOnInit() {
    this.maxDate = CURRENT_DATE;
    this.masterService.getCountry().subscribe(
      (data: CountryModel[]) => {
        this.countries = data;
        //   console.log(JSON.stringify(this.countries,null,2))
      },
      (err) => {
        //  alert(
        //    err
        //  )
      }
    );
    this.masterService.getVisatype().subscribe(
      (data: VisatypeModel[]) => {
        this.visatype = data;
        // console.log(JSON.stringify(this.visatype,null,2))
      },
      (err) => {
        //  alert(
        //    err
        //  )
      }
    );
    this.userDOB = this.ls.getItem('dob');

    var existingVisatype = this.ls.getItem('visatype');

    this.masterService.getVisaSubtype(existingVisatype).subscribe(
      (data: VisaSubtypeModel[]) => {
        this.visaSubtype = data;
        console.log(JSON.stringify(this.visaSubtype, null, 2));
        this.ls.setItem('visatype', null);
      },
      (err) => {}
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.isVisaMandatory = false;
    this.isPassportMandatory = false;
    if (
      this.splCatCodeFromParent == '3' ||
      this.splCatCodeFromParent == '10' ||
      this.splCatCodeFromParent == '9' ||
      this.splCatCodeFromParent == '11' ||
      this.splCatCodeFromParent == '5'
    ) {
      console.log('inside visa mandatory');
      this.isVisaMandatory = true;
    }
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
      this.isPassportMandatory = true;
    }
    if (this.dobFromParent != null && this.dobFromParent != '') {
      const [day, month, year] = this.dobFromParent.split('/');
      this.dobFromParent = year + '-' + month + '-' + day;

      console.log('dob in ppt', moment(this.dobFromParent));
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.pptVisaForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log('invalid', invalid);
    return invalid;
  }
}
