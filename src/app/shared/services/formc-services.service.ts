import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  CHANGE_PASSWORD_URL,
  GET_FORMC_COUNT,
  DELETE_PENDING_RECORD_BYAPPLID,
  FINAL_SUBMIT_URL,
  GENERATE_APPLID,
  GENERATE_SUMMARY_ARRIVAL,
  GENERATE_SUMMARY_DEPARTURE,
  GENERATE_SUMMARY_FORMCFEDDURING,
  GET_ACCOM_DETAILS,
  GET_APPDETAILSBY_PASSPORTANDNATIONALITY_URL,
  GET_APPLICANT_FULLDETAILS_URL,
  GET_ARRIVAL_DETAIL_URL,
  GET_DEPARTEDBY_ACCOFRRO,
  GET_FORMC_PENDINGAPPL_BYPASSNOANDNAT,
  GET_FORMC_SUBMITTEDAPPLBY_PPTNOANDNAT,
  GET_FORMC_TEMPDETAILSBYAPPLID,
  GET_PENDINGBY_ACCOFRRO,
  GET_PENDINGFORCHECKOUTBY_ACCOFRRO,
  LOGOUT_URL,
  PHOTO_UPLOAD_URL,
  POST_ACCOM_DTS,
  POST_ARRIVALNXTDEST_DETAILS,
  POST_DEPART_DETAIL_URL,
  POST_PASSPORTVISA_DETAILS,
  POST_PERSONAL_DETAILS,
  POST_REFERENCEOTHERS_DETAILS,
  POST_USR_PROF,
  PRINT_DEPARTEDBY_APPLID,
  REG_FORM_FINAL_SUBMIT,
  REG_FORM_PDF,
  UPDATE_ACCOM_DETAILS,
  POST_SUBUSER,
  GET_SUBUSER_DETAILS,
  DELETE_SUB_USER,
  UPDATE_SUBUSER_DETAILS,
  GENERATE_SUMMARY_BULK,
  GET_DEPARTED_SUBUSER,
  GET_PENDINGFORCHECKOUT_SUBUSER,
  GET_PENDINGLST_SUBUSER,
  BULK_FORMC_SUBUSER,
  GENERATE_SUMMARY_SUBUSER,
  GET_SUBUSERS,
  GENERATE_SUMMARY_ALL_SUBUSER,
  BULK_PRINT_ALL_SUBUSER,
  DOC_UPLOAD_URL,
  DOC_DOWNLOAD_URL,
  GENERATE_MEDVISA_REFNO,
  POST_MEDVISA_DETAILS,
  POST_PATIENT_DETAILS,
  POST_TREATMENT_DETAILS,
  POST_ATTENDANT_DETAILS,
  GET_PENDING_MEDVISA,
  GET_MEDVISA_BY_ID,
  UPDATE_MEDVISA_REFNODTS,
  MEDVISA_FINAL_SUBMIT,
  MEDVISA_PENDING_DELETE,
  MEDVISA_PDF,
  GET_SUBMITTED_MEDVISA,
  GET_SUBMITTED_MEDVISA_DTS,
  GET_MEDVISA_EXTN,
  UPDATE_PATIENT_DTS,
  MEDVISA_EXTN_REFNO,
  MEDVISA_EXTN_FINAL_SUBMIT,
  CHECK_CAPTCHA_URL,
  FORMC_INDIVIDUAL_PDF,
  GET_UNAPPROVED_USERDTS,
  APPROVE_USERS,
  PENDING_UNAPPROVED_USR,
} from '../FormCConstants/formcUrlCons';
import { AccomodatorModel } from '../models/AccommodatorModel.model';
import { SubmittedListModel } from '../models/formc-submittedlistmode.model';
import { FormCDetails } from '../models/formCModel.model';
import { PendingListModel } from '../models/formcPendingList.model';
import { SubUserListModel } from '../models/SubUserListModel';
import { LocalStoreService } from './local-store.service';
import { MedVisaModel } from '../models/MedVisaModel.model';
import { DraftMedvisaModel } from '../models/DraftMedvisa.model';

