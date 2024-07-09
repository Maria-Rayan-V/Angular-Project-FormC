import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'formc-changepasscomp',
  templateUrl: './changepasscomp.component.html',
  styleUrls: ['./changepasscomp.component.css'],
})
export class ChangepasscompComponent implements OnInit {
  changePassForm: any;
  hide = true;
  newPasswordHide = true;
  confirmPasswordHide = true;
  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private ls: LocalStoreService,
    private formcService: FormcServicesService
  ) {
    this.changePassForm = this.formbuilder.group({
      password: ['', [Validators.required]],
      newpassword: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
      frro_fro_code: [''],
    });
  }

  postChangePasswordData() {
    console.log(this.changePassForm.value);
    this.changePassForm.value.frro_fro_code = this.ls.getItem('frroCode');

    var hashMD5Password = Md5.hashStr(this.changePassForm.value.password);

    var hashSHAPassword = sha256(hashMD5Password);
    this.changePassForm.value.password = hashSHAPassword;
    const changePasswordData = this.changePassForm.value;
    this.formcService.postChangePasswordDetails(changePasswordData).subscribe(
      (data: any) => {
        Swal.fire({
          title: 'Password Changed Successfully',
          icon: 'success',
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          this.router.navigate(['sessions/formc-signin']);
        });
        // Swal.fire(

        //   'Password Changed Successfully','', 'success').then((result)=>{
        //     this.router.navigate(["sessions/formc-signin"]);
        //  });

        //      this.stepperNxtFunction(this.myStepper);
        console.log(JSON.stringify(data, null, 2));
      },
      (err) => {
        // this.tempidGenerationForm.setErrors({valid: false});
        console.log('Inside fail change pswd', err.error);
        this.snackbar.open('Something went wrong', '', {
          duration: 1000,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }

  ngOnInit(): void {}
}
