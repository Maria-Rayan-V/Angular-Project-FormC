import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
//import { CustomValidators } from "ngx-custom-validators";
import { matxAnimations } from 'src/app/shared/animations/matx-animations';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  GET_SALT_URL,
  snackbarDuration,
} from 'src/app/shared/FormCConstants/formcUrlCons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  animations: matxAnimations,
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup = new FormGroup({});
  hide = true;
  formcUser: string;
  responseToken: string;
  isApprovedUser: string;
  accoType: String;
  isRegAppFinalSubmit: string;
  userTypeCode: string;
  usrCode: string;
  public layoutConf: any = {};
  errorMsg = '';
  return: string = '';
  loading: boolean = false;
  saltFromServer: string;
  previewCaptcha: string;
  formcCaptcha: any;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private snackbar: MatSnackBar,
    private ls: LocalStoreService,
    private jwtAuth: JwtAuthService,
    private matxLoader: AppLoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //  this.formcUser= this.ls.getItem('username');
    this.signinForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      captcha: new FormControl('', Validators.required),
      rememberMe: new FormControl(true),
    });
    //var formcCaptcha= this.ls.getItem('captcha');
    // this.previewCaptcha = 'data:image/jpeg;base64,' + formcCaptcha;
    this.route.queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params) => (this.return = params['return'] || '/'));
  }
  loginSubmit() {
    if (this.signinForm.invalid) {
      return;
    } else {
      this.router.navigate(['FormC/Home']);
    }
  }
  // ngAfterViewInit() {
  //   // setTimeout(() => {
  //     this.autoSignIn();
  //   // })
  // }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
  // getSalt() {
  //   const signinData = this.signinForm.value
  //   this.loading = true;
  //   this.jwtAuth.getSalt(signinData.username)
  //   .subscribe(response => {
  //       console.log('response '+response['salt']);
  //     if(response['salt']!=null)
  //     { this.saltFromServer=response['salt'];
  //     this.previewCaptcha = 'data:image/jpeg;base64,' + response['captcha'];

  //   }
  //      if(this.saltFromServer!=null) this.signin();
  //     this.loading = false;
  //     this.router.navigateByUrl(this.return);
  //   }, err => {
  //     this.loading = false;
  //     this.errorMsg = err.message;
  //   })
  // }
  refreshFormCCaptcha() {
    console.log('Inside refresh captcha');

    this.jwtAuth.refreshCaptcha(this.signinForm.value.username).subscribe(
      (data: any) => {
        this.loading = false;
        console.log('inside success refresh');
        console.log('Refresh captcha', data.body);
        this.previewCaptcha = 'data:image/jpeg;base64,' + data.body;

        // this.ls.setItem('captcha',data['captcha']);
      },
      (err) => {
        console.log('inside failure refresh');
        this.loading = false;
        console.log('Failure', err);

        this.snackbar.open('Please wait for sometime and retry', 'X', {
          duration: snackbarDuration,
          panelClass: ['error-snackbar'],
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
  formCSignin() {
    // this.ls.setItem('salt',null);
    // this.ls.setItem('captcha',null);
    this.previewCaptcha = null;
    this.loading = true;
    const signinData = this.signinForm.value;
    if (signinData.username != null && signinData.username != '') {
      this.jwtAuth.getSalt(signinData.username).subscribe(
        (data: any) => {
          this.loading = false;
          console.log(JSON.stringify(data, null, 2));
          console.log('Success' + data['salt']);

          //  this.ls.setItem('captcha',data['captcha']);

          if (data['salt'] != null && data['salt'] != '') {
            this.ls.setItem('username', signinData.username);
            this.ls.setItem('salt', data['salt']);
            this.ls.setItem('userTypeCode', data['userTypeCode']);
            this.usrCode = this.ls.getItem('userTypeCode');

            this.formcCaptcha = data['captcha'];

            this.previewCaptcha = 'data:image/jpeg;base64,' + this.formcCaptcha;
            //  this.router.navigate(["sessions/formc-signin"]);
          } else {
            this.snackbar.open('Invalid Credentials', 'X', {
              duration: snackbarDuration,
              panelClass: ['error-snackbar'],
            });
          }
        },
        (err) => {
          this.loading = false;
          console.log('Failure', err);
          this.signinForm.reset();
          this.snackbar.open('Please wait for sometime and retry', 'X', {
            duration: snackbarDuration,
            panelClass: ['error-snackbar'],
          });
          //  alert(
          //    err
          //  )
        }
      );
    } else {
      alert('Enter Username');
    }
  }
  // getCaptchaImage()
  // {
  //    var formcCaptcha= this.ls.getItem('captcha');
  //    console.log('captcha form get captcha',formcCaptcha);
  // this.previewCaptcha = 'data:image/jpeg;base64,' + formcCaptcha;
  // }
  onUsernameChange() {
    console.log('in keypress');
    this.signinForm.get('password').setValue('');
  }
  formCAuth() {
    console.log('inside auth', this.usrCode);
    this.loading = true;
    const signinData = this.signinForm.value;
    if (this.signinForm.valid) {
      this.jwtAuth
        .formcSignin(
          signinData.username,
          signinData.password,
          signinData.captcha
        )
        .subscribe(
          (data: any) => {
            this.loading = false;
            console.log('login response', JSON.stringify(data, null, 2));
            console.log('token and isapproved', data['token']);
            this.responseToken = data['token'];
            this.isApprovedUser = data['isApprovedUser'];
            this.isRegAppFinalSubmit = data['isRegAppFinalSubmit'];
            this.accoType = data['acco_type'];
            this.userTypeCode = data['user_Type_Code'];

            console.log(
              '========= User Type Code ===========',
              this.userTypeCode
            );
            //  if(this.responseToken!=null && this.isRegAppFinalSubmit=='Y')
            //  {  console.log('inside nav to final submit profile',this.isRegAppFinalSubmit);
            //     this.router.navigate(["finalSubmit_Regn"],{state:{accoCode:data['acco_code'], userId:data['username']}});
            //  }
            if (
              this.responseToken != null &&
              (this.isApprovedUser == 'Y' || this.isApprovedUser == 'y') &&
              this.userTypeCode == '5'
            ) {
              this.router.navigateByUrl(this.return);
            }
            if (
              this.responseToken != null &&
              (this.isApprovedUser == 'N' || this.isApprovedUser == 'n') &&
              this.accoType != 'IH'
            ) {
              console.log('inside nav to acco profile');
              this.router.navigate(['regn'], {
                state: {
                  isIHRegn: false,
                  userId: data['username'],
                  accoCode: data['acco_code'],
                  isApproved: this.isApprovedUser,
                  isFinalSubmit: this.isRegAppFinalSubmit,
                },
              });
            }
            if (
              this.responseToken != null &&
              (this.isApprovedUser == 'N' || this.isApprovedUser == 'n') &&
              this.accoType == 'IH'
            ) {
              console.log('inside nav to indi house');
              this.router.navigate(['/sessions/SignupMenu/IHRegn'], {
                state: {
                  isIHRegn: true,
                  userId: data['username'],
                  accoCode: data['acco_code'],
                  isApproved: this.isApprovedUser,
                  isFinalSubmit: this.isRegAppFinalSubmit,
                },
              });
            }
            if (
              this.responseToken != null &&
              this.isApprovedUser == 'N' &&
              this.accoType == 'IH' &&
              this.isRegAppFinalSubmit == 'Y'
            ) {
              console.log('inside nav to indi house inactive');
              this.router.navigate(['sessions/ih-activation']);
            }
            if (
              this.responseToken != null &&
              (this.isApprovedUser == 'Y' || this.isApprovedUser == 'y') &&
              this.userTypeCode == '7'
            ) {
              console.log('Inside subuser nav');
              this.router.navigate(['subuser']);
            }
            if (
              this.responseToken != null &&
              (this.isApprovedUser == 'Y' || this.isApprovedUser == 'y') &&
              this.userTypeCode == '4'
            ) {
              console.log('Inside admin nav');
            }
            //  if(this.responseToken!=null && this.isApprovedUser=='N' && this.isRegAppFinalSubmit!='Y'){
            //             console.log('inside nav to acco profile');
            //   this.router.navigate(["acco-profile"],{state:{  userId:data['username']}});
            //                 }
          },
          (err) => {
            this.loading = false;
            console.log('Failure', err.error['message']);

            this.signinForm.reset();

            this.previewCaptcha = null;
            this.snackbar.open(err.error['message'], 'X', {
              duration: snackbarDuration,
              panelClass: ['error-snackbar'],
            });
            //  alert(
            //    err
            //  )
          }
        );
    } else {
      alert('Enter Mandatory Fields');
    }
  }
  adminAuth() {
    this.loading = true;
    const signinData = this.signinForm.value;
    if (this.signinForm.valid) {
      this.jwtAuth
        .formcSignin(
          signinData.username,
          signinData.password,
          signinData.captcha
        )
        .subscribe(
          (data: any) => {
            this.loading = false;
            console.log('login response', JSON.stringify(data, null, 2));
            console.log('token and isapproved', data['token']);
            this.responseToken = data['token'];
            this.isApprovedUser = data['isApprovedUser'];
            this.isRegAppFinalSubmit = data['isRegAppFinalSubmit'];
            this.accoType = data['acco_type'];
            this.userTypeCode = data['user_Type_Code'];

            console.log(
              '========= User Type Code ===========',
              this.userTypeCode
            );

            if (
              this.responseToken != null &&
              (this.isApprovedUser == 'Y' || this.isApprovedUser == 'y') &&
              this.userTypeCode == '4'
            ) {
              this.router.navigate(['admin']);
            }
            //  if(this.responseToken!=null && this.isApprovedUser=='N' && this.isRegAppFinalSubmit!='Y'){
            //             console.log('inside nav to acco profile');
            //   this.router.navigate(["acco-profile"],{state:{  userId:data['username']}});
            //                 }
          },
          (err) => {
            this.loading = false;
            console.log('Failure', err.error['message']);

            this.signinForm.reset();

            this.previewCaptcha = null;
            this.snackbar.open(err.error['message'], 'X', {
              duration: snackbarDuration,
              panelClass: ['error-snackbar'],
            });
            //  alert(
            //    err
            //  )
          }
        );
    } else {
      alert('Enter Mandatory Fields');
    }
  }
  // signin() {
  //     console.log('inside signin');
  //   const signinData = this.signinForm.value
  //   this.loading = true;
  //   this.jwtAuth.signin(signinData.username, signinData.password,signinData.captcha)
  //   .subscribe(response => {
  //     this.loading = false;
  //     this.router.navigateByUrl(this.return);
  //   }, err => {
  //     this.loading = false;
  //     this.errorMsg = err.message;
  //   })
  // }

  // autoSignIn() {
  //   if(this.return === '/') {
  //     return
  //   }
  //   this.matxLoader.open(`Automatically Signing you in! \n Return url: ${this.return.substring(0, 20)}...`, {width: '320px'});
  //   setTimeout(() => {
  //     this.formCAuth();
  //     console.log('autoSignIn');
  //     this.matxLoader.close()
  //   }, 2000);
  // }
  navigateToSignUp() {
    this.router.navigate(['/sessions/userregn'], {
      state: {
        isIHRegn: false,
      },
    });
  }
  navigateToIHRegn() {
    this.router.navigate(['/sessions/userregn'], {
      state: {
        isIHRegn: true,
      },
    });
  }
  navToForPswd() {
    this.router.navigate(['/sessions/forgot-password'], { state: {} });
  }
}
