import { Injectable, Inject, Renderer2, RendererFactory2, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import  { getQueryParam } from '../helpers/url.helper';

export interface ITheme {
  name: string,
  baseColor?: string,
  isActive?: boolean
}

@Injectable()
export class ThemeService {
  public onThemeChange :EventEmitter<ITheme> = new EventEmitter();

  public matxThemes :ITheme[]  = [{
    "name": "matx-dark-purple",
    "baseColor": "#7367f0",
    "isActive": false
  }, {
    "name": "matx-dark-pink",
    "baseColor": "#e91e63",
    "isActive": false
  }, {
    "name": "matx-blue",
    "baseColor": "#1976d2",
    "isActive": true
  }, {
    "name": "matx-light-purple",
    "baseColor": "#7367f0",
    "isActive": false
  }, {
    "name": "matx-navy",
    "baseColor": "#10174c",
    "isActive": false 
  }];
  public activatedTheme: ITheme={
    "name": "",
    "baseColor": "",
    "isActive": false
  };
  private renderer: Renderer2;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // Invoked in AppComponent and apply 'activatedTheme' on startup
  applyMatTheme( themeName: string) {

    this.activatedTheme = this.matxThemes.find(t => t.name === themeName)!; 
    this.flipActiveFlag(themeName);

    // *********** ONLY FOR DEMO **********
    this.setThemeFromQuery();
    // ************************************

    // this.changeTheme(themeName);
    this.renderer.addClass(this.document.body, themeName);

  }

  changeTheme(prevTheme:any, themeName: string) {
    this.renderer.removeClass(this.document.body, prevTheme);
    this.renderer.addClass(this.document.body, themeName);
    this.flipActiveFlag(themeName);
    this.onThemeChange.emit(this.activatedTheme);
  }

  flipActiveFlag(themeName:string) {
    this.matxThemes.forEach((t) => {
      t.isActive = false;
      if(t.name === themeName) {
        t.isActive = true;
        this.activatedTheme = t;
      }
    });
  }

  // *********** ONLY FOR DEMO **********
  setThemeFromQuery() {
    let themeStr = getQueryParam('theme');
    try {
      this.activatedTheme = JSON.parse(themeStr);
      console.log(this.activatedTheme);
      
      this.flipActiveFlag(this.activatedTheme.name);
    } catch(e) {}
  }
}
