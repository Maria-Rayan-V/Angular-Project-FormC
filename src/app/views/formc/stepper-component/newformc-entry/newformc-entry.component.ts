import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import { FormCDetails } from 'src/app/shared/models/formCModel.model';
import { CountryModel } from 'src/app/shared/models/masterModels';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';

@Component({
  selector: 'formc-newformc-entry',
  templateUrl: './newformc-entry.component.html',
  styleUrls: ['./newformc-entry.component.scss']
})
export class NewformcEntryComponent implements OnInit {
  @Input() stepperNxtFunction: (args:any) => void;  @ViewChild('myStepper') private myStepper: MatStepper;
  pendingDataSearch: any;
  countries: CountryModel[];
  exitsingFormCDetails: FormCDetails[];
  constructor(
    private formcService: FormcServicesService,
    private router: Router, private formbuilder: FormBuilder, private masterService: MasterServicesService, private snackbar: MatSnackBar) {
    this.pendingDataSearch = this.formbuilder.group({
      getNationalitytosearch: ["", [Validators.required]],
      getPptnotosearch: ["", [Validators.required]],
      gender: ["",]
    })
  }
  postSearchData() {
    console.log('inside post');
    if (this.pendingDataSearch.valid) {
      console.log('inside valid');
      this.formcService.getLatestFormC(this.pendingDataSearch.get('getPptnotosearch').value, this.pendingDataSearch.get('getNationalitytosearch').value).subscribe((data: FormCDetails[]) => {
        console.log('inside get appldetails fn');
        this.exitsingFormCDetails = data;
        //   console.log(JSON.stringify(this.exitsingFormCDetails,null,2));
        this.router.navigate(["formc/add-formc-stepper"], { state:
          {
            existingDetails:this.exitsingFormCDetails 
          } });
      },
        (err) => {

          this.snackbar.open('Something went wrong', '', {
            duration: 5
          });
          //  alert(
          //    err
          //  )
        },
      );
    }

  }
  searchFormC() {

  }
  ngOnInit() {
    this.masterService.getCountry().subscribe((data: CountryModel[]) => {
      this.countries = data;
      //    console.log(JSON.stringify(this.countries,null,2))
    },
      (err) => {

        this.snackbar.open('Something went wrong', '', {
          duration: 5
        });
        //  alert(
        //    err
        //  )
      },
    );
  }
}
