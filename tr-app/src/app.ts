import { ApplicationState } from './ApplicationState';
import { Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import 'bootstrap';
import 'cookieconsent';
import { inject } from 'aurelia-framework';

@inject(Router, ApplicationState)
export class App {
  router: Router;
  public appState: ApplicationState;
  // show intro at main screen
  public showIntro = false;

  constructor(router, appState) {
    this.router = router;
    this.appState = appState;
  }

  activate() {

    // console.log(this.router);
  }

  public login() {
    this.appState.showLogin = true;
    // 
  }

  public logout() {
    this.appState.logout();
    location.reload();
  }



  static isLoggedIn(): boolean {
    var auth_token = localStorage.getItem("auth_token");
    return (typeof auth_token !== "undefined" && auth_token !== null);
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'TechRadar';
    config.addAuthorizeStep(AuthorizeStep);
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('./home/home'), nav: true, title: 'Home' },
      { route: ['trends'], name: 'trends', moduleId: PLATFORM.moduleName('./trends/trends'), nav: true, title: 'Trends' },
      { route: 'trends/:trend/detail', name: 'trendsDetail', moduleId: PLATFORM.moduleName('./trends/trenddetail'), title: 'Trend', nav: false },
      { route: 'technology/:technology/edit', name: 'techEdit', moduleId: PLATFORM.moduleName('./technology/techedit'), auth: true, title: 'Technology', nav: false },
      { route: 'platforms/:category/:technology', href: 'platforms/all/all', name: 'Platforms', moduleId: PLATFORM.moduleName('./platforms/platforms'), nav: true, title: 'Platforms' },
      { route: ['platforms'], name: 'platforms-page', moduleId: PLATFORM.moduleName('./platforms/platforms'), nav: false, title: 'Platforms' },
      { route: 'techradar', name: 'techradar', moduleId: PLATFORM.moduleName('./techradar/techradar'), nav: true, title: 'Radar' },
      { route: ['about'], name: 'about', moduleId: PLATFORM.moduleName('./about/about'), nav: true, title: 'About' },
      { route: 'trends/:trend/image', name: 'trendsImage', moduleId: PLATFORM.moduleName('./trends/trendimage'), title: 'RadarImage', nav: false },
      { route: 'platforms/add', name: 'addPlatform', moduleId: PLATFORM.moduleName('./platforms/add'), nav: false },
      {
        route: 'auth/github/callback',
        name: 'callback',
        moduleId: PLATFORM.moduleName('./callback'),
        nav: false,
        title: 'Callback'
      }
    ]);

    this.router = router;

    (<any>window).cookieconsent.initialise({
      container: document.getElementById("content"),
      palette: {
        popup: { background: "#fff" },
        button: { background: "#aa0000" },
      },
      revokable: true,
      onStatusChange: function (status) {
        console.log(this.hasConsented() ?
          'enable cookies' : 'disable cookies');
      },
      law: {
        regionalLaw: false,
      },
      location: true,
    });
  }
}

@inject(ApplicationState)
class AuthorizeStep {

  private appState: ApplicationState;

  constructor(appState) {
    this.appState = appState;
  }


  run(routingContext, next) {
    if (routingContext.config.auth) {
      var isLoggedIn = this.appState.authenticated;
      if (!isLoggedIn) {
        alert("Not Logged In!\nClick the Sign In icon to log in");
        return next.cancel();
      }
    }
    return next();
  }

  static isLoggedIn(): boolean {
    var auth_token = localStorage.getItem("auth_token");
    return (typeof auth_token !== "undefined" && auth_token !== null);
  }
}
