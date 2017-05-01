import { MessageBusService } from './../MessageBus';
import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { classes } from '../classes';
import $ from 'jquery';
import { ApplicationState } from '../ApplicationState';
import * as _ from 'lodash';


@inject(ApplicationState, MessageBusService, Router)
export class Technologysheet {

  mobile: boolean;
  tech: classes.ITechnology;
  show = false;
  wiki: classes.WikiResult;
  examples: classes.Example[];

  updateTech(t: classes.ITechnology) {
    console.log('Get examples');
    this.examples = [];
    this.tech = t;
    this.wiki = null;


    if (t.Wikipedia && this.appState.wiki.hasOwnProperty(t.Wikipedia)) this.wiki = this.appState.wiki[t.Wikipedia];

    this.examples = this.appState.getTechExamples(t);

  }

  closeSheet(e: MouseEvent) {

    console.log(e);
    this.show = false;
  }

  public selectPlatform(e: MouseEvent, example: classes.Example) {
    e.cancelBubble = true;
    this.show = false;
    this.appState.selectPlatform(example);
  }

  public selectCategory()
  {
    console.log('select category');
    window.location.href = '#/platforms/' + this.tech.Category + '/all';  
  }

  public selectTrend(e: MouseEvent, trend: classes.Trend) {    
    e.cancelBubble = true;
    this.show = false;
    window.location.href = '#/trends/' + trend.Id + '/detail';  
  }

  constructor(private appState: ApplicationState, private bus: MessageBusService, private router:Router) {

    this.bus.subscribe("technologysheet", (title, t: classes.ITechnology) => {
      switch (title) {
        case "show":
          if (this.tech != t || !this.show) {
            this.updateTech(t);
            this.show = true;
          }
          else {
            this.show = false;
          }
          break;
        case "hide":
          this.show = false;
          break;
      }
    });
  }


}
