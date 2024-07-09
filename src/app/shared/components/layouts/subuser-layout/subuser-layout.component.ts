import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { JwtAuthService } from 'src/app/shared/services/auth/jwt-auth.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-subuser-layout',
  templateUrl: './subuser-layout.component.html'
})
export class SubuserLayoutComponent implements OnInit, AfterViewInit {

    public isModuleLoading: Boolean = false;
    private moduleLoaderSub: any ;
    private layoutConfSub: any;
    private routerEventSub: Subscription;
    userName:any;
    userMailid:any;
    lastLogin:any;
    mobileNo:any;
    public  scrollConfig = {}
    public layoutConf: any = {};
    public adminContainerClasses: any = {};
    
    constructor(
      private ls:LocalStoreService,
      private router: Router,
      public themeService: ThemeService,
      private layout: LayoutService,
      private cdr: ChangeDetectorRef,
      private jwtAuth: JwtAuthService
    ) {
      // Check Auth Token is valid
      this.jwtAuth.checkTokenIsValid().subscribe();
  
      // Close sidenav after route change in mobile
      this.routerEventSub = router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((routeChange: NavigationEnd) => {
        this.layout.adjustLayout({ route: routeChange.url });
        this.scrollToTop();
      });
    }
  
    ngOnInit() {
        // this.userName=this.ls.getItem('username');
        // this.userMailid=this.ls.getItem('useremailId');
        // this.lastLogin=this.ls.getItem('lastLogin');
        // this.mobileNo=this.ls.getItem('mobileNo');
      // this.layoutConf = this.layout.layoutConf;
      this.layoutConfSub = this.layout.layoutConf$.subscribe((layoutConf) => {
          this.layoutConf = layoutConf;
          // console.log(this.layoutConf);
          
          this.adminContainerClasses = this.updateAdminContainerClasses(this.layoutConf);
          this.cdr.markForCheck();
      });
  
      // FOR MODULE LOADER FLAG
      this.moduleLoaderSub = this.router.events.subscribe(event => {
        if(event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
          this.isModuleLoading = true;
        }
        if(event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
          this.isModuleLoading = false;
        }
      });
    }
    @HostListener('window:resize', ['$event'])
    onResize(event:any) {
      this.layout.adjustLayout(event);
    }
    
    ngAfterViewInit() {
       
    }
    
    scrollToTop() {
      if(document) {
        setTimeout(() => {
          let element;
          if(this.layoutConf.topbarFixed) {
            element = <HTMLElement>document.querySelector('#rightside-content-hold');
          } else {
            element = <HTMLElement>document.querySelector('#main-content-wrap');
          }
          element.scrollTop = 0;
        })
      }
    }
    ngOnDestroy() {
      if(this.moduleLoaderSub) {
        this.moduleLoaderSub.unsubscribe();
      }
      if(this.layoutConfSub) {
        this.layoutConfSub.unsubscribe();
      }
      if(this.routerEventSub) {
        this.routerEventSub.unsubscribe();
      }
    }
    closeSidebar() {
      this.layout.publishLayoutChange({
        sidebarStyle: 'closed'
      })
    }
  
    sidebarMouseenter(e:any) {
      // console.log(this.layoutConf);
      if(this.layoutConf.sidebarStyle === 'compact') {
          this.layout.publishLayoutChange({sidebarStyle: 'full'}, {transitionClass: true});
      }
    }
  
    sidebarMouseleave(e:any) {
      // console.log(this.layoutConf);
      if (
          this.layoutConf.sidebarStyle === 'full' &&
          this.layoutConf.sidebarCompactToggle
      ) {
          this.layout.publishLayoutChange({sidebarStyle: 'compact'}, {transitionClass: true});
      }
    }
   
    updateAdminContainerClasses(layoutConf:any) {
      return {
        'navigation-top': layoutConf.navigationPos === 'top',
        'sidebar-full': layoutConf.sidebarStyle === 'full',
        'sidebar-compact': layoutConf.sidebarStyle === 'compact' && layoutConf.navigationPos === 'side',
        'compact-toggle-active': layoutConf.sidebarCompactToggle,
        'sidebar-compact-big': layoutConf.sidebarStyle === 'compact-big' && layoutConf.navigationPos === 'side',
        'sidebar-opened': layoutConf.sidebarStyle !== 'closed' && layoutConf.navigationPos === 'side',
        'sidebar-closed': layoutConf.sidebarStyle === 'closed',
        'fixed-topbar': layoutConf.topbarFixed && layoutConf.navigationPos === 'side'
      }
    }

}
