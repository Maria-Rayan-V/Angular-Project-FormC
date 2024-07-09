import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtAuthService } from './auth/jwt-auth.service';
import { LocalStoreService } from './local-store.service';

interface IMenuItem {
  type: string; // Possible values: link/dropDown/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  isFromEditAccoProfile?: boolean;
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class AdminNavigationService {
  isHospital: boolean = false;
  accoType: any;
  constructor(private jwtAuth: JwtAuthService, private ls: LocalStoreService) {
    console.log('Constructor in Sidebar');
    this.accoType = this.ls.getItem('accoType');
    console.log('Accotype in sidebar', this.accoType);
    if (this.accoType == 'HP') {
      this.isHospital = true;
      console.log('Hospital user ');
    } else {
      console.log('Normal user');
    }
  }

  iconMenu: IMenuItem[] = [
    {
      name: 'Home',
      type: 'link',
      tooltip: 'Home',
      icon: 'home',
      state: 'dashboard/analytics',
    },
    {
      name: 'FORM C',
      type: 'separator',
    },
    {
      name: 'Approve User',
      type: 'link',
      icon: 'person_add',
      state: 'admin/approve-user',
    },
    {
      name: 'Pending User List',
      type: 'link',
      icon: 'schedule',
      state: 'admin/pending-list',
    },
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = 'Frequently Accessed';
  // sets iconMenu as default;

  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    this.menuItems.next(this.iconMenu);
  }
}
