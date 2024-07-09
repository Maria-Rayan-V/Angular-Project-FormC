import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DateAdapter } from 'angular-calendar';
import { sha256 } from 'js-sha256';
import { mbl_no_regn, snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import { CountryModel } from 'src/app/shared/models/masterModels';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { userNameToRegr, alphabetsSpaceDot, emailValidation } from 'src/app/shared/validationRegex/regexpValidation';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';
import { SubusersTableComponent } from '../subusers-table/subusers-table.component';

@Component({
  selector: 'formc-editadd-subuser-dialog',
  templateUrl: './editadd-subuser-dialog.component.html',
  styleUrls: ['./editadd-subuser-dialog.component.scss']
})
export class EditaddSubuserDialogComponent implements OnInit {
  addSubuserForm: FormGroup = new FormGroup({});
  useridAvailable:boolean=false;
  isFromEdit:boolean=false;
  loading:boolean=false;
  hide = true;
  countries:CountryModel[];
  editUsrDetails:any;
  constructor(private snackbar:MatSnackBar,private jwtAuth:JwtAuthService,private dialogRef: MatDialogRef < SubusersTableComponent > , @Inject(MAT_DIALOG_DATA) data,
    private masterService:MasterServicesService,
    private formcService:FormcServicesService,
    private router:Router,
    private ls:LocalStoreService) { 
      this.addSubuserForm = new FormGroup({
        userid: new FormControl('', [Validators.required, Validators.pattern(userNameToRegr)]),
        user_name: new FormControl('', [Validators.required, Validators.pattern(alphabetsSpaceDot)]),
        password: new FormControl('', ),
        gender: new FormControl('', Validators.required),
        e_mail_id: new FormControl('', [Validators.required,Validators.pattern(emailValidation)]),
        designation: new FormControl(''),
        phone_no: new FormControl('', [Validators.required, Validators.pattern(mbl_no_regn)]),
        nationality: new FormControl('',),
        active: new FormControl('',),
        entered_by: new FormControl('',),
        frro_fro_code:new FormControl(''),
        acco_code:new FormControl('')
      });
      if(data.isFromEdit==false)
      {
        
        console.log("new sub user");
      }else{
         this.isFromEdit=true;
        //  this.addSubuserForm.controls['userid'].disable();
         console.log('is from edit',this.isFromEdit);
        this.editUsrDetails=data.selectedRecord;
   
        this.addSubuserForm.patchValue(this.editUsrDetails);
        this.addSubuserForm.patchValue({
         status:this.editUsrDetails['active']
        });
        this.addSubuserForm.patchValue({
          password:null
        });
        // this.addSubuserForm.get('userid').patchValue(this.editUsrDetails['userid']  );
        console.log("Edit Sub User");
      }
    }
  
  ngOnInit(): void {
   
    this.masterService.getCountry().subscribe((data: CountryModel[]) => {
      this.countries = data;
      //    console.log(JSON.stringify(this.countries,null,2))
    },
      (err) => { 

        this.snackbar.open('Something went wrong', 'close', {
          duration:snackbarDuration
        });
        //  alert(
        //    err
        //  )
      },
    )
  }closeDialog()
  {
this.dialogRef.close();

  }
  checkValidUserForRegn() {
  console.log('Inside check valid user fn');
 this.loading = true;
   
  if(this.addSubuserForm.get('userid').valid){
   const signinData = this.addSubuserForm.value
 
   if (signinData.userid != null && signinData.userid != "") {
     this.jwtAuth.getCaptchaForRegn(signinData.userid).subscribe((data: any) => {
       this.loading = false;
       console.log(JSON.stringify(data, null, 2)); 
       console.log('Success' + data['captcha']);

       if (data['captcha'] != null && data['captcha'] != "") {
          this.useridAvailable=true;
         //  alert('Userid Available');

        //  this.formcCaptcha = data['captcha'];

        //  this.previewCaptcha = 'data:image/jpeg;base64,' + this.formcCaptcha;
         //  this.router.navigate(["sessions/formc-signin"]);
       }
       else {
         this.snackbar.open('Invalid Credentials', 'X', {
           duration: snackbarDuration,
           panelClass: ['error-snackbar'],

         });
       }
     },
       (err) => {

         this.loading = false;
         console.log('Failure in check valid user', err);

         this.snackbar.open('User id associated with some another accomdation. Please enter another userid.', 'X', {
           duration: snackbarDuration,
           panelClass: ['error-snackbar']
         });
         //  alert(
         //    err
         //  )
       },
     );
   }
   else {
    this.snackbar.open('Enter Username', 'X', {
           duration: snackbarDuration,
           panelClass: ['error-snackbar']
         });
   }
  }
  else{
   this.snackbar.open('Enter Valid Username', 'X', {
     duration: snackbarDuration,
     panelClass: ['error-snackbar']
   });
  }

}
updateSubUserDetails() {

  if(this.addSubuserForm.value.password!=null&&this.addSubuserForm.value.password!="")
{
var hashMD5Password = Md5.hashStr(this.addSubuserForm.value.password);

var hashSHAPassword = sha256(hashMD5Password);
this.addSubuserForm.value.password = hashSHAPassword;


}
this.addSubuserForm.value.entered_by=this.ls.getItem('username');
this.addSubuserForm.value.acco_code=this.ls.getItem('accoCode');
this.addSubuserForm.value.frro_fro_code=this.ls.getItem('frroCode');
const subUsrDetails = this.addSubuserForm.value;
if (this.addSubuserForm.valid ) {

this.loading = true;
console.log('inside valid personal',subUsrDetails);
this.formcService.updateSubUserDetails(subUsrDetails).subscribe((data: any) => {
  this.loading = false;


  this.dialogRef.close();


  console.log(JSON.stringify(data, null, 2));
  // this.snackbar.open('Registered successfully', 'X', {
  //   duration: snackbarDuration,
  //   verticalPosition: 'top',
  //   panelClass: ['blue-snackbar']
  // });
  // this.router.navigate(["sessions/signin"]);
  Swal.fire({
    title: 'User Updated successfully',
    icon: 'success',
    showConfirmButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result)=>{
    
    window.location.reload();
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
  },
);

}
else {
this.snackbar.open('Enter all the mandatory fields', 'X', {
  duration: snackbarDuration,
  panelClass: ['error-snackbar'],
});
}
console.log('at fn end');
}
postSubUserDetails() {

      if(this.addSubuserForm.value.password!=null&&this.addSubuserForm.value.password!="")
  {
  var hashMD5Password = Md5.hashStr(this.addSubuserForm.value.password);

  var hashSHAPassword = sha256(hashMD5Password);
  this.addSubuserForm.value.password = hashSHAPassword;
  this.addSubuserForm.value.entered_by=this.ls.getItem('username');
  this.addSubuserForm.value.acco_code=this.ls.getItem('accoCode');
  this.addSubuserForm.value.frro_fro_code=this.ls.getItem('frroCode');

  }
  const subUsrDetails = this.addSubuserForm.value;
  if (this.addSubuserForm.valid ) {
 
    this.loading = true;
    console.log('inside valid personal',subUsrDetails);
    this.formcService.postSubUserDetails(subUsrDetails).subscribe((data: any) => {
      this.loading = false;
 

      this.dialogRef.close();


      console.log(JSON.stringify(data, null, 2));
      // this.snackbar.open('Registered successfully', 'X', {
      //   duration: snackbarDuration,
      //   verticalPosition: 'top',
      //   panelClass: ['blue-snackbar']
      // });
      // this.router.navigate(["sessions/signin"]);
      Swal.fire({
        title: 'User created successfully',
        icon: 'success',
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result)=>{
        
        window.location.reload();
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
      },
    );
 
}
  else {
    this.snackbar.open('Enter all the mandatory fields', 'X', {
      duration: snackbarDuration,
      panelClass: ['error-snackbar'],
    });
  }
  console.log('at fn end');
}
onUsernameChange() {
 console.log('in keypress');
 // this.addSubuserForm.get('password').setValue('');
 this.useridAvailable=false;

   console.log('isusravail',this.useridAvailable)
}

}
