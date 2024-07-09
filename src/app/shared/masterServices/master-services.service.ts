import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, Observable, observable, of, share, tap, throwError } from 'rxjs';
import { AccoGradeModel, AccoTypeModel, CountryModel, DistrictModel, FrroListModel, PurposeModel, SplCategoryModel, StateModel, VisaSubtypeModel, VisatypeModel } from '../models/masterModels';
import { GET_ACCO_GRADE, GET_ACCO_TYPE, GET_COUNTRY_URL, GET_DISTRICT_URL, GET_FRRO_DISTRICT, GET_FRRO_LIST, GET_FULL_DISTRICT_URL, GET_SPLCATEGORY_URL, GET_STATE_URL, GET_VISASUBTYPE, GET_VISATYPE, GET_VISIT_PURPOSE_URL } from '../FormCConstants/formcUrlCons';

@Injectable({
  providedIn: 'root'
})
export class MasterServicesService {
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.message);
    }
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`)

    }
    // return an observable with a user-facing error message
    return throwError('An error occured. Please try again later.');
  }
  private cacheCountry: CountryModel[];
  private cachedObservable_Countries: Observable<CountryModel[]>;
  private cacheStates: StateModel[];
  private cachedObservable_States: Observable<StateModel[]>;
  private cachedObservable_VisitPurpose: Observable<PurposeModel[]>;
  private cacheVisitPurpose: PurposeModel[];
  private cachedObservable_SplCat: Observable<SplCategoryModel[]>;
  private cacheSplCat: SplCategoryModel[];
  private cacheVsatyp: VisatypeModel[];
  private cachedObservable_Vsatyp: Observable<VisatypeModel[]>;
  private cacheAccotype: AccoTypeModel[];
  private cachedObservable_Accotype: Observable<AccoTypeModel[]>;
  private cacheAccoGrade: AccoGradeModel[];
  private cachedObservable_AccoGrade: Observable<AccoGradeModel[]>;
  constructor(private http: HttpClient) { }
  getCountry(): Observable<CountryModel[]> {
 
    let observable: Observable<CountryModel[]>;
       if (this.cacheCountry) {
         observable = of(this.cacheCountry);
         // console.log('CACHE', this.cacheCountry);
       } else if (this.cachedObservable_Countries) {
         observable = this.cachedObservable_Countries;
         // console.log('CACHE OBSERVABLE', this.cachedObservable_Countries);
       } else {
         this.cachedObservable_Countries = this.http
           .get<CountryModel[]>(`${GET_COUNTRY_URL}`)
           .pipe(
             tap((res) => (this.cacheCountry = res)),
             share(),
             finalize(() => (this.cachedObservable_Countries = null))
           );
         observable = this.cachedObservable_Countries;
       }
       return observable;
       // return this.httpClient
       //   .get<any>(`${API_URL}/masters/country`)
       //   .pipe(catchError(this.handleError));
     }
  // public getSplCategory(): Observable<SplCategoryModel[]> {
  //   return this.http.get<SplCategoryModel[]>(GET_SPLCATEGORY_URL).pipe(catchError(this.handleError));
  // }
  getSplCategory(): Observable<SplCategoryModel[]> {
 
    let observable: Observable<SplCategoryModel[]>;
       if (this.cacheSplCat) {
         observable = of(this.cacheSplCat);
         // console.log('CACHE', this.cacheCountry);
       } else if (this.cachedObservable_SplCat) {
         observable = this.cachedObservable_SplCat;
         // console.log('CACHE OBSERVABLE', this.cachedObservable_Countries);
       } else {
         this.cachedObservable_SplCat = this.http
           .get<SplCategoryModel[]>(`${GET_SPLCATEGORY_URL}`)
           .pipe(
             tap((res) => (this.cacheSplCat= res)),
             share(),
             finalize(() => (this.cachedObservable_SplCat = null))
           );
         observable = this.cachedObservable_SplCat;
       }
       return observable;
       // return this.httpClient
       //   .get<any>(`${API_URL}/masters/country`)
       //   .pipe(catchError(this.handleError));
     }
  public getVisatype(): Observable<VisatypeModel[]> {
    return this.http.get<VisatypeModel[]>(GET_VISATYPE).pipe(catchError(this.handleError));
  }
  getVsatyp(): Observable<VisatypeModel[]> {
    let observable: Observable<VisatypeModel[]>;
    if (this.cacheVsatyp) {
      observable = of(this.cacheVsatyp);
      console.log('CACHE STATE');
    } else if (this.cachedObservable_Vsatyp) {
      observable = this.cachedObservable_Vsatyp;
    } else {
      this.cachedObservable_Vsatyp = this.http
        .get<any>(`${GET_VISATYPE}`)
        .pipe(
          tap((res) => (this.cacheVsatyp = res)),
          share(),
          finalize(() => (this.cachedObservable_Vsatyp = null))
        );
      observable = this.cachedObservable_Vsatyp;
    }
    return observable;
  }
  public getDistrict(passedStateCode: string): Observable<DistrictModel[]> {
    return this.http.get<DistrictModel[]>(`${GET_DISTRICT_URL}${passedStateCode}`).pipe(catchError(this.handleError));
  }
  public getFrroDistrict(passedStateCode: string): Observable<DistrictModel[]> {
    return this.http.get<DistrictModel[]>(`${GET_FRRO_DISTRICT}${passedStateCode}`).pipe(catchError(this.handleError));
  }
  getState(): Observable<StateModel[]> {
    let observable: Observable<StateModel[]>;
    if (this.cacheStates) {
      observable = of(this.cacheStates);
      // console.log('CACHE STATE');
    } else if (this.cachedObservable_States) {
      observable = this.cachedObservable_States;
    } else {
      this.cachedObservable_States = this.http
        .get<StateModel[]>(`${GET_STATE_URL}`)
        .pipe(
          tap((res) => (this.cacheStates = res)),
          share(),
          finalize(() => (this.cachedObservable_States = null)),
          catchError(this.handleError)
        );
      observable = this.cachedObservable_States;
    }
    return observable;
  }
 
  getPurposeOfVisit(): Observable<PurposeModel[]> {
    let observable: Observable<PurposeModel[]>;
    if (this.cacheVisitPurpose) {
      observable = of(this.cacheVisitPurpose);
    } else if (this.cachedObservable_VisitPurpose) {
      observable = this.cachedObservable_VisitPurpose;
    } else {
      this.cachedObservable_VisitPurpose = this.http
        .get<PurposeModel[]>(`${GET_VISIT_PURPOSE_URL}`)
        .pipe(
          tap((res) => (this.cacheVisitPurpose = res)),
          share(),
          finalize(() => (this.cachedObservable_VisitPurpose = null))
        );
      observable = this.cachedObservable_VisitPurpose;
    }
    return observable;
    // return this.httpClient
    //   .get<any>(`${API_URL}/masters/visit-purpose`)
    //   .pipe(catchError(this.handleError));
  }
  public getVisaSubtype(passedVisatype: string): Observable<VisaSubtypeModel[]> {
    return this.http.get<VisaSubtypeModel[]>(`${GET_VISASUBTYPE}${passedVisatype}`).pipe(catchError(this.handleError));
  }
  public getFullDistrict(): Observable<DistrictModel[]> {
    return this.http.get<DistrictModel[]>(`${GET_FULL_DISTRICT_URL}`).pipe(catchError(this.handleError));
  }
  // public getAccoType(): Observable<AccoTypeModel[]> {
  //   return this.http.get<AccoTypeModel[]>(`${GET_ACCO_TYPE}`).pipe(catchError(this.handleError));
  // }
  getAccoType(): Observable<AccoTypeModel[]> {
 
    let observable: Observable<AccoTypeModel[]>;
       if (this.cacheAccotype) {
         observable = of(this.cacheAccotype);
         // console.log('CACHE', this.cacheCountry);
       } else if (this.cachedObservable_Accotype) {
         observable = this.cachedObservable_Accotype;
         // console.log('CACHE OBSERVABLE', this.cachedObservable_Countries);
       } else {
         this.cachedObservable_Accotype = this.http
           .get<AccoTypeModel[]>(`${GET_ACCO_TYPE}`)
           .pipe(
             tap((res) => (this.cacheAccotype = res)),
             share(),
             finalize(() => (this.cachedObservable_Accotype = null))
           );
         observable = this.cachedObservable_Accotype;
       }
       return observable;
       // return this.httpClient
       //   .get<any>(`${API_URL}/masters/country`)
       //   .pipe(catchError(this.handleError));
     }
  // public getAccoGrade(): Observable<AccoGradeModel[]> {
  //   return this.http.get<AccoGradeModel[]>(`${GET_ACCO_GRADE}`).pipe(catchError(this.handleError));
  // }
  getAccoGrade(): Observable<AccoGradeModel[]> {
 
    let observable: Observable<AccoGradeModel[]>;
       if (this.cacheAccoGrade) {
         observable = of(this.cacheAccoGrade);
         // console.log('CACHE', this.cacheCountry);
       } else if (this.cachedObservable_AccoGrade) {
         observable = this.cachedObservable_AccoGrade;
         // console.log('CACHE OBSERVABLE', this.cachedObservable_Countries);
       } else {
         this.cachedObservable_AccoGrade = this.http
           .get<AccoGradeModel[]>(`${GET_ACCO_GRADE}`)
           .pipe(
             tap((res) => (this.cacheAccoGrade = res)),
             share(),
             finalize(() => (this.cachedObservable_AccoGrade = null))
           );
         observable = this.cachedObservable_AccoGrade;
       }
       return observable;
       // return this.httpClient
       //   .get<any>(`${API_URL}/masters/country`)
       //   .pipe(catchError(this.handleError));
     }
  public getFrroList(stateCode:any,cityCode:any): Observable<FrroListModel[]> {
    return this.http.get<FrroListModel[]>(`${GET_FRRO_LIST}${stateCode}/${cityCode}`).pipe(catchError(this.handleError));
  }
}
