import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'formc-validateuser',
  templateUrl: './validateuser.component.html',
  styleUrls: ['./validateuser.component.scss']
})
export class ValidateuserComponent implements OnInit {
  loading: boolean=false;
  hide = true;
  return: string='';
  errorMsg = '';
  loginForm:any
  constructor( private ls: LocalStoreService,private router:Router,private formbuilder:FormBuilder,  private jwtAuth: JwtAuthService,private snackbar:MatSnackBar) {
    this.loginForm = this.formbuilder.group({
      username:["",[Validators.required]] ,
       password:["",[Validators.required]],
       requestFrom: "",
    })
   }
//    formCSignin() {
//     console.log('inside signin');
//   const signinData = this.loginForm.value
//   this.loading = true;
//   this.jwtAuth.getSalt(signinData.username)
//   .subscribe(response => {
//     this.loading = false;
//     this.router.navigateByUrl(this.return);
//   }, err => {
//     this.loading = false;
//     this.errorMsg = err.message;
//   })
// }
formCSignin() {
  this.loading = true;
  const signinData = this.loginForm.value
  this.jwtAuth.getSalt(signinData.username).subscribe((data:any)=>
  {
    this.loading = false;
      console.log(JSON.stringify(data,null,2));
      console.log('Success'+data['salt']);
         this.ls.setItem('salt',data['salt']);
         this.ls.setItem('captcha',data['captcha']);
      if(data['salt']!=null && data['salt']!='')  { 
        this.ls.setItem('username',signinData.username);
        this.router.navigate(["sessions/formc-signin"]);}
  },
 (err)=>{
  this.loading = false;
  console.log('Failure');
   this.snackbar.open('Something went wrong', '', {
    duration: 1000
  });
  //  alert(
  //    err
  //  )
 },
  );
}
   postAuthData()
   {
     console.log(this.loginForm.value)
   }
 
   
  ngOnInit(): void {
  }
    loginSubmit()
    {
      if (this.loginForm.invalid) {
    
        return;
      }
      else{
        this.router.navigate(["FormC/Home"])
      }
    }

}
