import { Component, OnInit, ViewChild } from "@angular/core";
import {
  Validators,
  FormControl,
  FormBuilder,
  FormGroup,
  FormArray
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTable, MatTableDataSource } from "@angular/material/table";
//import { CustomValidators } from "ngx-custom-validators";
import { matxAnimations } from "src/app/shared/animations/matx-animations";
import { CountryModel, StateModel, DistrictModel } from "src/app/shared/models/masterModels";
import { OwnerinfodialogComponent } from "../../others/ownerinfodialog/ownerinfodialog.component";
const ownerDetails=[];
// const addinlplaceofvisit: AddnlPlaceofVisit[] = [];
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  animations: matxAnimations
})

export class SignupComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  signupForm: FormGroup=new FormGroup({});
  DsAddnlPlaceofvisit:any;
  selected:any;
  countries: CountryModel[];
  states: StateModel[];
  districts: DistrictModel[];hide = true;
  constructor(private fb: FormBuilder,
    private dialog:MatDialog) {}
    displayColumn: string[] = ['name','address', 'state', 'city','emailId','phnNum','mblNum','action']; 
  ngOnInit() {
    const password = new FormControl("", Validators.required);
    const confirmPassword = new FormControl(
      "",
      //CustomValidators.equalTo(password)
      Validators.required
    );

    this.signupForm = this.fb.group({
      // UserId: ["", Validators.required],
      // password: ["", [Validators.required, Validators.email]],
      // confirmPassword:["", Validators.required],
      // securityQuestion:["", Validators.required],
      // yourAnswer :["", Validators.required],
      // name  :["", Validators.required],
      // gender   :["", Validators.required],
      // dob  :["", Validators.required],
      // designation  :["", Validators.required],
      // emailId  :["", Validators.required],
      // mobile   :["", Validators.required],
      // phnNum:["", Validators.required],
      // nationality:["", Validators.required],
      // hotelName:["", Validators.required],
      // capacity:["", Validators.required],
      // address:["", Validators.required],
      // state:["", Validators.required],
      // city:["", Validators.required],
      // accoType:["", Validators.required],
      // accoGrade:["", Validators.required],
      // hotelEmailid:["", Validators.required],
      // hotelMobile:["", Validators.required],
      // hotelPhnnum:["", Validators.required],
       ownerDetails: this.fb.array([this.initItemRows()])
    });
  }
  get formArr() {
    return this.signupForm.get('ownerDetails') as FormArray;
  }
  initItemRows() {
    return this.fb.group({
    name:[''],
    address:[''],
    state:[''],
    city:[''],
    emailId:[''],
    phnnum:[''],
    mblnum:['']
    });
  }
  // initItemRows() {
  //   return this.fb.group({
  //   ownerName:[''],
  //   ownerAddress:[''],
  //   ownerState:[''],
  //   ownerCity:[''],
  //   ownerEmail:[''],
  //   ownerPhn:[''],
  //   ownerMbl:['']
  //   });
  // }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }
  onSubmit() {
    if (!this.signupForm.invalid) {
      // do what you wnat with your data
      console.log(this.signupForm.value);
    }
  }
  OpenDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OwnerinfodialogComponent, {
      height:'600px',
      width: '700px',
      data: obj,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
		
switch (action) {
        case 'Add':
          if (result.action == 'Cancel') {
            console.log('Dialog Closed');
          } else {          
            console.log('Result',result.data.formvalue );
            // this.addnlplaceofvisit = result.data;
            ownerDetails.push({
              name: result.data.formvalue.name,
              address: result.data.formvalue.address,
              state: result.data.formvalue.state,
              city: result.data.formvalue.city,
              phnNum: result.data.formvalue.phnNum,
              mblNum:
                result.data.formvalue.mblNum,
                emailId: result.data.formvalue.emailId,
                stateDesc:result.data.stateDesc,
                cityDesc:result.data.cityDesc
            });
            this.DsAddnlPlaceofvisit = new MatTableDataSource(
              ownerDetails
            );
            // console.log('owner details',ownerDetails);
            this.table.renderRows();
          }
          break;
case 'Delete':
          if (result.action == 'Cancel') {
            console.log('Dialog Closed');
          } else {
            console.log(result);
            let index = ownerDetails.indexOf(result.data);
            ownerDetails.splice(index, 1);
            this.DsAddnlPlaceofvisit = new MatTableDataSource(
              ownerDetails
            );
          }
          break;
	}

}

    )
}
}


