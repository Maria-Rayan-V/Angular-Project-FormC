import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Navigation, Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import {
  mbl_no_regn,
  snackbarDuration,
} from 'src/app/shared/FormCConstants/formcUrlCons';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import {
  alphabetsSpaceDot,
  emailValidation,
  numbers,
  userNameToRegr,
} from 'src/app/shared/validationRegex/regexpValidation';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';
import { FormcDetailsModule } from '../../formc-details/formc-details.module';

@Component({
  selector: 'formc-user-regn',
  templateUrl: './user-regn.component.html',
  styleUrls: ['./user-regn.component.scss'],
})
export class UserRegnComponent implements OnInit {
  userRegnForm: FormGroup = new FormGroup({});
  hide = true;
  cnfrmpswdHide = true;
  otpSentinmail = false;
  otpSentinmbl = false;
  mblOtpHide = true;
  emailOtpHide = true;
  isIHRegn = false;
  useridAvailable: boolean = false;
  previewCaptcha: string;
  formcCaptcha: string;
  loading: boolean = false;
  isMblOtpBtnClicked: boolean = false;
  isEmailOtpBtnClicked: boolean = false;
  constructor(
    private ls: LocalStoreService,
    private router: Router,
    private jwtAuth: JwtAuthService,
    private snackbar: MatSnackBar
  ) {
    let nav: Navigation = this.router.getCurrentNavigation();
    if (nav.extras.state['isIHRegn'] == true) {
      this.isIHRegn = true;
      console.log('IH regn trueeeee');
    }
  }

