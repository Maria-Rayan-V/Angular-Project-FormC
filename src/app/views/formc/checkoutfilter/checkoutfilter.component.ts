import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import {
  CountryModel,
  SplCategoryModel,
} from 'src/app/shared/models/masterModels';

@Component({
  selector: 'formc-checkoutfilter',
  templateUrl: './checkoutfilter.component.html',
  styleUrls: ['./checkoutfilter.component.css'],
})
export class CheckoutfilterComponent implements OnInit {
  countries: CountryModel[];
  splCategories: SplCategoryModel[];
  checkOutFilterForm: any;
  hide = true;
  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    private masterService: MasterServicesService
  ) {
    this.checkOutFilterForm = this.formbuilder.group({
      nationality: ['', [Validators.required]],
      pptNum: ['', [Validators.required]],
      dateOfArrival: ['', [Validators.required]],
      applicationId: ['', [Validators.required]],
      visaNum: ['', [Validators.required]],
    });
  }

  postAuthData() {
    console.log(this.checkOutFilterForm.value);
  }

  ngOnInit() {
    this.masterService.getCountry().subscribe(
      (data: CountryModel[]) => {
        this.countries = data;
        //    console.log(JSON.stringify(this.countries,null,2))
      },
      (err) => {
        alert(err);
      }
    );
  }
  loginSubmit(): void {
    if (this.checkOutFilterForm.invalid) {
      return;
    } else {
      this.router.navigate(['FormC']);
    }
  }
}
