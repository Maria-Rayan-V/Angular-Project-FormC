import {
  StepperOrientation,
  StepperSelectionEvent,
} from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { WebcamImage } from 'ngx-webcam';
import { Navigation, Router } from '@angular/router';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { PersonalDetaisComponent } from './personal-detais/personal-details.component';
import { FormctempapplidComponent } from './formctempapplid/formctempapplid.component';
import { ArrivalNxtdesDetailsComponent } from './arrival-nxtdes-details/arrival-nxtdes-details.component';
import { PptVisaDetailsComponent } from './ppt-visa-details/ppt-visa-details.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { FormCDetails } from 'src/app/shared/models/formCModel.model';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { VisaSubtypeModel } from 'src/app/shared/models/masterModels';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
@Component({
  selector: 'formc-stepper-component',
  templateUrl: './stepper-component.component.html',
  styleUrls: ['./stepper-component.component.css'],
})
export class StepperComponentComponent implements OnInit {
  @ViewChild('myStepper') private myStepper: MatStepper;
  @ViewChild(FormctempapplidComponent) childAppidGen: FormctempapplidComponent;
  @ViewChild(PhotoUploadComponent)
  childphotoUpload: PhotoUploadComponent;
  @ViewChild(PersonalDetaisComponent)
  childPersonalDetails: PersonalDetaisComponent;
  @ViewChild(PptVisaDetailsComponent) childPptVisa: PptVisaDetailsComponent;
  @ViewChild(ArrivalNxtdesDetailsComponent)
  childArrivNxt: ArrivalNxtdesDetailsComponent;
  @ViewChild(ReferenceDetailsComponent)
  childReference: ReferenceDetailsComponent;
  userName: any;
  stepdynamicCheck: boolean = false;
  appIdFromChild: any;
  splCategoryFromChild: any;
  DOBFromChild: any;
  isPendingApplication: boolean = false;
  isFromExistingAppl: boolean = false;
  isFromQR: boolean = false;
  randonNumbertoParent: any;
  pptNumFromChild: any;
  stepperOrientation: Observable<StepperOrientation>;
  exitsingLatestFormC: FormCDetails[];
  visaSubtype: VisaSubtypeModel[];
  detailsFromQR: any;
  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private router: Router,
    private snackbar: MatSnackBar,
    private masterService: MasterServicesService,
    private ls: LocalStoreService
  ) {
    let nav: Navigation = this.router.getCurrentNavigation();
    if (nav.extras.state['isFromQr'] == true) {
      console.log('From qr', nav.extras.state['qrDetails']);
      console.log(nav.extras.state['qrDetails']);
      this.isFromQR = nav.extras.state['isFromQr'];
      this.detailsFromQR = nav.extras.state['qrDetails'];
      console.log('QR details', this.detailsFromQR);
    } else if (
      nav.extras &&
      nav.extras.state &&
      nav.extras.state['existingApplication'][0] != null
    ) {
      console.log('Inside Stepper nav with data');
      if (nav.extras.state['isPending']) {
        this.isPendingApplication = nav.extras.state['isPending'];
        console.log('isfrompending tab', this.isPendingApplication);
      }
      if (nav.extras.state['isfromExisting']) {
        this.isFromExistingAppl = nav.extras.state['isfromExisting'];
        console.log('isfromexisting tab', this.isFromExistingAppl);
      }

      this.exitsingLatestFormC = nav.extras.state['existingApplication'][0];
      console.log('in parent init', this.exitsingLatestFormC['img']);
      this.ls.setItem('img', this.exitsingLatestFormC['img']);
      this.ls.setItem(
        'stateOfRef',
        this.exitsingLatestFormC['stateofrefinind']
      );
      this.ls.setItem('visatype', this.exitsingLatestFormC['visatype']);

      this.ls.setItem(
        'nxtDestState',
        this.exitsingLatestFormC['nextdeststateinind']
      );
      // this.snackbar.open('Form C Record ', 'X', {
      //   duration: snackbarDuration,
      //   verticalPosition: 'top',
      //   panelClass: ['blue-snackbar']
      // });
    } else {
      this.snackbar.open(
        'No matching Records Found, Proceed with new Form C',
        'X',
        {
          duration: snackbarDuration,
          verticalPosition: 'top',
          panelClass: ['blue-snackbar'],
        }
      );
    }
    if (this.isPendingApplication == true) {
      this.ls.setItem(
        'FormCApplIdFromPending',
        nav.extras.state['existingApplication'][0]['form_c_appl_id']
      );
      this.appIdFromChild = this.ls.getItem('FormCApplIdFromPending');
    }
    if (this.isPendingApplication == false) {
      this.ls.setItem('FormCApplIdFromPending', null);
    }
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  webcamImage: WebcamImage | undefined;

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }
  ngOnInit() {
    //  console.log('mystepper',this.myStepper);
  }
  getSplCatFromChild(splCatCode) {
    this.splCategoryFromChild = splCatCode;
  }
  getDOBFromChild(dob) {
    this.DOBFromChild = dob;
  }
  getApplicationIdFromChild(applicationId) {
    // Do something with the notification (evt) sent by the child!
    console.log('evt in parent', applicationId);
    this.appIdFromChild = applicationId;
  }
  getPptnumFromChild(pptnumfromchild) {
    this.pptNumFromChild = pptnumfromchild;
  }
  getRandomNumberFromChild(randomNumber) {
    console.log('Random Number In Par', randomNumber);
    this.randonNumbertoParent = randomNumber;
  }
  selectionChange(event: StepperSelectionEvent) {
    console.log('Inside selection change');
    console.log(event.selectedStep.label);
    let stepLabel = event.selectedStep.label;
    if (stepLabel == 'Step 2') {
      console.log('CLICKED STEP 2');
    }
  }

  parseDate(dateString: any) {
    if (dateString) {
      const [day, month, year] = dateString.split('/');
      dateString = year + '-' + month + '-' + day;
      console.log('original Date', dateString);
      console.log('Date Inside Fn moment', moment(dateString));

      return moment(dateString);
    }
    return null;
  }
  // parseDate(date) {
  //   const parseDate = date.split('-');
  //   const parseTime = parseDate[2].split(' ');
  //   const parsedDate = `${parseTime[0]}/${parseDate[1]}/${parseDate[0]} ${parseTime[1]}`

  //   return parsedDate
  // }
  goForward = (args: any): void => {
    this.myStepper.next();
  };

  goBack() {
    this.myStepper.previous();
  }

  // goForward(stepper:MatStepper){
  //     this.myStepper.next();
  // }
  ngAfterViewInit() {
    setTimeout(() => {
      //  console.log("First Name inside qr",this.detailsFromQR['first_name']);
      if (this.isFromQR) {
        this.childAppidGen.tempidGenerationForm.patchValue({
          given_name: this.detailsFromQR['first_name'],
        });
        this.childAppidGen.tempidGenerationForm.patchValue({
          surname: this.detailsFromQR['last_name'],
        });
        this.childPptVisa.pptVisaForm.patchValue({
          passnum: this.detailsFromQR['passport_number'],
        });
        this.childPptVisa.pptVisaForm.patchValue({
          visanum: this.detailsFromQR['visa_number'],
        });
      }
      this.childReference.referenceContactForm.patchValue(
        this.exitsingLatestFormC
      );

      this.childArrivNxt.arrivalNxtdesForm.patchValue(this.exitsingLatestFormC);
      this.childArrivNxt.arrivalNxtdesForm.patchValue({
        nextdestplaceinind: this.exitsingLatestFormC['nextdestplaceinind'],
      });
      this.childArrivNxt.arrivalNxtdesForm.patchValue({
        nextdeststateinind: this.exitsingLatestFormC['nextdeststateinind'],
      });
      this.childArrivNxt.arrivalNxtdesForm.patchValue({
        nextdestdistinind: this.exitsingLatestFormC['nextdestdistinind'],
      });
      this.childArrivNxt.arrivalNxtdesForm.patchValue({
        arridateind: this.parseDate(this.exitsingLatestFormC['arridateind']),
      });
      this.childArrivNxt.arrivalNxtdesForm.patchValue({
        arridatehotel: this.parseDate(
          this.exitsingLatestFormC['arridatehotel']
        ),
      });
      if (this.isFromExistingAppl) {
        this.childArrivNxt.arrivalNxtdesForm.patchValue({
          nextdestcounflag: null,
        });
        this.childArrivNxt.arrivalNxtdesForm.patchValue({
          nextdestcityoutind: null,
        });

        this.childArrivNxt.arrivalNxtdesForm.patchValue({
          nextdestcounoutind: null,
        });

        this.childArrivNxt.arrivalNxtdesForm.patchValue({
          nextdestdistinind: null,
        });

        this.childArrivNxt.arrivalNxtdesForm.patchValue({
          nextdestplaceinind: null,
        });
        this.childArrivNxt.arrivalNxtdesForm.patchValue({
          nextdestplaceoutind: null,
        });
        this.childArrivNxt.arrivalNxtdesForm.patchValue({
          nextdeststateinind: null,
        });
      }

      //  this.onChangeVisatype(this.exitsingLatestFormC['visatype']);
      this.childPptVisa.pptVisaForm.patchValue(this.exitsingLatestFormC);

      this.childPptVisa.pptVisaForm.patchValue({
        passdate: this.parseDate(this.exitsingLatestFormC['passdate']),
      });
      this.childPptVisa.pptVisaForm.patchValue({
        passexpdate: this.parseDate(this.exitsingLatestFormC['passexpdate']),
      });
      this.childPptVisa.pptVisaForm.patchValue({
        visadate: this.parseDate(this.exitsingLatestFormC['visadate']),
      });
      this.childPptVisa.pptVisaForm.patchValue({
        visaexpdate: this.parseDate(this.exitsingLatestFormC['visaexpdate']),
      });
      this.childPersonalDetails.personalDetailsForm.patchValue(
        this.exitsingLatestFormC
      );
      this.childPersonalDetails.personalDetailsForm.patchValue({
        dob: this.parseDate(this.exitsingLatestFormC['dob']),
      });
      this.childAppidGen.tempidGenerationForm.patchValue({
        given_name: this.exitsingLatestFormC['name'],
      });
      this.childAppidGen.tempidGenerationForm.patchValue({
        spl_category_code: this.exitsingLatestFormC['splcategorycode'],
      });
      //     if(this.isPendingApplication==false){
      //       console.log('setting appid to false');
      //   this.childAppidGen.tempidGenerationForm.patchValue({
      //     form_c_appl_id: ('')
      //   });
      // }
      this.childAppidGen.tempidGenerationForm.patchValue(
        this.exitsingLatestFormC
      );

      this.childphotoUpload.photoUploadForm.patchValue(
        this.exitsingLatestFormC
      );

      // this.childAppidGen.tempidGenerationForm.setValue({
      //   given_name: this.exitsingLatestFormC['name'],
      // ppt_no: this.str_response_pptno,
      // nationality: this.str_response_nationality,
      // temp_sform_id: this.str_tempsformid
      // });
      // this.childpassportvisa.passport_visaDetailsFormGroup.patchValue({
      //   dob: this.str_response_dob,
      //   ppt_no: this.str_response_pptno,
      //   pptflag: this.str_pptflag,
      //   visaflag: this.str_visaflag,
      //   temp_sform_id: this.str_tempsformid
      // });
      // this.childcourseInfodetails.courseInfoFormGroup.patchValue({
      //   dob: this.str_response_dob,
      //   ppt_no: this.str_response_pptno,
      //   temp_sform_id: this.str_tempsformid
      // });
      this.childReference.referenceContactForm.updateValueAndValidity();
    }, 0);
  }
}
