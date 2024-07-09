import { Component, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  Validators} from "@angular/forms";
//import { CustomValidators } from "ngx-custom-validators";
import { Router } from "@angular/router";
@Component({
  selector: 'formc-common-reg-form',
  templateUrl: './common-reg-form.component.html',
  styleUrls: ['./common-reg-form.component.scss']
})
export class CommonRegFormComponent implements OnInit {

  getDateToPrintForm: FormGroup; hide = true;
  constructor(private router: Router, private formbuilder: FormBuilder) {
    this.getDateToPrintForm = this.formbuilder.group({
      getFromDate: ["", [Validators.required]],
      getToDate: ["", [Validators.required]],

    })
  }

  postAuthData() {
    console.log(this.getDateToPrintForm.value)
  }

  navigateToSignin()
  {
    this.router.navigate(["sessions/signin"]);
  }
  ngOnInit(): void {
  }
  loginSubmit() {
    if (this.getDateToPrintForm.invalid) {

      return;
    }
    else {
      this.router.navigate(["FormC"])
    }
  }

}
