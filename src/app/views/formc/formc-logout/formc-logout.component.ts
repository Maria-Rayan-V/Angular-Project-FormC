import { Component, OnInit } from '@angular/core';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'formc-formc-logout',
  templateUrl: './formc-logout.component.html',
  styleUrls: ['./formc-logout.component.scss']
})
export class FormcLogoutComponent implements OnInit {

  constructor(private jwtAuth:JwtAuthService) { }

  ngOnInit(): void {
 this.   jwtAuth.signout()
  }

}
