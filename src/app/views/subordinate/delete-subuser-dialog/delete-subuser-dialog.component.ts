import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { SubusersTableComponent } from '../subusers-table/subusers-table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'formc-delete-subuser-dialog',
  templateUrl: './delete-subuser-dialog.component.html',
  styleUrls: ['./delete-subuser-dialog.component.scss']
})
export class DeleteSubuserDialogComponent implements OnInit {

subUserDts:any;
userid:string;
  constructor(  private dialogRef: MatDialogRef < SubusersTableComponent > , @Inject(MAT_DIALOG_DATA) data,
    private formcService:FormcServicesService,
    private router:Router,
    private snackbar:MatSnackBar,
  
  ) { 
  this.subUserDts=data.selectedRecord;
   console.log("User id in dele",this.subUserDts);
     this.userid=this.subUserDts.userid;
   
  }


  ngOnInit(): void {
  }
  deleteRecord()
  {  console.log("Inside delete subuser /////////");
    this.dialogRef.close();
   
    this.formcService.deleteSubUser(this.userid).subscribe((data: any) => {
      //   this.openDialog(this.ls.getItem('formCApplid'));
            Swal.fire({
        title:  'Deleted Successfully  User: '+ this.userid,
        icon: 'success',
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result)=>{
        
        window.location.reload();
      });
       
      // Swal.fire(
        
      //   'Deleted Successfully',`Application Id: ${this.applicationId}` , 'success').then((result)=>{
      //     window.location.reload();
      //   });
       },
         (err) => {
        
        
           this.snackbar.open('Something went wrong', 'close', {
             duration: snackbarDuration
           });
           //  alert(
           //    err
           //  )
         },
       );
    
  }
    closedialog()
    {
  this.dialogRef.close();

    }
}
