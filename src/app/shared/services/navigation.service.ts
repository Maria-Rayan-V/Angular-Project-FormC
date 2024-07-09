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
export class NavigationService {
  isHospital: boolean = false;
  accoType: any;
  constructor(private jwtAuth: JwtAuthService, private ls: LocalStoreService) {}

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
      name: 'Form C Details',
      type: 'link',
      icon: 'person_add',
      state: 'formc-details/formc-tabs',
    },
    // {
    //   name: "Pending Form-C",
    //   type: "link",
    //   icon: "edit_note",
    //   state: "formc/pending-formc-entry"
    // },
    // {
    //   name: "Print Form C",
    //   type: "link",
    //   icon: "print",
    //   state: "formc/print-formc"
    // },
    // {
    //   name: "Departure Entry",
    //   type: "link",
    //   icon: "exit_to_app",
    //   state: "formc/checkout-formc"
    // },
    {
      name: 'REPORTS',
      type: 'separator',
    },
    {
      name: 'Form C Reports',
      type: 'link',
      icon: 'receipt',
      state: 'reports/generate-summary',
    },
    // {
    //   name: 'Bulk Print',
    //   type: 'link',
    //   icon: 'description',
    //   state: 'reports/bulk-pdf',
    // },
    // {
    //   name: 'Summary - Subordinate',
    //   type: 'link',
    //   icon: 'receipt',
    //   state: 'reports/summary-subuser',
    // },

    // {
    //   name: 'Print - Subordinate',
    //   type: 'link',
    //   icon: 'receipt',
    //   state: 'reports/print-subuser',
    // },
    {
      name: 'USER MANAGEMENT',
      type: 'separator',
    },
    {
      name: 'Subordinate',
      type: 'link',
      icon: 'person',
      state: 'subordinate/list-subuser',
    },
    {
      name: 'Change Password',
      type: 'link',
      icon: 'vpn_key',
      state: 'others/change-password',
    },
    {
      name: 'Accommodator Profile',
      type: 'link',
      icon: 'edit',
      state: 'others/edit-acco-profile',
      // isFromEditAccoProfile:true
    },
    {
      name: 'Logout',
      type: 'link',
      icon: 'exit_to_app',
      state: 'formc/formc-logout',
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
