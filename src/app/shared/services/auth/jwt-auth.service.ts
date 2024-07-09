import {
  CHECK_PSWD_UPDT_DTS,
  IH_USER_ACTIVATION,
  POST_PSWD_UPDT_DTS,
} from './../../FormCConstants/formcUrlCons';
import { Injectable } from '@angular/core';
import { LocalStoreService } from '../local-store.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError, delay } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { of, BehaviorSubject, throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AUTHENTICATE_URL,
  GET_EMAIL_OTP,
  GET_MOBILE_OTP,
  GET_SALT_URL,
  GET_SPLCATEGORY_URL,
  POST_USER_REGN_DTS,
  REFRESH_CAPTCHA_URL,
  snackbarDuration,
  VALIDUSER_REGN_CAPTCHA,
} from '../../FormCConstants/formcUrlCons';
import { SplCategoryModel } from '../../models/masterModels';
import { sha256 } from 'js-sha256';
import { Md5 } from 'ts-md5';
import { FormcServicesService } from '../formc-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegnNavService } from '../regnNav.service';

// ================= only for demo purpose ===========
const DEMO_TOKEN =
  'eyJfaWQiOiI1YjhkNDc4MDc4NmM3MjE3MjBkYzU1NzMiLCJlbWFpbCI6InJhZmkuYm9ncmFAZ21haWwuY29tIiwicm9sZSI6IlNBIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE1ODc3MTc2NTgsImV4cCI6MTU4ODMyMjQ1OH0.dXw0ySun5ex98dOzTEk0lkmXJvxg3Qgz4ed';

const DEMO_USER: User = {
  id: '4sa00c45639d2c0c54b354ba',
  displayName: 'John Doe',
  role: 'Admin',
};
// ================= you will get those data from server =======

@Injectable({
  providedIn: 'root',
})
export class JwtAuthService {
  token: any;
  isAuthenticated: Boolean = false;
  user: User = {};
  user$ = new BehaviorSubject<User>(this.user);
  signingIn: Boolean = false;
  gettingSalt: Boolean = false;
  JWT_TOKEN = 'JWT_TOKEN';
  APP_USER = 'APP_USER';

