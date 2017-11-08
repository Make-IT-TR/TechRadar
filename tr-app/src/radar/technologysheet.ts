import { MessageBusService } from './../MessageBus';
import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { InputScore, Trend, Example, ITechnology, WikiResult, Project, RadarInput } from './../classes';

import $ from 'jquery';
import { ApplicationState } from '../ApplicationState';
import * as _ from 'lodash';
import { Technology } from '../../../tr-host/src/utils/technology';


@inject(ApplicationState, MessageBusService, Router)
export class Technologysheet {

  mobile: boolean;
  tech: ITechnology;
  show = false;
  wiki: WikiResult;
  examples: Example[];
  scores: InputScore[];

  updateTech(t: ITechnology) {
    console.log('Get examples');
    this.examples = [];
    this.tech = t;
    this.wiki = t.WikiResult;
    this.examples = this.appState.getTechExamples(t);
    let input = this.appState.project.radarinput.find(ri=>ri._Technology === this.tech);
    if (input) {
      this.scores = input.Scores;
    }
    let s = this.appState.project.dimensions;
  }

  closeSheet(e: MouseEvent) {

    // console.log(e);
    this.show = false;
  }

  public selectPlatform(e: MouseEvent, example: Example) {
    e.cancelBubble = true;
    this.show = false;
    this.appState.selectPlatform(example);
    
  }

  public selectCategory()
  {
    console.log('select category');
    //window.location.href = '#/platforms/' + this.tech.Category + '/all';  
    this.router.navigateToRoute('Platforms', { category: this.tech.Category });     
    
  }

  public selectTrend(e: MouseEvent, trend: Trend) {           
    // e.cancelBubble = true;
    // this.show = false;
    // window.location.href = '#/trends/' + trend.id + '/detail';  
    this.router.navigateToRoute('trendsDetail', { trend: trend.id });     
    // history.pushState({}, "new title", "#/trends/" + trend.id + "/detail");

  }

  public editTech(tech: Technology) {
    this.router.navigateToRoute('techEdit', { technology: tech.id });   
  }

  constructor(private appState: ApplicationState, private bus: MessageBusService, private router:Router) {

    this.bus.subscribe("technologysheet", (title, t: ITechnology) => {
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
