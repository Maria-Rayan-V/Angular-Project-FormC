import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const commonMaterial = [
  CdkStepperModule,
  FormsModule,
  MatSlideToggleModule,
  ReactiveFormsModule,
  MatExpansionModule,
  MatTooltipModule,
  NgxScannerQrcodeModule,
  MatPaginatorModule,
  MatTableModule,
  FlexLayoutModule,
  MatButtonModule,
  MatToolbarModule,
  MatSelectModule,
  MatProgressBarModule,
  NgxMatTimepickerModule,
  MatSidenavModule,
  MatTabsModule,
  MatFormFieldModule,
  MatCardModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatDialogModule,
  NgxDocViewerModule,
  MatGridListModule,
  MatInputModule,
  MatIconModule,
  HttpClientModule,
  MatStepperModule,
  MatNativeDateModule,
  MatListModule,
  MatSnackBarModule,
  ImageCropperModule,
  MatSlideToggleModule,
];
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        next: true,
        previous: true,
      },
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  declarations: [],
  exports: [commonMaterial],
  imports: [commonMaterial],
})
export class FormcCommonmaterialModule {}
