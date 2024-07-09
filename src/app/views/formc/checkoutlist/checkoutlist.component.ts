import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormCDetails } from 'src/app/shared/models/formCModel.model';
import { PendingListModel } from 'src/app/shared/models/formcPendingList.model';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';

@Component({
  selector: 'formc-checkoutlist',
  templateUrl: './checkoutlist.component.html',
  styleUrls: ['./checkoutlist.component.scss']
})
export class CheckoutlistComponent implements OnInit {
  pendingFormCList: any;
  dataSource: MatTableDataSource<PendingListModel>;
  length: any;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15];
  showFirstLastButtons = true;
  pendingFormCDetails: any;
  constructor(
private formcService:FormcServicesService,
private router:Router,
private snackbar:MatSnackBar

  ) { }
  displayedColumns: string[] = ['name', 'country_outside_india_desc', 'passnum', 'dob', "getdetails"];
  ngOnInit(): void {
  }
 
}
