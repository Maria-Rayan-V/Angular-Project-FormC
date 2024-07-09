import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { JwtAuthService } from "../services/auth/jwt-auth.service";
import { LocalStoreService } from "../services/local-store.service";

@Injectable()
export class AuthGuard implements CanActivate {
isActiveUser:String;
  constructor(private router: Router, private jwtAuth: JwtAuthService) {
  // this.isActiveUser=ls.getItem('isApprovedUser');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.jwtAuth.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(["/sessions/signin"], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
  }
}