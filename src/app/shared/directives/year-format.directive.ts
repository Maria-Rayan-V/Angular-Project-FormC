import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Directive({
  selector: '[formcYearFormat]',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
],
})
export class YearFormatDirective {

  constructor() { }

}
