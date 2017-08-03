import { Aurelia } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';



export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'TechRadar';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('./home/home'), nav: true, title: 'Home' },
      { route: ['trends'], name: 'trends', moduleId: PLATFORM.moduleName('./trends/trends'), nav: true, title: 'Trends' },
      { route: 'trends/:trend/detail', name: 'trendsDetail', moduleId: PLATFORM.moduleName('./trends/trenddetail'), title: 'Trend', nav: false },
      { route: 'platforms/:category/:technology', href:'platforms/all/all', name: 'Platforms', moduleId: PLATFORM.moduleName('./platforms/platforms'), nav: true, title: 'Platforms' },
      { route: ['techradar'], name: 'techradar', moduleId: PLATFORM.moduleName('./techradar/techradar'), nav: true, title: 'Radar' },
      { route: ['', 'about'], name: 'about', moduleId: PLATFORM.moduleName('./about/about'), nav: true, title: 'About' },
      { route: 'trends/:trend/image', name: 'trendsImage', moduleId: PLATFORM.moduleName('./trends/trendimage'), title: 'RadarImage', nav: false },
      { route: 'platforms/add', name: 'addPlatform', moduleId: PLATFORM.moduleName('./platforms/add'), nav: false}


    ]);

    this.router = router;
  }
}
