import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NavigationService } from '../../../shared/services/navigation.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import {
  ILayoutConf,
  LayoutService,
} from 'src/app/shared/services/layout.service';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { LocalStoreService } from '../../services/local-store.service';
import { SubuserNavigationService } from '../../services/subuserNavgn.service';
import { MedVisaNavigationService } from '../../services/MedVisaNav.service';
import { AdminNavigationService } from '../../services/adminNav.service';

@Component({
  selector: 'app-sidebar-side',
  templateUrl: './sidebar-side.component.html',
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  public menuItems: any[] = [];
  public hasIconTypeMenuItem: boolean = false;
  public iconTypeMenuTitle: string = '';
  private menuItemsSub: any;
  public layoutConf: ILayoutConf = {};
  userType: string;
  accoType: any;
  constructor(
    private ls: LocalStoreService,
    private navService: NavigationService,
    private subnavService: SubuserNavigationService,
    private medVisaNav: MedVisaNavigationService,
    private adminService: AdminNavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    public jwtAuth: JwtAuthService
  ) {}

  ngOnInit() {
    this.userType = this.ls.getItem('usrTypeCode');
    this.accoType = this.ls.getItem('accoType');

    if (this.userType == '4') {
      this.iconTypeMenuTitle = this.adminService.iconTypeMenuTitle;
      this.menuItemsSub = this.adminService.menuItems$.subscribe((menuItem) => {
        this.menuItems = menuItem;
        console.log('Menuitems in main user sidebar', this.menuItems);
        //Checks item list has any icon type.
        this.hasIconTypeMenuItem = !!this.menuItems.filter(
          (item) => item.type === 'icon'
        ).length;
      });
    }
    if (this.userType == '5') {
      this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
      this.menuItemsSub = this.navService.menuItems$.subscribe((menuItem) => {
        this.menuItems = menuItem;
        console.log('Menuitems in main user sidebar', this.menuItems);
        //Checks item list has any icon type.
        this.hasIconTypeMenuItem = !!this.menuItems.filter(
          (item) => item.type === 'icon'
        ).length;
      });
    }
    if (this.userType == '7') {
      this.iconTypeMenuTitle = this.subnavService.iconTypeMenuTitle;
      this.menuItemsSub = this.subnavService.menuItems$.subscribe(
        (menuItem) => {
          this.menuItems = menuItem;
          console.log('Menuitems in subuser sidebar side', this.menuItems);
          //Checks item list has any icon type.
          this.hasIconTypeMenuItem = !!this.menuItems.filter(
            (item) => item.type === 'icon'
          ).length;
        }
      );
    }
    if (this.accoType == 'HP') {
      this.iconTypeMenuTitle = this.medVisaNav.iconTypeMenuTitle;
      this.menuItemsSub = this.medVisaNav.menuItems$.subscribe((menuItem) => {
        this.menuItems = menuItem;
        console.log('Menuitems in subuser sidebar side', this.menuItems);
        //Checks item list has any icon type.
        this.hasIconTypeMenuItem = !!this.menuItems.filter(
          (item) => item.type === 'icon'
        ).length;
      });
    }
    // if (this.accoType == '4') {
    //   this.iconTypeMenuTitle = this.adminNav.iconTypeMenuTitle;
    //   this.menuItemsSub = this.adminNav.menuItems$.subscribe((menuItem) => {
    //     this.menuItems = menuItem;
    //     console.log('Menuitems in subuser sidebar side', this.menuItems);
    //     //Checks item list has any icon type.
    //     this.hasIconTypeMenuItem = !!this.menuItems.filter(
    //       (item) => item.type === 'icon'
    //     ).length;
    //   });
    // }
    this.layoutConf = this.layout.layoutConf;
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  toggleCollapse() {
    this.layout.publishLayoutChange({
      sidebarCompactToggle: !this.layoutConf.sidebarCompactToggle,
    });
  }
}
