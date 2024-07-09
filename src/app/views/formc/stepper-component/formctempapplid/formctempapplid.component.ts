import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import {
  CountryModel,
  StateModel,
  DistrictModel,
  SplCategoryModel,
} from 'src/app/shared/models/masterModels';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { alphabetsSpaceDot } from 'src/app/shared/validationRegex/regexpValidation';

@Component({
  selector: 'app-formctempapplid',
  templateUrl: './formctempapplid.component.html',
  styleUrls: ['./formctempapplid.component.scss'],
})
export class FormctempapplidComponent implements OnInit, AfterViewInit {
  // @ViewChild(StepperComponentComponent) stepperRef: StepperComponentComponent;
  @ViewChild('myStepper') private myStepper: MatStepper;
  loading: boolean = false;
  tempidGenerationForm: any;
  isfuncSuccess: boolean = false;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  @Output() pptnumtoparent: EventEmitter<any> = new EventEmitter();
  sendApplicationIdToParent() {}
  @Input() isFromPendingAppl: boolean;
  @Input() isFromExistingAppl: boolean;
  @Input() stepperNxtFunction: (args: any) => void;
  @Output() sendSplCatToStepper: EventEmitter<any> = new EventEmitter();
  countries: CountryModel[];
  states: StateModel[];
  districts: DistrictModel[];
  isIdGeneratedAlready: boolean = false;
  splCategories: SplCategoryModel[];
  constructor(
    private masterService: MasterServicesService,
    private formbuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private formcService: FormcServicesService,
    private ls: LocalStoreService
  ) {
    this.tempidGenerationForm = formbuilder.group({
      acco_code: [],
      entered_by: [],
      frro_fro_code: [],
      given_name: [
        ,
        [Validators.required, Validators.pattern(alphabetsSpaceDot)],
      ],
      surname: [, Validators.pattern(alphabetsSpaceDot)],
      gender: [, [Validators.required]],
      nationality: [, [Validators.required]],
      // passnum: [, [Validators.required, Validators.pattern(alphaNumeric)]],
      form_c_appl_id: [],
      spl_category_code: [, [Validators.required]],
    });
  }
  ngAfterViewInit() {}

  onChangeState(state_code: any) {
    console.log('districts url called');
    this.masterService.getDistrict(state_code.value).subscribe(
      (data: DistrictModel[]) => {
        this.districts = data;
        //  console.log(JSON.stringify(this.districts,null,2))
      },
      (err) => {}
    );
  }
  timeChangeHandler(event: Event) {
    console.log('inside time change');
    console.log(event);
  }

  invalidInputHandler() {
    // some error handling
  }
  gotoNext() {
    console.log('Inside direct nxt');
    this.stepperNxtFunction(this.myStepper);
  }
  posttempidData() {
    console.log('inside post tempid nxt');

    this.ls.setItem(
      'applicantName',
      this.tempidGenerationForm.get('given_name').value
    );
    this.ls.setItem('pptNum', this.tempidGenerationForm.value.passnum);
    // this.tempidGenerationForm.setErrors({valid: false});
    // console.log(this.tempidGenerationForm.status);

    this.tempidGenerationForm.value.acco_code = this.ls.getItem('accoCode');
    this.tempidGenerationForm.value.entered_by = this.ls.getItem('username');
    this.tempidGenerationForm.value.frro_fro_code = this.ls.getItem('frroCode');
    this.tempidGenerationForm.value.form_c_appl_id = this.ls.getItem(
      'FormCApplIdFromPending'
    );
    this.ls.setItem(
      'SplCategory',
      this.tempidGenerationForm.value.spl_category_code
    );
    if (this.isIdGeneratedAlready) {
      this.tempidGenerationForm.value.form_c_appl_id =
        this.ls.getItem('formCApplid');
    }
    if (this.tempidGenerationForm.value.surname == '') {
      this.tempidGenerationForm.get('surname').setValue(null);
      console.log(
        'inside null set value',
        this.tempidGenerationForm.value.surname
      );
    }
    const tempidGenerationData = this.tempidGenerationForm.value;
    if (this.tempidGenerationForm.valid) {
      this.pptnumtoparent.emit(this.tempidGenerationForm.value.passnum);
      this.loading = true;
      this.formcService.generateApplId(tempidGenerationData).subscribe(
        (data: any) => {
          this.isIdGeneratedAlready = true;
          this.loading = false;
          this.sendSplCatToStepper.emit(this.ls.getItem('SplCategory'));
          this.stepperNxtFunction(this.myStepper);
          this.notifyParent.emit(this.ls.getItem('formCApplid'));
          //      this.stepperNxtFunction(this.myStepper);
          console.log(JSON.stringify(data, null, 2));
          if (this.isFromPendingAppl) {
            this.snackbar.open('Basic Details Updated successfully', 'X', {
              duration: snackbarDuration,
              verticalPosition: 'top',
              panelClass: ['blue-snackbar'],
            });
          } else {
            this.snackbar.open('Application Id generated successfully', 'X', {
              duration: snackbarDuration,
              verticalPosition: 'top',
              panelClass: ['blue-snackbar'],
            });
          }
        },
        (err) => {
          this.isfuncSuccess = false;
          this.loading = false;
          console.log('before failure');

          console.log('completed');

          console.log('Failure');

          // this.tempidGenerationForm.setErrors({valid: false});
          // console.log('Inside fail',this.tempidGenerationForm.status);
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
    console.log('oninit tempid', this.isFromExistingAppl);

    this.masterService.getCountry().subscribe(
      (data: CountryModel[]) => {
        this.countries = data;
        //    console.log(JSON.stringify(this.countries,null,2))
      },
      (err) => {
        this.snackbar.open('Something went wrong');
      }
    );
    this.masterService.getState().subscribe(
      (data: StateModel[]) => {
        this.states = data;
        //  console.log(JSON.stringify(this.states,null,2))
      },
      (err) => {
        //  alert(
        //    err
        //  )
      }
    ),
      this.masterService.getSplCategory().subscribe(
        (data: SplCategoryModel[]) => {
          this.splCategories = data;
          //  console.log(JSON.stringify(this.splCategories,null,2))
        },
        (err) => {
          //  alert(
          //    err
          //  )
        }
      );
  }
}
