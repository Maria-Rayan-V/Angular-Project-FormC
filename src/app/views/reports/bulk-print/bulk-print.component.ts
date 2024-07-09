import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CURRENT_DATE } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { PdfviewerdialogComponent } from '../../formc-details/pdfviewerdialog/pdfviewerdialog.component';

@Component({
  selector: 'formc-bulk-print',
  templateUrl: './bulk-print.component.html',
  styleUrls: ['./bulk-print.component.css']
})
export class BulkPrintComponent implements OnInit {
  @Input() public isSubUser: boolean=false;
  @Input() public isGenSummSubuser:boolean=false;
  maxDate:any;
  generateSummaryForm: any; hide = true;
  constructor(private router: Router, private dialog:MatDialog, private formbuilder: FormBuilder, private formcService:FormcServicesService,
    private ls:LocalStoreService     
    ) {
    this.generateSummaryForm = this.formbuilder.group({
 
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      acco_code:[''],
      frro_fro_code:[''],
      entered_by:['']
    })
  }

  
  postSummaryData() {
  console.log(  this.generateSummaryForm.value);
  var startDate= this.generateSummaryForm.value.from_date.format('DD-MM-YYYY');
   var endDate=this.generateSummaryForm.value.to_date.format('DD-MM-YYYY');
   var startDate1=moment(startDate, 'DD-MM-YYYY');
   var endDate1=moment(endDate, 'DD-MM-YYYY');
   var dayDiff = endDate1.diff(startDate1, 'days');
      console.log('Days:' + dayDiff);
    let fromDate = new DatePipe('en-Us').transform(
      this.generateSummaryForm.value.from_date,
      'dd/MM/yyyy'
    );
    this.generateSummaryForm.value.from_date =fromDate ;
     
    let toDate = new DatePipe('en-Us').transform(
      this.generateSummaryForm.value.to_date,
      'dd/MM/yyyy'
    );
    this.generateSummaryForm.value.to_date =toDate ;
    this.generateSummaryForm.value.entered_by=this.ls.getItem('username');
    this.generateSummaryForm.value.acco_code=this.ls.getItem('accoCode');
    this.generateSummaryForm.value.frro_fro_code=this.ls.getItem('frroCode');
    const requestData = this.generateSummaryForm.value;
       if(this.generateSummaryForm.valid && dayDiff <=30)
       { 
       if(this.isSubUser==true)
       {
        this.formcService.getBulkFormCSubuser(requestData).subscribe(res => {
          const fileURL = URL.createObjectURL(res);
          // this.pdfFilePath=fileURL;
          this.generateSummaryForm.reset();
        
       this.OpenDialog(fileURL);
      //  window.open(fileURL, '_blank');
        });
       }
        else if(this.isGenSummSubuser==true)
        {
          this.formcService.getSummarySubuser(requestData).subscribe(res => {
            const fileURL = URL.createObjectURL(res);
            // this.pdfFilePath=fileURL;
            this.generateSummaryForm.reset();
          
         this.OpenDialog(fileURL);
        //  window.open(fileURL, '_blank');
          });
        }
       else{
    this.formcService.getBulkFormC(requestData).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      // this.pdfFilePath=fileURL;
      this.generateSummaryForm.reset();
    
   this.OpenDialog(fileURL);
  //  window.open(fileURL, '_blank');
    });
   }
  
 
 
  
}
else{
  alert('Enter Required Fields, Date range cannot be more than 30 days.');
}
  }


  ngOnInit(): void {
    this.maxDate = CURRENT_DATE;
    console.log('is subuser',this.isSubUser);
  }
  
  loginSubmit() {
    if (this.generateSummaryForm.valid) {
      console.log(this.generateSummaryForm.value)
    
    }
  
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
