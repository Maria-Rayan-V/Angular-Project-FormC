import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegnNavService {
  constructor() {}
  private isSubmitDisabled = new BehaviorSubject<boolean>(true);
  castisSubmitDisabled = this.isSubmitDisabled.asObservable();

  editisSubmitDisabled(isSubmitDisabled) {
    this.isSubmitDisabled.next(isSubmitDisabled);
  }
  private isAddDisabled = new BehaviorSubject<boolean>(false);
  castisAddDisabled = this.isAddDisabled.asObservable();
  editisAddDisabled(isAddDisabled) {
    this.isAddDisabled.next(isAddDisabled);
  }
  private isPdfDisabled = new BehaviorSubject<boolean>(true);
  castisPdfDisabled = this.isPdfDisabled.asObservable();
  editisPdfDisabled(isPdfDisabled) {
    this.isPdfDisabled.next(isPdfDisabled);
  }
  private chatSeries = new BehaviorSubject<Array<any>>([0, 0, 0, 0]);
  castchatSeries = this.chatSeries.asObservable();
  editchatSeries(chatSeries) {
    this.chatSeries.next(chatSeries);
  }
  private accoCodeRegn = new BehaviorSubject<string>(null);
  castaccoCodeRegn = this.accoCodeRegn.asObservable();
  editaccoCodeRegn(accoCodeRegn) {
    this.accoCodeRegn.next(accoCodeRegn);
  }
  private frroCodeRegn = new BehaviorSubject<string>(null);
  castfrroCodeRegn = this.frroCodeRegn.asObservable();
  editfrroCodeRegn(frroCodeRegn) {
    this.frroCodeRegn.next(frroCodeRegn);
  }
  private accoDetails = new BehaviorSubject<any>(null);
  castaccoDetails = this.accoDetails.asObservable();
  editaccoDetails(accoDetails) {
    this.accoDetails.next(accoDetails);
  }
  private reportVal = new BehaviorSubject<string>(null);
  castreportVal = this.reportVal.asObservable();
  editreportVal(reportVal) {
    this.reportVal.next(reportVal);
  }
}
