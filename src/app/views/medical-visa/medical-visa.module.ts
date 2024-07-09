import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalVisaRoutingModule } from './medical-visa-routing.module';
import { VisaInvitationComponent } from './visa-invitation/visa-invitation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormcCommonmaterialModule } from 'src/app/shared/formc-commonmaterial/formc-commonmaterial.module';
import { AttendantDialogComponent } from './attendant-dialog/attendant-dialog.component';
import { DraftMedvisaComponent } from './draft-medvisa/draft-medvisa.component';
import { FormcDetailsModule } from '../formc-details/formc-details.module';
import { VisaExtnComponent } from './visa-extn/visa-extn.component';
import { MedvisaDialogComponent } from './medvisa-dialog/medvisa-dialog.component';

@NgModule({
  declarations: [
    VisaInvitationComponent,
    AttendantDialogComponent,
    DraftMedvisaComponent,
    VisaExtnComponent,
    MedvisaDialogComponent,
  ],
  imports: [
    CommonModule,
    MedicalVisaRoutingModule,
    FormcCommonmaterialModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    FormcDetailsModule,
  ],
})
export class MedicalVisaModule {}
