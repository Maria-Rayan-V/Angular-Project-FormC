import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MasterServicesService } from 'src/app/shared/masterServices/master-services.service';
import { PendingListModel } from 'src/app/shared/models/formcPendingList.model';
import { CountryModel } from 'src/app/shared/models/masterModels';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'app-pending-search',
  templateUrl: './pending-search.component.html',
  styleUrls: ['./pending-search.component.scss'],
})
export class PendingSearchComponent implements OnInit {
  pendingDataSearch: any;
  countries: CountryModel[];
  pendingFormCDetails: PendingListModel[];
  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private formcService: FormcServicesService,
    private masterService: MasterServicesService,
    private ls: LocalStoreService
  ) {
    this.pendingDataSearch = this.formbuilder.group({
      getNationalitytosearch: [''],
      getPptnotosearch: [''],
      gender: [''],
    });
  }
  postSearchData() {
    console.log('inside post');
    if (this.pendingDataSearch.valid) {
      console.log('inside valid');
      this.ls.setItem(
        'pendingSearchPptno',
        this.pendingDataSearch.get('getPptnotosearch').value
      );
      this.ls.setItem(
        'pendingSearchNationality',
        this.pendingDataSearch.get('getNationalitytosearch').value
      );
      this.router.navigate(['formc/pending-formc-list']);
    }
  }
  ngOnInit() {
    this.masterService.getCountry().subscribe(
      (data: CountryModel[]) => {
        this.countries = data;
        //    console.log(JSON.stringify(this.countries,null,2))
      },
      (err) => {
        this.snackbar.open('Something went wrong', '', {
          duration: 5,
        });
        //  alert(
        //    err
        //  )
      }
    );
  }
}
