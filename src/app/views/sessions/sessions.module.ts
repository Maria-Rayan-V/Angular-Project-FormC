import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedMaterialModule } from "src/app/shared/shared-material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
// import { CommonDirectivesModule } from './sdirectives/common/common-directives.module';
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LockscreenComponent } from "./lockscreen/lockscreen.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { SessionsRoutes } from "./sessions.routing";
import { NotFoundComponent } from "./not-found/not-found.component"; 
import { ErrorComponent } from "./error/error.component";
import { ValidateuserComponent } from './validateuser/validateuser.component';
//import { AccomodatorProfileComponent } from './accomodator-profile/accomodator-profile.component';
import { UserRegnComponent } from './user-regn/user-regn.component';
import { SharedModule } from "src/app/shared/shared.module";
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { IhActivationComponent } from './ih-activation/ih-activation.component';


@NgModule({
  //  exports:[
  //  AccomodatorProfileComponent
  //  ],
  imports: [
  CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SharedMaterialModule,
    SharedComponentsModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    RouterModule.forChild(SessionsRoutes),
  ],
  declarations: [
    ForgotPasswordComponent,
    LockscreenComponent,
    SigninComponent,
    SignupComponent,
    NotFoundComponent,
    ErrorComponent,
    ValidateuserComponent,
    
    UserRegnComponent,
         UpdatePasswordComponent,
         IhActivationComponent
  ],
})
export class SessionsModule {}
