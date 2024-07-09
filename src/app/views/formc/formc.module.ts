import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StepperComponentComponent } from './stepper-component/stepper-component.component';
import { PptVisaDetailsComponent } from './stepper-component/ppt-visa-details/ppt-visa-details.component';
import { ArrivalNxtdesDetailsComponent } from './stepper-component/arrival-nxtdes-details/arrival-nxtdes-details.component';
import { ReferenceDetailsComponent } from './stepper-component/reference-details/reference-details.component';
import { PersonalDetaisComponent } from './stepper-component/personal-detais/personal-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormcCommonmaterialModule } from 'src/app/shared/formc-commonmaterial/formc-commonmaterial.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormcRoutes } from './formc-routing.module';
import { PendingSearchComponent } from './pending-search/pending-search.component';
import { CheckoutfilterComponent } from './checkoutfilter/checkoutfilter.component';
import { GetdatetoprintComponent } from './getdatetoprint/getdatetoprint.component';
import { FormctempapplidComponent } from './stepper-component/formctempapplid/formctempapplid.component';
import { PhotoUploadComponent } from './stepper-component/photo-upload/photo-upload.component';
import { WebcamModule } from 'ngx-webcam';
import { NewformcEntryComponent } from './stepper-component/newformc-entry/newformc-entry.component';
import { YearFormatDirective } from 'src/app/shared/directives/year-format.directive';
import { YearMonthFormatDirective } from 'src/app/shared/directives/year-month-format.directive';
import { DateFormatDirective } from 'src/app/shared/directives/date-format.directive';
import { PendingFormcListComponent } from './pending-formc-list/pending-formc-list.component';
import { CheckoutlistComponent } from './checkoutlist/checkoutlist.component';
import { PreviewdetailsComponent } from './stepper-component/previewdetails/previewdetails.component';
import { SubmitconfirmdialogComponent } from './stepper-component/submitconfirmdialog/submitconfirmdialog.component';
import { NullDefaultValueDirective } from 'src/app/shared/directives/emptytonull.directive';
import { FormcLogoutComponent } from './formc-logout/formc-logout.component';

@NgModule({
  declarations: [
    StepperComponentComponent,
    YearFormatDirective,
    YearMonthFormatDirective,
    DateFormatDirective,
    PersonalDetaisComponent,
    CheckoutfilterComponent,
    GetdatetoprintComponent,
    PptVisaDetailsComponent,
    ArrivalNxtdesDetailsComponent,
    ReferenceDetailsComponent,
    PendingSearchComponent,
    FormctempapplidComponent,
    PhotoUploadComponent,
    NewformcEntryComponent,
    PendingFormcListComponent,
    CheckoutlistComponent,
    NullDefaultValueDirective,
    PreviewdetailsComponent,
    SubmitconfirmdialogComponent,
    FormcLogoutComponent,
  ],
  imports: [
    CommonModule,
    WebcamModule,
    FormcCommonmaterialModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(FormcRoutes),
  ],
})
export class FormcModule {}
