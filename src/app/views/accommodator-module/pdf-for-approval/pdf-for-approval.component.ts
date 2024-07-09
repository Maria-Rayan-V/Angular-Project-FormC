import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OwnerDetail } from 'src/app/shared/models/AccommodatorModel.model';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { PdfviewerdialogComponent } from '../../formc-details/pdfviewerdialog/pdfviewerdialog.component';

@Component({
  selector: 'formc-pdf-for-approval',
  templateUrl: './pdf-for-approval.component.html',
  styleUrls: ['./pdf-for-approval.component.scss']
})
export class PdfForApprovalComponent implements OnInit {

  accoCode:any; 
  
  accommodatorDetails:any;
  userId:any;
  frroCode:any;
  ownerDetails: MatTableDataSource<OwnerDetail>;
  displayedColumns: string[] = ['name','address','state','cityDist','emailId','phoneNum','mobile']; 
    constructor( private router:Router,private formcService:FormcServicesService,
      private dialog:MatDialog,
      private ls:LocalStoreService) {
      // let nav: Navigation = this.router.getCurrentNavigation(); 
      if(this.ls.getItem('accoCodeForRegn')!=null)
      {
    this.accoCode=this.ls.getItem('accoCodeForRegn');
    this.  userId=this.ls.getItem('verifiedUser');
    this.frroCode=this.ls.getItem('frroCodeRegn');
      }
      if(this.ls.getItem('accoCode')!=null)
      {
        this.accoCode=this.ls.getItem('accoCode');
        this.  userId=this.ls.getItem('username');
        this.frroCode=this.ls.getItem('frroCode');
      }
       // console.log('Inside Stepper nav with Acco',nav.extras.state['accoCode']);
       if(this.accoCode!=null)
       {
      this.formcService.getAccomodatorDetails(this.accoCode,this.frroCode,this.userId).subscribe((data: any) => {
        this.accommodatorDetails = data;
        this.ownerDetails=this.accommodatorDetails['ownerDetails'];
      console.log(
        'Acco details in nav',this.ownerDetails[
         0
        ]
      )
      },
        (err) => {
         
        },
      );
      }
     
     
     
   
  }
    ngOnInit(): void {
    }
    getPdfForApproval() {
      console.log('userid',this.userId);
      
      // this.router.navigate(["sessions/formc-signin"]);
      this.formcService.getPdfForApproval(this.userId).subscribe(res => {
        const fileURL = URL.createObjectURL(res);
        // this.pdfFilePath=fileURL;
    //  window.open(fileURL, '_blank');
    this.router.navigate(["regn/regn-home"]);
    this.OpenDialog(fileURL);
      });
    }
  
    OpenDialog( obj: any) {
 
      const dialogRef = this.dialog.open(PdfviewerdialogComponent, {
        height:'90%',
           width: '100%',
        data: obj,
        disableClose: true,
      });
  
  
      
  }
}
