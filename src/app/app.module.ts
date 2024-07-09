import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from 'ngx-perfect-scrollbar';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { rootRouterConfig } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { DefaultValueAccessor } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormcCommonmaterialModule } from './shared/formc-commonmaterial/formc-commonmaterial.module';

import { NgHttpLoaderModule } from 'ng-http-loader';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { IHStepperComponent } from './views/sessions/signup-module/ihstepper/ihstepper.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
// export const signuproutes =  [
//   { path: 'accounts', component: AccomodatorProfileComponent, label: 'Accounts' },
//   { path: 'contacts', component: AccomodatorProfileComponent, label: 'Contacts' },
//   { path: 'activities', component: AccomodatorProfileComponent, label: 'Activities' }
//  ];
@NgModule({
  imports: [
    NgHttpLoaderModule.forRoot(),
    BrowserModule,
    FormcCommonmaterialModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    PerfectScrollbarModule,
    MatMomentDateModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, {
      passThruUnknownUrl: true,
    }),
    RouterModule.forRoot(rootRouterConfig, { useHash: true }),
  ],
  declarations: [AppComponent],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    //{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    // REQUIRED IF YOU USE JWT AUTHENTICATION
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    DefaultValueAccessor.prototype.registerOnChange = function (
      fn: (_: string | null) => void
    ): void {
      this.onChange = (value: string | null) => {
        fn(value === '' ? null : value);
      };
    };
  }
}
