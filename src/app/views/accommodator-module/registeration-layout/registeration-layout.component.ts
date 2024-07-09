import { Component, OnInit } from '@angular/core';
import { Navigation, Router } from '@angular/router';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { RegnNavService } from 'src/app/shared/services/regnNav.service';

@Component({
  selector: 'formc-registeration-layout',
  templateUrl: './registeration-layout.component.html',
  styleUrls: ['./registeration-layout.component.scss']
})
export class RegisterationLayoutComponent implements OnInit {
  isExpanded: boolean = true;
  isChecked=false;
  isApprovedUser:String;
  isRegAppFinalSubmit:String;
  isAddDisabled:boolean=false;
  isSubmitDisabled:boolean=false;
  isSubmitDisabledFromAdd:boolean;
  isAddDisabledFromSub:boolean;
  isPdfDisabled:boolean=false;
  userName:string;
  constructor(private router: Router,private ls:LocalStoreService,
    private regnNav:RegnNavService,
    public jwtAuth: JwtAuthService,) { 
    let nav: Navigation = this.router.getCurrentNavigation(); 
    if (nav.extras && nav.extras.state && nav.extras.state['userId'] != null) {
      console.log('Inside Stepper nav with data',nav.extras.state['userId']);
       this.isApprovedUser=nav.extras.state['isApproved'];
       this.isRegAppFinalSubmit=nav.extras.state['isFinalSubmit'];
       this.ls.setItem('verifiedUser',nav.extras.state['userId']);
       this.ls.setItem('accoCodeForRegn',nav.extras.state['accoCode']);
    
    }
  }

  ngOnInit(): void {
    this.userName=this.ls.getItem('username');

    if((this.ls.getItem('isRegAppFinalSubmit')=='Y'))
    {
      // this.isAddDisabled=true;
      this.regnNav.editisAddDisabled(true);
    }
    else{
      this.regnNav.editisAddDisabled(false);
    }
     if(((this.ls.getItem('accoCode')==null) && (this.ls.getItem('accoCodeForRegn')==null))||(this.ls.getItem('isRegAppFinalSubmit')=='Y'))
     {
      //  this.isSubmitDisabled=true;
       this.regnNav.editisSubmitDisabled(true);
     } 
     else{
      this.regnNav.editisSubmitDisabled(false);
     }
     if((this.ls.getItem('isRegAppFinalSubmit')=='N'))
     {
      //  this.isPdfDisabled=true;
       this.regnNav.editisPdfDisabled(true);
     } 
     else{
      this.regnNav.editisPdfDisabled(false);
     }
     this.regnNav.castisSubmitDisabled.subscribe((user) => (this.isSubmitDisabled = user));
     this.regnNav.castisAddDisabled.subscribe((user) => (this.isAddDisabled= user));
     this.regnNav.castisPdfDisabled.subscribe((user) => (this.isPdfDisabled= user));
     console.log('issubmitdisa in ',this.isSubmitDisabled);
  } 


}
