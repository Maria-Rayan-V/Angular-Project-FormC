import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'formc-getdatetoprint',
  templateUrl: './getdatetoprint.component.html',
  styleUrls: ['./getdatetoprint.component.css'],
})
export class GetdatetoprintComponent implements OnInit {
  getDateToPrintForm: any;
  hide = true;
  constructor(private router: Router, private formbuilder: FormBuilder) {
    this.getDateToPrintForm = this.formbuilder.group({
      getFromDate: ['', [Validators.required]],
      getToDate: ['', [Validators.required]],
    });
  }

  postAuthData() {
    console.log(this.getDateToPrintForm.value);
  }

  ngOnInit(): void {}
  loginSubmit() {
    if (this.getDateToPrintForm.invalid) {
      return;
    } else {
      this.router.navigate(['FormC']);
    }
  }
}
