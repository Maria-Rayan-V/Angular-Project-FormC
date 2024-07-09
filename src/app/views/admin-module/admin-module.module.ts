import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { ApproveUserComponent } from './approve-user/approve-user.component';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailsComponent } from './user-details/user-details.component';
import { PendingUnapprovedComponent } from './pending-unapproved/pending-unapproved.component';

@NgModule({
  declarations: [ApproveUserComponent, UserDetailsComponent, PendingUnapprovedComponent],
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    SharedMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminModuleModule {}
