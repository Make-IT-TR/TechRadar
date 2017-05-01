import { inject } from 'aurelia-framework';
import { classes } from '../classes';
import { ApplicationState } from '../ApplicationState';
import $ from 'jquery';
import { MessageBusService } from './../MessageBus';


interface IUser {
  avatar_url: string;
  login: string;
}

@inject(ApplicationState, MessageBusService)
export class Trends {

  heading: string = 'Trend ';  
  trend: classes.Trend;
  mobile: boolean;
  mobileImage: string;
  platforms: classes.Example[];

  params: {}
  /**
   * ref element on the binding-context
   */
  image: HTMLImageElement;

  constructor(private appState : ApplicationState, private bus : MessageBusService) {
    
  }

public selectTechnology(tech: classes.ITechnology) {
    this.bus.publish('technologysheet', 'show', tech);
  }

  public checkKey(e) {
    console.log('check key');



  }

  public getNextTrend(): classes.Trend {
    var ni = this.appState.trends.indexOf(this.trend) + 1;
    if (ni === this.appState.trends.length) ni = 0;
    return this.appState.trends[ni];
  }

  public getPrevTrend(): classes.Trend {
    var ni = this.appState.trends.indexOf(this.trend) - 1;
    if (ni === -1) ni = this.appState.trends.length - 1;
    return this.appState.trends[ni];
  }

  public prevTrend() {
    this.trend = this.getPrevTrend();
    history.pushState({}, "new title", "#/trends/" + this.trend.Id + "/detail");
  }

  public nextTrend() {
    this.trend = this.getNextTrend();
    history.pushState({}, "new title", "#/trends/" + this.trend.Id + "/detail");
  }

  public selectPlatform(platform : classes.Example)
  {
    
  }

  activate(parms, routeConfig) {
    this.mobile = $(document).width() < 800;

    this.params = parms;
    this.appState.loadSheets().then(() => {
      
      this.trend = this.appState.trends.find((t) => { return t.Id == this.params["trend"] });
      //this.trend._TrendTechnologies[0]._Technology.Technology
      if (!this.trend.Description || this.trend.Description === "") this.trend.Description = " ";
      console.log(this.trend.Description);
      this.appState.data.activeConfig.ShowTrend = true;
      // this.radarmodel.selectTrend(this.trend);
      this.mobileImage = "img/radar/trend-" + this.trend.Id + ".png";      

      this.platforms = this.appState.getTrendExamples(this.trend);
      
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
