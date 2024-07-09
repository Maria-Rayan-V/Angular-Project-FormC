import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SERVICES
import { ThemeService } from './services/theme.service';
import { NavigationService } from './services/navigation.service';
import { RoutePartsService } from './services/route-parts.service';
import { AuthGuard } from './guards/auth.guard';
import { UserRoleGuard } from './guards/user-role.guard';
import { AppConfirmService } from './services/app-confirm/app-confirm.service';
import { AppLoaderService } from './services/app-loader/app-loader.service';

import { SharedComponentsModule } from './components/shared-components.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { InputuppercaseDirective } from './directives/inputuppercase.directive';
import { SubuserNavigationService } from './services/subuserNavgn.service';
import { DisableCopyPasteDirective } from './directives/disable-copy-paste.directive';
import { MedVisaNavigationService } from './services/MedVisaNav.service';
import { AdminNavigationService } from './services/adminNav.service';

@NgModule({
  declarations: [InputuppercaseDirective, DisableCopyPasteDirective],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule,
  ],
  providers: [
    ThemeService,
    AdminNavigationService,
    SubuserNavigationService,
    MedVisaNavigationService,
    NavigationService,
    RoutePartsService,
    AuthGuard,
    UserRoleGuard,
    AppConfirmService,
    AppLoaderService,
  ],
  exports: [
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    InputuppercaseDirective,
  ],
})
export class SharedModule {}
