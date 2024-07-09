import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { JwtAuthService } from "./auth/jwt-auth.service";

interface IMenuItem {
  type: string; // Possible values: link/dropDown/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  isFromEditAccoProfile?:boolean;
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
export class SubuserNavigationService {
  constructor(
    private jwtAuth:JwtAuthService
  ) {}
  iconMenu: IMenuItem[] = [
    
    {
      name: "Home",
      type: "link",
      tooltip: "Home",
      icon: "home",
      state: "subuser/subusr-home"
    },
    {
      name: "FORM C",
      type: "separator"
    },
    {
      name: "Form-C Details",
      type: "link",
      icon: "person_add",
      state: "subuser/subusr-formc"
    },
   
      {
        name: "Generate Summary",
        type: "link",
        icon: "receipt",
        state: "subuser/subusr-summary"
      },
      {
        name: "Bulk Print",
        type: "link",
        icon: "description",
        state: "subuser/subusr-print"
      },
      {
        name:"Change Password",
        type:"link",
        icon:"vpn_key",
        state:"subuser/subusr-pswd"
      }
    
   
  ];


  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = "Frequently Accessed";
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