  ngOnInit(): void {
    this.userRegnForm = new FormGroup({
      userId: new FormControl('', [
        Validators.required,
        Validators.pattern(userNameToRegr),
      ]),
      userName: new FormControl('', [
        Validators.required,
        Validators.pattern(alphabetsSpaceDot),
      ]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      emailId: new FormControl('', [
        Validators.required,
        Validators.pattern(emailValidation),
      ]),
      email_otp: new FormControl(''),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(mbl_no_regn),
      ]),
      mobile_otp: new FormControl(''),
      captcha: new FormControl('', Validators.required),
      clientIp: new FormControl(''),
      accoType: new FormControl(''),
    });
  }
  checkValidUserForRegn() {
    this.previewCaptcha = null;
    this.loading = true;
    if (this.userRegnForm.get('userId').valid) {
      const signinData = this.userRegnForm.value;

      if (signinData.userId != null && signinData.userId != '') {
        this.jwtAuth.getCaptchaForRegn(signinData.userId).subscribe(
          (data: any) => {
            this.loading = false;
            console.log(JSON.stringify(data, null, 2));
            console.log('Success' + data['captcha']);

            if (data['captcha'] != null && data['captcha'] != '') {
              this.useridAvailable = true;
              //  alert('Userid Available');

              this.formcCaptcha = data['captcha'];

              this.previewCaptcha =
                'data:image/jpeg;base64,' + this.formcCaptcha;
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
            console.log('Failure in check valid user', err);

            this.snackbar.open(
              'User id associated with some another accomdation. Please enter another userid.',
              'X',
              {
                duration: snackbarDuration,
                panelClass: ['error-snackbar'],
              }
            );
            //  alert(
            //    err
            //  )
          }
        );
      } else {
        this.snackbar.open('Enter Username', 'X', {
          duration: snackbarDuration,
          panelClass: ['error-snackbar'],
        });
      }
    } else {
      this.snackbar.open('Enter Valid Username', 'X', {
        duration: snackbarDuration,
        panelClass: ['error-snackbar'],
      });
    }
  }

  onUsernameChange() {
    console.log('in keypress');
    // this.userRegnForm.get('password').setValue('');
    this.useridAvailable = false;

    console.log('isusravai ', this.useridAvailable);
  }
  generateMblOTP() {
    this.isMblOtpBtnClicked = true;
    const signinData = this.userRegnForm.value;
    if (
      signinData.mobile != null &&
      signinData.mobile != '' &&
      signinData.userId != null &&
      signinData.userId != ''
    ) {
      this.jwtAuth
        .generateMblOTP(signinData.userId, signinData.mobile)
        .subscribe(
          (data: any) => {
            this.loading = false;
            console.log(JSON.stringify(data, null, 2));
            console.log('Success' + data['message']);
            this.otpSentinmbl = true;
          },
          (err) => {
            this.loading = false;
            console.log('Failure', err);

            this.snackbar.open('Please wait for sometime and retry', 'X', {
              duration: snackbarDuration,
              panelClass: ['error-snackbar'],
            });
          }
        );
    }
  }
  generateMailOTP() {
    this.isEmailOtpBtnClicked = true;
    const signinData = this.userRegnForm.value;
    if (
      signinData.emailId != null &&
      signinData.emailId != '' &&
      signinData.userId != null &&
      signinData.userId != ''
    ) {
      this.jwtAuth
        .generateMailOTP(signinData.userId, signinData.emailId)
        .subscribe(
          (data: any) => {
            this.loading = false;
            console.log(JSON.stringify(data, null, 2));
            console.log('Success' + data['message']);

            this.otpSentinmail = true;
          },
          (err) => {
            this.loading = false;
            console.log('Failure', err);
            this.snackbar.open('Please wait for sometime and retry', 'X', {
              duration: snackbarDuration,
              panelClass: ['error-snackbar'],
            });
          }
        );
    }
  }
  checkPswdCnfrmPswdSame() {
    console.log('inside check fn');
    var password = this.userRegnForm.get('password').value;
    var cnfrmPswd = this.userRegnForm.get('confirmPassword').value;
    console.log('passd ', password);
    if (password != cnfrmPswd) {
      this.snackbar.open('Password and confirm password must be same', 'X', {
        duration: snackbarDuration,
        panelClass: ['error-snackbar'],
      });
    }
  }
  postRegnDetails() {
    if (this.isIHRegn == true) {
      this.userRegnForm.controls['accoType'].setValue('IH');
    }
    var hashMD5Password = Md5.hashStr(this.userRegnForm.value.password);

    var hashSHAPassword = sha256(hashMD5Password);
    this.userRegnForm.value.password = hashSHAPassword;
    var hashMD5confirmPassword = Md5.hashStr(
      this.userRegnForm.value.confirmPassword
    );

    var hashSHAconfirmPassword = sha256(hashMD5confirmPassword);
    this.userRegnForm.value.confirmPassword = hashSHAconfirmPassword;
    const regnDetails = this.userRegnForm.value;

    if (this.userRegnForm.valid) {
      if (this.isEmailOtpBtnClicked || this.isMblOtpBtnClicked) {
        this.loading = true;
        console.log('inside valid personal');
        this.jwtAuth.postRegnDetails(regnDetails).subscribe(
          (data: any) => {
            this.loading = false;

            console.log(JSON.stringify(data, null, 2));
            // this.snackbar.open('Registered successfully', 'X', {
            //   duration: snackbarDuration,
            //   verticalPosition: 'top',
            //   panelClass: ['blue-snackbar']
            // });
            // this.router.navigate(["sessions/signin"]);
            Swal.fire({
              title: 'Registered successfully. Click ok to login',
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'OK',
              allowOutsideClick: false,
              allowEscapeKey: false,
              // showCancelButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['sessions/signin']);
              } else {
                this.router.navigate(['sessions/signin']);
              }
            });
            // Swal.fire(

            //   'Registered successfully. Click ok to login again','', 'success').then((result)=>{

            //    this.router.navigate(["sessions/signin"])
            //  });
            // this.router.navigate(["sessions/signin"], { state: {
            //   userId:this.userRegnForm.get('userId').value,
            //  } });
          },
          (err) => {
            console.log('inside invalid personal');
            this.loading = false;
            console.log('Failure', err.error['message']);
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
        this.snackbar.open(
          'Click the get OTP in mail/mobile button to get OTP',
          'X',
          {
            duration: snackbarDuration,
            panelClass: ['error-snackbar'],
          }
        );
      }
    } else {
      this.snackbar.open('Enter all the mandatory fields', 'X', {
        duration: snackbarDuration,
        panelClass: ['error-snackbar'],
      });
    }
    console.log('at fn end');
  }
}
