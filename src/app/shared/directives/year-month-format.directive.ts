import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const YEARMONTHFORMAT = {
  parse: {
      dateInput: 'MM/YYYY',
  },
  display: {
      dateInput: 'MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Directive({
  selector: '[formcYearMonthFormat]',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: YEARMONTHFORMAT },
],
})
export class YearMonthFormatDirective {

  constructor() { }

}
