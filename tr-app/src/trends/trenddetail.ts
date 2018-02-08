import { inject } from 'aurelia-framework';
import { Trend, Example, ITechnology, WikiResult, Project } from './../classes';
import { ApplicationState } from '../ApplicationState';
import $ from 'jquery';
import { MessageBusService } from './../MessageBus';
import { Router, RouterConfiguration } from 'aurelia-router';


interface IUser {
  avatar_url: string;
  login: string;
}

@inject(ApplicationState, MessageBusService, Router)
export class Trends {

  heading: string = 'Trend ';
  trend: Trend;
  mobile: boolean;
  mobileImage: string;
  platforms: Example[];
  selectedTech: string;

  params: {}
  /**
   * ref element on the binding-context
   */
  image: HTMLImageElement;

  constructor(private appState: ApplicationState, private bus: MessageBusService, private router: Router) {

  }

  public selectTechnology(tech: ITechnology) {
    this.bus.publish('technologysheet', 'show', tech);
  }

  public checkKey(e) {
    console.log('check key');
  }



  public getNextTrend(): Trend {
    var ni = this.appState.project.trends.indexOf(this.trend) + 1;
    if (ni === this.appState.project.trends.length) ni = 0;
    return this.appState.project.trends[ni];
  }

  public getPrevTrend(): Trend {
    var ni = this.appState.project.trends.indexOf(this.trend) - 1;
    if (ni === -1) ni = this.appState.project.trends.length - 1;
    return this.appState.project.trends[ni];
  }

  public prevTrend() {
    this.trend = this.getPrevTrend();
    history.pushState({}, "new title", "#/trends/" + this.trend.id + "/detail");
  }

  public nextTrend() {
    this.trend = this.getNextTrend();
    history.pushState({}, "new title", "#/trends/" + this.trend.id + "/detail");
  }

  public selectPlatform(platform: Example) {
    // this.router.navigateToRoute('Platforms', { category: e.Category, technology: encodeURIComponent(e.Technology)});   
    this.appState.searchFilter = platform.Name;       
    this.router.navigateToRoute('Platforms', { category: 'all', technology: 'all', search: encodeURIComponent(platform.Name)});
  }

  activate(parms, routeConfig) {    
    this.params = parms;
    console.log(this.params);
    this.update();
    
  }

  public addTechnology() {
    let tech = this.appState.project.technologies.find(t => t.Technology === this.selectedTech);
    if (tech) {
      this.appState.addTechnologyToTrend(this.appState.activeTrend, tech);
      this.update();
      this.bus.publish('reload', 'update');
    }
  }

  public editTechnology(t: ITechnology) {
    this.router.navigateToRoute('techEdit', { technology: t.id});
  }

  public removeTrendTechnology(t: ITechnology) {
    this.appState.removeTrendTechnology(this.appState.activeTrend, t);
    this.update();
    this.bus.publish('reload', 'update');
  }

  update() {
    if (!this.appState.project || !this.appState.project.trends) return;
    this.trend = this.appState.project.trends.find((t) => { return t.id == this.params["trend"] });
    //this.trend._TrendTechnologies[0]._Technology.Technology
    
    if (!this.trend.Description || this.trend.Description === "") this.trend.Description = " ";
    // console.log(this.trend.Description);
    this.appState.activeConfig.ShowTrend = true;
    // this.radarmodel.selectTrend(this.trend);
    this.mobileImage = "img/radar/trend-" + this.trend.id + ".png";

    this.platforms = this.appState.getTrendExamples(this.trend);

  }

  updateFilter() {
    console.log('publish');
    this.bus.publish("reload", "all");

  }

  toggleReverse(v: any) {
    console.log('toggle reverse');
    
    v.Reverse = !v.Reverse;
    this.updateFilter();
  }

  attached() {
    this.mobile = $(document).width() < 800;


    // console.log(this.params);
    this.appState.loadSheets().then(() => {
      this.update();

      this.bus.subscribe('refresh', (a, d) => {
        if (a === 'trend') {          
          this.update();
        }
      });

      //this.bus.publish("reload", "all");

    });
    document.onkeydown = ((e) => {
      //e = e || window.event;

      if (e.keyCode === 37) {
        // left arrow
        this.prevTrend();
      }
      else if (e.keyCode === 39) {
        this.nextTrend();
        // right arrow
      }
    });
  }

}