@Injectable({
  providedIn: 'root',
})
export class FormcServicesService {
  loading: boolean;
  constructor(private http: HttpClient, private ls: LocalStoreService) {}
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
  public generateApplId(genAppidData: any): Observable<any> {
    console.log('in genr appid');
    console.log('data ' + genAppidData);
    this.loading = true;
    return this.http.post(GENERATE_APPLID, genAppidData).pipe(
      map((res: any) => {
        console.log('genappid' + res);

        this.loading = false;
        this.ls.setItem('formCApplid', res['form_c_appl_id']);
        this.ls.setItem('gender', res['gender']);
        this.ls.setItem('nationality', res['nationality']);
        this.ls.setItem('givenName', res['given_name']);
        this.ls.setItem('surname', res['surname']);
        this.ls.setItem('passportNumber', res['passnum']);

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public generateMedvisaRefno(genRefnoData: any): Observable<any> {
    console.log('in genr appid');
    console.log('data ' + genRefnoData);
    this.loading = true;
    return this.http.post(GENERATE_MEDVISA_REFNO, genRefnoData).pipe(
      map((res: any) => {
        console.log('genappid' + res);

        this.loading = false;

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public photoUpload(base64ImgString: any): Observable<any> {
    console.log('in photo upload');
    console.log('data ' + base64ImgString);
    var newApplicationId = this.ls.getItem('formCApplid');
    const headers = {
      Accept: 'application/json',
      'content-type': 'application/json',
    };
    var data = JSON.stringify({
      form_c_appl_id: newApplicationId,
      img: base64ImgString,
    });
    this.loading = true;
    return this.http
      .post(PHOTO_UPLOAD_URL, data, { headers: headers, responseType: 'text' })
      .pipe(
        map((res: any) => {
          console.log('photoupload' + res);

          this.loading = false;
          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public documentUpload(docData: any): Observable<any> {
    const headers = {
      Accept: 'application/json',
      'content-type': 'application/json',
    };

    this.loading = true;
    return this.http
      .post(DOC_UPLOAD_URL, docData, { headers: headers, responseType: 'text' })
      .pipe(
        map((res: any) => {
          this.loading = false;
          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public postPersonalDetails(personalDetails: any): Observable<any> {
    console.log('data ' + personalDetails);
    this.loading = true;
    return this.http.post(POST_PERSONAL_DETAILS, personalDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        this.loading = false;

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postMedvisaDts(medvisaDetails: any): Observable<any> {
    this.loading = true;
    return this.http.post(POST_MEDVISA_DETAILS, medvisaDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        this.loading = false;

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postPatientDts(medvisaDetails: any): Observable<any> {
    this.loading = true;
    return this.http.post(POST_PATIENT_DETAILS, medvisaDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        this.loading = false;

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public updatePatientDts(medvisaDetails: any): Observable<any> {
    this.loading = true;
    return this.http.post(UPDATE_PATIENT_DTS, medvisaDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        this.loading = false;

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postMedExtnRefno(medvisaDetails: any): Observable<any> {
    this.loading = true;
    return this.http.post(MEDVISA_EXTN_REFNO, medvisaDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        this.loading = false;

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postTreatmentDts(medvisaDetails: any): Observable<any> {
    this.loading = true;
    return this.http.post(POST_TREATMENT_DETAILS, medvisaDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        this.loading = false;

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postAttendantDts(medvisaDetails: any): Observable<any> {
    this.loading = true;
    return this.http.post(POST_ATTENDANT_DETAILS, medvisaDetails).pipe(
      map((res: any) => {
        console.log('personal' + res);

        this.loading = false;

        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postPptVisaDetails(pptVisaDetails: any): Observable<any> {
    console.log('in pptvisa details');
    console.log('data ' + pptVisaDetails);
    this.loading = true;
    return this.http.post(POST_PASSPORTVISA_DETAILS, pptVisaDetails).pipe(
      map((res: any) => {
        console.log('pptvisa' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postAccomDetails(accoDetails: any): Observable<any> {
    console.log('in acc details');
    console.log('data ' + accoDetails);
    this.loading = true;
    return this.http.post(POST_ACCOM_DTS, accoDetails).pipe(
      map((res: any) => {
        console.log('acc' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public updateAccomDetails(accoDetails: any): Observable<any> {
    console.log('in acc details');
    console.log('data ' + accoDetails);
    this.loading = true;
    return this.http.post(UPDATE_ACCOM_DETAILS, accoDetails).pipe(
      map((res: any) => {
        console.log('acc' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public updateSubUserDetails(subUsrDts: any): Observable<any> {
    this.loading = true;
    return this.http.post(UPDATE_SUBUSER_DETAILS, subUsrDts).pipe(
      map((res: any) => {
        console.log('acc' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postUserProfileDetails(userProfDetails: any): Observable<any> {
    console.log('in acc details');
    //  console.log('data '+accoDetails);
    this.loading = true;
    return this.http.post(POST_USR_PROF, userProfDetails).pipe(
      map((res: any) => {
        console.log('acc' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postSubUserDetails(subUserDetails: any): Observable<any> {
    console.log('Inside Subuser details', subUserDetails);
    //  console.log('data '+accoDetails);
    this.loading = true;
    return this.http.post(POST_SUBUSER, subUserDetails).pipe(
      map((res: any) => {
        console.log('acc' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public finalSubmitRegnDetails(usrId: any): Observable<any> {
    console.log('in pptvisa details');
    console.log('data ' + usrId);
    this.loading = true;
    return this.http.post(`${REG_FORM_FINAL_SUBMIT}${usrId}`, '').pipe(
      map((res: any) => {
        console.log('pptvisa' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postArrivalNxtdesDetails(arrivalNxtdesDetails: any): Observable<any> {
    console.log('in arrival details');
    console.log('data ' + arrivalNxtdesDetails);
    this.loading = true;
    return this.http
      .post(POST_ARRIVALNXTDEST_DETAILS, arrivalNxtdesDetails)
      .pipe(
        map((res: any) => {
          console.log('arrinex' + res);

          this.loading = false;
          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public postReferenceDetails(referenceDetails: any): Observable<any> {
    console.log('in reference details');
    console.log('data ' + referenceDetails);
    this.loading = true;
    return this.http.post(POST_REFERENCEOTHERS_DETAILS, referenceDetails).pipe(
      map((res: any) => {
        console.log('reference' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postCheckoutDetails(checkoutDetails: any): Observable<any> {
    console.log('in post checkout details');
    console.log('data ' + checkoutDetails);
    this.loading = true;
    return this.http.post(POST_DEPART_DETAIL_URL, checkoutDetails).pipe(
      map((res: any) => {
        console.log('checkout response' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public postChangePasswordDetails(
    changePassworddetails: any
  ): Observable<any> {
    this.loading = true;
    return this.http.post(CHANGE_PASSWORD_URL, changePassworddetails).pipe(
      map((res: any) => {
        console.log('checkout response' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public updateRefnoDts(medvisadetails: any): Observable<any> {
    this.loading = true;
    return this.http.post(UPDATE_MEDVISA_REFNODTS, medvisadetails).pipe(
      map((res: any) => {
        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public getArrivalDetails(searchParams: any): Observable<any> {
    console.log('in reference details');
    console.log('data ' + searchParams);
    this.loading = true;
    return this.http.post(GET_ARRIVAL_DETAIL_URL, searchParams).pipe(
      map((res: any) => {
        console.log('get arrival details' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  public deletePendingRecord(applicationId: string) {
    return this.http
      .delete(`${DELETE_PENDING_RECORD_BYAPPLID}${applicationId}`, {
        responseType: 'text',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          console.log('delete result' + res);

          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public deletePendingMedvisa(applicationId: string) {
    return this.http
      .delete(`${MEDVISA_PENDING_DELETE}${applicationId}`, {
        responseType: 'text',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          console.log('delete result' + res);

          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public deleteSubUser(userid: string) {
    return this.http
      .delete(`${DELETE_SUB_USER}${userid}`, { observe: 'response' })
      .pipe(
        map((res: any) => {
          console.log('delete result' + res);

          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public getPdfReport(applicationId: string) {
    return this.http
      .get(`${PRINT_DEPARTEDBY_APPLID}${applicationId}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        })
      );
  }
  public getPdfForApproval(userId: string) {
    return this.http
      .get(`${REG_FORM_PDF}${userId}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        })
      );
  }
  public getMedvisaPdf(applnId: string) {
    return this.http
      .get(`${MEDVISA_PDF}${applnId}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        })
      );
  }
  public getIndividualFormcPdf(applnId: string) {
    return this.http
      .get(`${FORMC_INDIVIDUAL_PDF}${applnId}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        })
      );
  }
  public getArrivalDetailsSummary(requestBody: any) {
    return this.http
      .post(`${GENERATE_SUMMARY_ARRIVAL}`, requestBody, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public getSummarySubuser(requestBody: any) {
    return this.http
      .post(`${GENERATE_SUMMARY_SUBUSER}`, requestBody, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public getSummaryAllSubuser(requestBody: any) {
    return this.http
      .post(`${GENERATE_SUMMARY_ALL_SUBUSER}`, requestBody, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public getBulkFormC(requestBody: any) {
    return this.http
      .post(`${GENERATE_SUMMARY_BULK}`, requestBody, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public getBulkFormCSubuser(requestBody: any) {
    return this.http
      .post(`${BULK_FORMC_SUBUSER}`, requestBody, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public getBulkPrintAllSubuser(requestBody: any) {
    return this.http
      .post(`${BULK_PRINT_ALL_SUBUSER}`, requestBody, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public getDepartureDetailsSummary(requestBody: any) {
    return this.http
      .post(`${GENERATE_SUMMARY_DEPARTURE}`, requestBody, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public getSummarybyFormcdate(requestBody: any) {
    return this.http
      .post(`${GENERATE_SUMMARY_FORMCFEDDURING}`, requestBody, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public finalSubmitApplication(applicationId: any): Observable<any> {
    this.loading = true;
    return this.http
      .post(`${FINAL_SUBMIT_URL}${applicationId}`, {}, { responseType: 'text' })
      .pipe(
        map((res: any) => {
          console.log('reference' + res);

          this.loading = false;
          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public finalSubmitMedvisa(applicationId: any): Observable<any> {
    this.loading = true;
    return this.http
      .post(
        `${MEDVISA_FINAL_SUBMIT}${applicationId}`,
        {},
        { responseType: 'text' }
      )
      .pipe(
        map((res: any) => {
          console.log('reference' + res);

          this.loading = false;
          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public checkCaptchaGn(userId: any, captchaGn: any): Observable<any> {
    this.loading = true;
    return this.http
      .post(`${CHECK_CAPTCHA_URL}${userId}/${captchaGn}`, {}, {})
      .pipe(
        map((res: any) => {
          console.log('reference' + res);

          this.loading = false;
          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public finalSubmitMedvisaExtn(applicationId: any): Observable<any> {
    this.loading = true;
    return this.http
      .post(
        `${MEDVISA_EXTN_FINAL_SUBMIT}${applicationId}`,
        {},
        { responseType: 'text' }
      )
      .pipe(
        map((res: any) => {
          console.log('reference' + res);

          this.loading = false;
          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  public logoutFunc(): Observable<any> {
    this.loading = true;
    return this.http.post(`${LOGOUT_URL}`, {}, { responseType: 'text' }).pipe(
      map((res: any) => {
        console.log('logout res' + res);

        this.loading = false;
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  public getDocuments(userid: string, docId: any): Observable<any> {
    return this.http
      .get<any>(`${DOC_DOWNLOAD_URL}${userid}/${docId}`)
      .pipe(catchError(this.handleError));
  }
  public getSubUsers(
    frroCode: string,
    accoCode: string
  ): Observable<SubUserListModel[]> {
    return this.http
      .get<[]>(`${GET_SUBUSERS}${frroCode}&acco_code=${accoCode}`)
      .pipe(catchError(this.handleError));
  }
  public getSubUserList(
    frroCode: string,
    accoCode: string
  ): Observable<SubUserListModel[]> {
    return this.http
      .get<SubUserListModel[]>(
        `${GET_SUBUSER_DETAILS}${frroCode}&acco_code=${accoCode}`
      )
      .pipe(catchError(this.handleError));
  }
  public getAccomodatorDetails(
    accoCode: string,
    frroCode: String,
    userId: String
  ): Observable<any> {
    return this.http
      .get<any>(
        `${GET_ACCOM_DETAILS}${accoCode}&frro_fro_code=${frroCode}&userid=${userId}`
      )
      .pipe(catchError(this.handleError));
  }
  public getUnapprovedUsrDetails(
    frroCode: String,
    userId: String
  ): Observable<any> {
    return this.http.get<any>(
      `${GET_UNAPPROVED_USERDTS}${frroCode}&userid=${userId}`
    );
  }
  public approveUsrDetails(
    frroCode: String,
    userId: String,
    approvedBy: String
  ): Observable<any> {
    return this.http
      .get<any>(
        `${APPROVE_USERS}${frroCode}&userid=${userId}&approvedBy=${approvedBy}`
      )
      .pipe(catchError(this.handleError));
  }
  public getFormCCnt(userId: String): Observable<any> {
    return this.http
      .get<any>(`${GET_FORMC_COUNT}${userId}`)
      .pipe(catchError(this.handleError));
  }
  public getApplicantDetails(applicationId: any): Observable<FormCDetails[]> {
    return this.http
      .get<FormCDetails[]>(`${GET_APPLICANT_FULLDETAILS_URL}${applicationId}`)
      .pipe(catchError(this.handleError));
  }
  public getSubmittedFormC(
    accoCode: string,
    frroCode: string
  ): Observable<SubmittedListModel[]> {
    return this.http
      .get<SubmittedListModel[]>(
        `${GET_DEPARTEDBY_ACCOFRRO}${accoCode}&frroFroCode=${frroCode}`
      )
      .pipe(catchError(this.handleError));
  }
  public getPendingMedvisa(): Observable<DraftMedvisaModel[]> {
    return this.http
      .get<DraftMedvisaModel[]>(`${GET_PENDING_MEDVISA}`)
      .pipe(catchError(this.handleError));
  }
  public getSubmittedMedvisa(): Observable<DraftMedvisaModel[]> {
    return this.http
      .get<DraftMedvisaModel[]>(`${GET_SUBMITTED_MEDVISA}`)
      .pipe(catchError(this.handleError));
  }
  public getMedvisaExtn(): Observable<DraftMedvisaModel[]> {
    return this.http
      .get<DraftMedvisaModel[]>(`${GET_MEDVISA_EXTN}`)
      .pipe(catchError(this.handleError));
  }
  public getSubUsrSubmittedFormC(
    accoCode: string,
    frroCode: string,
    userId: string
  ): Observable<SubmittedListModel[]> {
    return this.http
      .get<SubmittedListModel[]>(
        `${GET_DEPARTED_SUBUSER}${accoCode}&frroFroCode=${frroCode}&userId=${userId}`
      )
      .pipe(catchError(this.handleError));
  }
  public getLatestFormC(
    passnum: string,
    nationality: string
  ): Observable<FormCDetails[]> {
    return this.http
      .get<FormCDetails[]>(
        `${GET_APPDETAILSBY_PASSPORTANDNATIONALITY_URL}passportNo=${passnum}&nationality=${nationality}`
      )
      .pipe(catchError(this.handleError));
  }
  public getPendingFormC(
    accoCode: string,
    frroCode: string
  ): Observable<PendingListModel[]> {
    return this.http
      .get<PendingListModel[]>(
        `${GET_PENDINGBY_ACCOFRRO}${accoCode}&frroFroCode=${frroCode}`
      )
      .pipe(catchError(this.handleError));
  }
  public getSubuserPendingFormC(
    accoCode: string,
    frroCode: string,
    userId: string
  ): Observable<PendingListModel[]> {
    return this.http
      .get<PendingListModel[]>(
        `${GET_PENDINGLST_SUBUSER}${accoCode}&frroFroCode=${frroCode}&userId=${userId}`
      )
      .pipe(catchError(this.handleError));
  }
  public getCheckoutPending(
    accoCode: string,
    frroCode: string
  ): Observable<PendingListModel[]> {
    return this.http
      .get<PendingListModel[]>(
        `${GET_PENDINGFORCHECKOUTBY_ACCOFRRO}${accoCode}&frroFroCode=${frroCode}`
      )
      .pipe(catchError(this.handleError));
  }
  public getSubuserCheckoutPending(
    accoCode: string,
    frroCode: string,
    userId: string
  ): Observable<PendingListModel[]> {
    return this.http
      .get<PendingListModel[]>(
        `${GET_PENDINGFORCHECKOUT_SUBUSER}${accoCode}&frroFroCode=${frroCode}&userId=${userId}`
      )
      .pipe(catchError(this.handleError));
  }
  public getPendingDetailsById(
    formCApplid: string
  ): Observable<FormCDetails[]> {
    return this.http
      .get<FormCDetails[]>(`${GET_FORMC_TEMPDETAILSBYAPPLID}${formCApplid}`)
      .pipe(catchError(this.handleError));
  }
  public getPreviewDts(medvisaId: string): Observable<MedVisaModel[]> {
    return this.http
      .get<MedVisaModel[]>(`${GET_MEDVISA_BY_ID}${medvisaId}`)
      .pipe(catchError(this.handleError));
  }
  public getSubmittedDts(medvisaId: string): Observable<MedVisaModel[]> {
    return this.http
      .get<MedVisaModel[]>(`${GET_SUBMITTED_MEDVISA_DTS}${medvisaId}`)
      .pipe(catchError(this.handleError));
  }
  public pendingUnApprovedUsrDetails(
    frroCode: String,
    accoType: String
  ): Observable<any> {
    return this.http
      .get<any>(`${PENDING_UNAPPROVED_USR}${frroCode}&accoType=${accoType}`)
      .pipe(catchError(this.handleError));
  }
}
