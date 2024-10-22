import {
  Directive,
  OnInit,
  OnDestroy,
  HostBinding,
  Input,
  HostListener
} from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MatchMediaService } from "src/app/shared/services/match-media.service";
import { MatXSidenavHelperService } from "./matx-sidenav-helper.service";
import { MatSidenav } from "@angular/material/sidenav";
import { MediaObserver } from "@angular/flex-layout";

@Directive({
  selector: "[matxSidenavHelper]"
})
export class MatXSidenavHelperDirective implements OnInit, OnDestroy {
  @HostBinding("class.is-open")
  isOpen: boolean;

  @Input("matxSidenavHelper")
  id: string='';

  @Input("isOpen")
  isOpenBreakpoint: string='';

  private unsubscribeAll: Subject<any>;

  constructor(
    private matchMediaService: MatchMediaService,
    private matxSidenavHelperService: MatXSidenavHelperService,
    private matSidenav: MatSidenav,
    private mediaObserver: MediaObserver
  ) {
    // Set the default value
    this.isOpen = true;

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.matxSidenavHelperService.setSidenav(this.id, this.matSidenav);

    if (this.mediaObserver.isActive(this.isOpenBreakpoint)) {
      this.isOpen = true;
      this.matSidenav.mode = "side";
      this.matSidenav.toggle(true);
    } else {
      this.isOpen = false;
      this.matSidenav.mode = "over";
      this.matSidenav.toggle(false);
    }

    this.matchMediaService.onMediaChange
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        if (this.mediaObserver.isActive(this.isOpenBreakpoint)) {
          this.isOpen = true;
          this.matSidenav.mode = "side";
          this.matSidenav.toggle(true);
        } else {
          this.isOpen = false;
          this.matSidenav.mode = "over";
          this.matSidenav.toggle(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}

@Directive({
  selector: "[matxSidenavToggler]"
})
export class MatXSidenavTogglerDirective {
  @Input("matxSidenavToggler")
  public id: any;

  constructor(private matxSidenavHelperService: MatXSidenavHelperService) {}

  @HostListener("click")
  onClick() {
    // console.log(this.matxSidenavHelperService.getSidenav(this.id))
    this.matxSidenavHelperService.getSidenav(this.id).toggle();
  }
}
