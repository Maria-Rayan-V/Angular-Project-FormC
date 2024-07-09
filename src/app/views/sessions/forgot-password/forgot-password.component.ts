import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, Navigation } from '@angular/router';
import { Subject } from 'rxjs';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { AppLoaderService } from 'src/app/shared/services/app-loader/app-loader.service';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  userEmail: any;  otpSentinmbl:boolean=false;
  userIdtoSend:any;  mblOtpHide:boolean=true;
  mobileNumToSend:any;
  encodedMbl:any;
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
    private formcService:FormcServicesService,
    private snackbar: MatSnackBar,
    private ls: LocalStoreService,
    private jwtAuth: JwtAuthService,
    private matxLoader: AppLoaderService,
    private router: Router,
    private route: ActivatedRoute,


  ) {

  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      userId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      captcha: new FormControl('', Validators.required),
      mobile_otp: new FormControl('', Validators.required),
      mobile_no:new FormControl(''),
      rememberMe: new FormControl(true),
    });
  }


  refreshFormCCaptcha() {
    console.log('Inside refresh captcha');

    this.jwtAuth.refreshCaptcha(this.signinForm.value.userId).subscribe(
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
    this.previewCaptcha=null;
    this.loading = true;
    const signinData = this.signinForm.value
      if(signinData.userId!=null && signinData.userId!=""){
    this.jwtAuth.getSalt(signinData.userId).subscribe((data:any)=>
    {
      this.loading = false;
        console.log(JSON.stringify(data,null,2));
        console.log('Success'+data['salt']);

          //  this.ls.setItem('captcha',data['captcha']);

        if(data['salt']!=null && data['salt']!="")  {
          this.ls.setItem('username',signinData.userId);
          this.ls.setItem('salt',data['salt']);
           this.formcCaptcha= data['captcha'];

       this.previewCaptcha = 'data:image/jpeg;base64,' + this.formcCaptcha;
        //  this.router.navigate(["sessions/formc-signin"]);
        }
         else{
          this.snackbar.open('Invalid Credentials', 'X', {
            duration: snackbarDuration,
      panelClass: ['error-snackbar'],

          });
         }
    },
   (err)=>{

    this.loading = false;
    console.log('Failure',err);
    this.signinForm.reset();
     this.snackbar.open('Please wait for sometime and retry', 'X', {
      duration: snackbarDuration,
      panelClass: ['error-snackbar']
    });
    //  alert(
    //    err
    //  )
   },
    );
  }
   else{
       alert('Enter Username');
   }
  }
  checkCaptchaGn() {
    console.log('Inside submit fn');

    this.formcService.checkCaptchaGn(this.signinForm.value.userId,this.signinForm.value.captcha).subscribe(
      (data: any) => {
        this.loading = false;

      this.mobileNumToSend=data['mobileNo'];
      this.userIdtoSend=data['userid'];
      this.encodedMbl=data['encodedMobile'];
        // this.navToUpdtPswd();
        this.generateMobileOTP();
        console.log('inside no err block');
      },
      (err) => {
        console.log('inside failure refresh');
        this.loading = false;
        console.log('Failure', err);

        this.snackbar.open('Invalid Captcha', 'X', {
          duration: snackbarDuration,
          panelClass: ['error-snackbar'],
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
  onUsernameChange() {
    console.log('in keypress');
    this.signinForm.get('password').setValue('');
  }




  navToUpdPswd()
  {
    this.signinForm.value.mobile_no=this.mobileNumToSend;
    const regnDetails = this.signinForm.value;

    this.jwtAuth.checkPswdDetails(regnDetails).subscribe(
      (data: any) => {
        this.loading = false;
        this.router.navigate(['/sessions/update-password'],{state:{
          userId:this.userIdtoSend,
          mobileNo:this.mobileNumToSend,
          encodedMbl:this.encodedMbl
        }});
        console.log(JSON.stringify(data, null, 2));


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
  }
  generateMobileOTP()
  {
    this.jwtAuth
    .generateMblOTP(this.userIdtoSend, this.mobileNumToSend)
    .subscribe(
      (data: any) => {
        this.loading = false;
        console.log(JSON.stringify(data, null, 2));
        console.log('Success' + data['message']);
        this.otpSentinmbl = true;
      },
      (err) => {
        this.loading = false;
        console.log('Failure', err.message);
        console.log('Failure messa []',err['message']);

        this.snackbar.open('Please wait for sometime and retry', 'X', {
          duration: snackbarDuration,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }
}
