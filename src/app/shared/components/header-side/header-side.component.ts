import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { LocalStoreService } from '../../services/local-store.service';

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.template.html',
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel: any;
  accoName: any;
  frroName: any;
  accoAddr: any;
  accoCity: any;
  userName: any;
  userMailid: any;
  mobileNo: any;
  lastLogin: any;
  userType: any;
  public availableLangs = [
    {
      name: 'EN',
      code: 'en',
      flag: 'flag-icon-us',
    },
    {
      name: 'ES',
      code: 'es',
      flag: 'flag-icon-es',
    },
  ];
  currentLang = this.availableLangs[0];

  public matxThemes: any;
  public layoutConf: any;
  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    private renderer: Renderer2,
    public jwtAuth: JwtAuthService,
    private ls: LocalStoreService
  ) {}
  ngOnInit() {
    this.matxThemes = this.themeService.matxThemes;
    this.layoutConf = this.layout.layoutConf;
    this.userName = this.ls.getItem('username');
    this.userMailid = this.ls.getItem('useremailId');
    this.lastLogin = this.ls.getItem('lastLogin');
    this.mobileNo = this.ls.getItem('mobileNo');
    this.accoName = this.ls.getItem('accoName');
    this.frroName = this.ls.getItem('frroName');
    this.accoAddr = this.ls.getItem('accoAddr');
    this.accoCity = this.ls.getItem('accoCity');
    this.userType = this.ls.getItem('usrTypeCode');
  }
  setLang(lng: any) {}
  changeTheme(theme: any) {
    // this.themeService.changeTheme(theme);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed',
    });
  }

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange(
        {
          sidebarStyle: 'full',
          sidebarCompactToggle: false,
        },
        { transitionClass: true }
      );
    }

    // * --> compact
    this.layout.publishLayoutChange(
      {
        sidebarStyle: 'compact',
        sidebarCompactToggle: true,
      },
      { transitionClass: true }
    );
  }

  onSearch(e: any) {
    //   console.log(e)
  }
}