  constructor(
    private ls: LocalStoreService,
    private http: HttpClient,

    private snackbar: MatSnackBar,
    private router: Router,
    private formcService: FormcServicesService,
    private regnNav: RegnNavService
  ) {}
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('An error occured. Please try again later.');
  }

  public getSalt(username: string): Observable<any> {
    console.log(GET_SALT_URL + username);
    return this.http
      .get<any>(`${GET_SALT_URL}${username}`)
      .pipe(catchError(this.handleError));
  }
  public generateMblOTP(username: string, mblNum: string): Observable<any> {
    console.log(GET_MOBILE_OTP + username + '/' + mblNum);
    return this.http
      .get<any>(`${GET_MOBILE_OTP}${username}/${mblNum}`)
      .pipe(catchError(this.handleError));
  }
  public generateMailOTP(username: string, mail: string): Observable<any> {
    console.log(GET_EMAIL_OTP + username + '/' + mail);
    return this.http
      .get<any>(`${GET_EMAIL_OTP}${username}/${mail}`)
      .pipe(catchError(this.handleError));
  }
  public getCaptchaForRegn(username: string): Observable<any> {
    console.log(VALIDUSER_REGN_CAPTCHA + username);
    return this.http
      .get<any>(`${VALIDUSER_REGN_CAPTCHA}${username}`)
      .pipe(catchError(this.handleError));
  }
  public refreshCaptcha(username: string): Observable<any> {
    return this.http.get(`${REFRESH_CAPTCHA_URL}${username}`, {
      responseType: 'text',
      observe: 'response',
    });
    //   console.log('Refresh captcha url',REFRESH_CAPTCHA_URL+username);
    //  return this.http.get<any>(`${REFRESH_CAPTCHA_URL}${username}`,).pipe(catchError(this.handleError));
  }
  public postRegnDetails(regnDetails: any): Observable<any> {
    console.log('data ' + regnDetails);

    return this.http.post(POST_USER_REGN_DTS, regnDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postPswdDetails(regnDetails: any): Observable<any> {
    console.log('data ' + regnDetails);

    return this.http.post(POST_PSWD_UPDT_DTS, regnDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public checkPswdDetails(regnDetails: any): Observable<any> {
    console.log('data ' + regnDetails);

    return this.http.post(CHECK_PSWD_UPDT_DTS, regnDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public userActivationDetails(usrDetails: any): Observable<any> {
    return this.http.post(IH_USER_ACTIVATION, usrDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public formcSignin(
    username: string,
    password: string,
    captcha: string
  ): Observable<any> {
    console.log('in signin');

    var formcUsername = this.ls.getItem('username');
    var formcSalt = this.ls.getItem('salt');
    var usrTypeCode = this.ls.getItem('userTypeCode');
    console.log('User type code', usrTypeCode);
    if (usrTypeCode == '4') {
      console.log('Inside only md5');
      var hashMD5Password = Md5.hashStr(password);
      var combinedVal = hashMD5Password + formcSalt;
      var hashSHACombined = Md5.hashStr(combinedVal);
    } else {
      var hashMD5Password = Md5.hashStr(password);
      console.log('md5 password  ' + hashMD5Password);
      var hashSHAPassword = sha256(hashMD5Password);
      console.log('SHA password  ' + hashSHAPassword);
      var hashSHASalt = sha256(formcSalt);
      console.log('salt SHA  ' + hashSHASalt);
      var saltPasswordcombined = hashSHAPassword + hashSHASalt;
      var hashSHACombined = sha256(saltPasswordcombined);
      console.log('final password  ' + hashSHACombined);
    }
    var data = JSON.stringify({
      username: formcUsername,
      password: hashSHACombined,
      requestFrom: 'frmcapp',
      captcha: captcha,
    });
    const headers = {
      Accept: 'application/json',
      'content-type': 'application/json',
    };
    console.log('data ' + data);
    this.signingIn = true;
    return this.http.post(AUTHENTICATE_URL, data, { headers: headers }).pipe(
      map((res: any) => {
        console.log('signinres' + res['token'] + res['username']);
        this.setUserAndToken(res['token'], res['username'], !!res);
        this.ls.setItem('username', res['username']);
        this.ls.setItem('isApprovedUser', res['isApprovedUser']);
        this.ls.setItem('useremailId', res['useremailId']);
        this.ls.setItem('mobileNo', res['mobileNo']);
        this.ls.setItem('accoCode', res['acco_code']);
        this.ls.setItem('accoName', res['acco_name']);
        this.ls.setItem('frroCode', res['frro_fro_code']);
        this.ls.setItem('lastLogin', res['lastLogin']);
        this.ls.setItem('frroName', res['frroFroDesc']);
        this.ls.setItem('accoAddr', res['acco_address']);
        this.ls.setItem('accoCity', res['acco_city_district_name']);
        this.ls.setItem('isRegAppFinalSubmit', res['isRegAppFinalSubmit']);
        this.ls.setItem('usrTypeCode', res['user_Type_Code']);
        this.ls.setItem('accoType', res['acco_type']);
        this.ls.setItem('hosRegnNo', res['hosRegnNo']);
        this.signingIn = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  /*
    checkTokenIsValid is called inside constructor of
    shared/components/layouts/admin-layout/admin-layout.component.ts
  */
  public checkTokenIsValid() {
    console.log('in checkTokenIsValid');
    return of(DEMO_USER).pipe(
      map((profile: User) => {
        this.setUserAndToken(this.getJwtToken(), profile, true);
        this.signingIn = false;
        return profile;
      }),
      catchError((error) => {
        return of(error);
      })
    );

    /*
      The following code get user data and jwt token is assigned to
      Request header using token.interceptor
      This checks if the existing token is valid when app is reloaded
    */

    // return this.http.get(`${environment.apiURL}/api/users/profile`)
    //   .pipe(
    //     map((profile: User) => {
    //       this.setUserAndToken(this.getJwtToken(), profile, true);
    //       return profile;
    //     }),
    //     catchError((error) => {
    //       return of(error);
    //     })
    //   );
  }

  public signout() {
    //this.setUserAndToken(null, null, false);
    this.regnNav.editaccoCodeRegn(null);
    this.regnNav.editfrroCodeRegn(null);
    this.formcService.logoutFunc().subscribe(
      (data: any) => {
        console.log('data in final submit ', data);
        this.setUserAndToken('', {}, false);
        //  this.length = this.pendingFormCList.length;
        //   console.log(JSON.stringify(this.pendingFormCDetails,null,2));
      },
      (err) => {
        this.snackbar.open('Something went wrong', '', {
          duration: snackbarDuration,
        });
        //  alert(
        //    err
        //  )
      }
    );
    this.router.navigateByUrl('sessions/signin');
  }

  isLoggedIn(): Boolean {
    console.log(this.getJwtToken());
    return !!this.getJwtToken();
  }

  getJwtToken() {
    console.log('Inside get token');
    console.log(sessionStorage.getItem(this.JWT_TOKEN));
    return sessionStorage.getItem(this.JWT_TOKEN);
  }
  getUser() {
    return this.ls.getItem(this.APP_USER);
  }

  setUserAndToken(token: string, user: any, isAuthenticated: Boolean) {
    this.isAuthenticated = isAuthenticated;
    this.token = token;
    this.user = user;
    this.user$.next(user);
    // this.ls.setItem(this.JWT_TOKEN, token);
    // this.ls.setItem(this.APP_USER, user);
    sessionStorage.setItem(this.JWT_TOKEN, token);
    sessionStorage.setItem(this.APP_USER, user);
  }
}
