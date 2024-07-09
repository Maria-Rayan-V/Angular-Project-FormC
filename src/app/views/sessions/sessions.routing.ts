import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { ValidateuserComponent } from './validateuser/validateuser.component';
// import { AccomodatorProfileComponent } from "./accomodator-profile/accomodator-profile.component";
import { UserRegnComponent } from './user-regn/user-regn.component';
import { AuthLayoutComponent } from 'src/app/shared/components/layouts/auth-layout/auth-layout.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { IhActivationComponent } from './ih-activation/ih-activation.component';

export const SessionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          {
            path: 'SignupMenu',
            loadChildren: () =>
              import(
                'src/app/views/sessions/signup-module/signup-module.module'
              ).then((m) => m.SignupModuleModule),
            data: { title: 'Sign Up' },
          },
        ],
      },
      {
        path: 'userregn',
        component: UserRegnComponent,
        data: { title: 'Signup' },
      },
      {
        path: 'ih-activation',
        component: IhActivationComponent,
        data: { title: 'IH Activation' },
      },
      {
        path: 'formc-signin',
        component: SigninComponent,
        data: { title: 'Signin' },
      },
      {
        path: 'signin',
        component: SigninComponent,
        data: { title: 'Signin' },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { title: 'Forgot password' },
      },
      {
        path: 'update-password',
        component: UpdatePasswordComponent,
        data: { title: 'Update password' },
      },
      {
        path: 'lockscreen',
        component: LockscreenComponent,
        data: { title: 'Lockscreen' },
      },
      {
        path: '404',
        component: NotFoundComponent,
        data: { title: 'Not Found' },
      },
      {
        path: 'error',
        component: ErrorComponent,
        data: { title: 'Error' },
      },
    ],
  },
];
