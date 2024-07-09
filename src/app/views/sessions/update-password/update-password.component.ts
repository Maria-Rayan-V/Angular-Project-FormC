import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, Navigation } from '@angular/router';
import { sha256 } from 'js-sha256';
import { Subject } from 'rxjs';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'formc-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  userId: string;
  mobileNo: string;
  userEmail: any;
  encodedMbl: any;
  otpSentinmbl: boolean = false;
  mblOtpHide: boolean = true;
  cnfrmpswdHide: boolean = true;
  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;
  @ViewChild(MatButton) submitButton!: MatButton;
  signinForm: FormGroup = new FormGroup({});
  hide = true;
  formcUser: string;
  responseToken: string;
  isApprovedUser: string;
  accoType: String;
  isRegAppFinalSubmit: string;
  userTypeCode: string;
  public layoutConf: any = {};
  errorMsg = '';
  return: string = '';
  loading: boolean = false;
  saltFromServer: string;
  previewCaptcha: string;
  formcCaptcha: any;
  private _unsubscribeAll: Subject<any>;
  constructor(
    private formcService: FormcServicesService,
    private snackbar: MatSnackBar,
    private ls: LocalStoreService,
    private jwtAuth: JwtAuthService,
    private matxLoader: AppLoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    let nav: Navigation = this.router.getCurrentNavigation();
      if (nav.extras && nav.extras.state && nav.extras.state['userId'] != null) {
     console.log('userid from frgt pswd ', nav.extras.state['userId']);
     this.userId= nav.extras.state['userId'];
     this.mobileNo= nav.extras.state['mobileNo'];
     this.encodedMbl=nav.extras.state['encodedMbl'];
    //  this.jwtAuth
    //  .generateMblOTP(this.userId, this.mobileNo)
    //  .subscribe(
    //    (data: any) => {
    //      this.loading = false;
    //      console.log(JSON.stringify(data, null, 2));
    //      console.log('Success' + data['message']);
    //      this.otpSentinmbl = true;
    //    },
    //    (err) => {
    //      this.loading = false;
    //      console.log('Failure', err.message);
    //      console.log('Failure messa []',err['message']);

    //      this.snackbar.open('Please wait for sometime and retry', 'X', {
    //        duration: snackbarDuration,
    //        panelClass: ['error-snackbar'],
    //      });
    //    }
    //  );
      }
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      // username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      mobile_no: new FormControl(''),
      userId: new FormControl(''),
      confirmPassword: new FormControl('', Validators.required),
      // mobile_otp: new FormControl('', Validators.required),
      rememberMe: new FormControl(true),
    });
  }

  checkPswdCnfrmPswdSame() {
    console.log('inside check fn');
    var password = this.signinForm.get('password').value;
    var cnfrmPswd = this.signinForm.get('confirmPassword').value;
    console.log('passd ', password);
    if (password != cnfrmPswd) {
      this.snackbar.open('Password and confirm password must be same', 'X', {
        duration: snackbarDuration,
        panelClass: ['error-snackbar'],
      });
    }
  }
  postRegnDetails() {
    var hashMD5Password = Md5.hashStr(this.signinForm.value.password);

    var hashSHAPassword = sha256(hashMD5Password);
    this.signinForm.value.password = hashSHAPassword;
    var hashMD5confirmPassword = Md5.hashStr(
      this.signinForm.value.confirmPassword
    );

    var hashSHAconfirmPassword = sha256(hashMD5confirmPassword);
    this.signinForm.value.confirmPassword = hashSHAconfirmPassword;
    this.signinForm.value.userId = this.userId;
    this.signinForm.value.mobile_no = this.mobileNo;
    const regnDetails = this.signinForm.value;

    if (this.signinForm.valid) {
      this.loading = true;
      console.log('inside valid personal');
      this.jwtAuth.postPswdDetails(regnDetails).subscribe(
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
            title: 'Password updated successfully. Click ok to login',
            icon: 'success',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            this.router.navigate(['sessions/signin']);
          });
          // Swal.fire(

          //   'Registered successfully. Click ok to login again','', 'success').then((result)=>{

          //    this.router.navigate(["sessions/signin"])
          //  });
          // this.router.navigate(["sessions/signin"], { state: {
          //   userId:this.signinForm.get('userId').value,
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
      this.snackbar.open('Enter all the mandatory fields', 'X', {
        duration: snackbarDuration,
        panelClass: ['error-snackbar'],
      });
    }
    console.log('at fn end');
  }
}
