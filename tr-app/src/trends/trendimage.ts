import { inject } from 'aurelia-framework';
import { classes } from '../classes';
import { ApplicationState } from '../ApplicationState';
import $ from 'jquery';


interface IUser {
  avatar_url: string;
  login: string;
}

@inject(ApplicationState)
export class Trends {

  heading: string = 'Trend ';
  appState: ApplicationState;
  trend: classes.Trend;
  mobile: boolean;

  params: {}
  /**
   * ref element on the binding-context
   */
  image: HTMLImageElement;

  constructor(appState) {
    this.appState = appState;

  }



  activate(parms, routeConfig) {
    this.params = parms;
    this.appState.loadSheets().then(() => {
      this.trend = this.appState.trends.find((t) => { return t.Id == this.params["trend"] });

      $('.page-host').css('margin-top',0);
      $('#techradar-' + this.trend.Id).css('margin-left','-25px');
    });
  }

}
