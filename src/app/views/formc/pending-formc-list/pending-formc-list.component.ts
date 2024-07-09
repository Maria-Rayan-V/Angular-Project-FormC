import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PendingListModel } from 'src/app/shared/models/formcPendingList.model';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'formc-pending-formc-list',
  templateUrl: './pending-formc-list.component.html',
  styleUrls: ['./pending-formc-list.component.scss'],
})
export class PendingFormcListComponent implements OnInit {
  pendingFormCList: any;
  dataSource: MatTableDataSource<PendingListModel>;
  length: any;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15];
  showFirstLastButtons = true;
  pendingFormCDetails: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ls: LocalStoreService,
    private formcService: FormcServicesService,
    private snackbar: MatSnackBar
  ) {
    // let nav: Navigation = this.router.getCurrentNavigation();
    // if (nav.extras && nav.extras.state && nav.extras.state[0] != null) {
    //   console.log('inside nav');
    //   console.log('nav extras', nav.extras.state);
    //   console.log('/////////');
    //   this.pendingFormCList = nav.extras.state;
    //   localStorage.setItem('pending-formc-list', JSON.stringify(this.pendingFormCList));
    //   var fromLs= JSON.parse(localStorage.getItem('pending-formc-list'));
    //   console.log('Form LS',fromLs);
    //   this.dataSource = new MatTableDataSource(fromLs);
    //   this.length = this.pendingFormCList.length;
    //   console.log('length ', this.length);
    // }
  }
  ngOnInit() {
    this.cdr.detectChanges();
    var pptNotoSearch = this.ls.getItem('pendingSearchPptno');
    var nationalityToSearch = this.ls.getItem('pendingSearchNationality');
    var accoCode = this.ls.getItem('accoCode');
    var frroCode = this.ls.getItem('frroCode');

    this.formcService.getPendingFormC(accoCode, frroCode).subscribe(
      (data: PendingListModel[]) => {
        console.log('inside get appldetails fn');
        this.pendingFormCDetails = data;
        console.log('After stored');
        this.dataSource = new MatTableDataSource(this.pendingFormCDetails);

        this.dataSource.paginator = this.paginator;
        console.log('after datasource');
        console.log('/////////');

        //  this.length = this.pendingFormCList.length;
        console.log('length ', this.length);

        //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
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
  onTableClick(tableIndex: any) {
    console.log(tableIndex);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayedColumns: string[] = [
    'name',
    'country_outside_india_desc',
    'passnum',
    'dob',
    'getdetails',
  ];
  // handlePageEvent(event: PageEvent) {
  //   this.length = event.length;
  //   this.pageSize = event.pageSize;
  //   this.pageIndex = event.pageIndex;
  // }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // ngAfterViewInit() {

  //   this.dataSource.paginator = this.paginator;

  // }
}
