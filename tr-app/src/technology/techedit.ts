import { MessageBusService } from './../MessageBus';
import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { InputScore, Trend, Example, ITechnology, WikiResult, Project, RadarInput } from './../classes';

import $ from 'jquery';
import { ApplicationState } from '../ApplicationState';
import * as _ from 'lodash';


@inject(ApplicationState, MessageBusService, Router)
export class TechEdit {

  mobile: boolean;
  tech: ITechnology;
  show = false;
  wiki: WikiResult;
  examples: Example[];
  selectedTrend: string;
  scores: InputScore[];
  params: any;
  years: number[];
  selectedExample: string;

  activate(parms, routeConfig) {
    this.params = parms;

    this.bus.subscribe('refresh', (a, d) => {
      // if (a === 'technology') {
      this.refresh();
      //}
    });

    this.appState.loadSheets().then(() => {
      if (this.params.hasOwnProperty('technology')) {
        this.refresh();
      }
    });
  }

  getScores(y: number, d: string) {
    let res = [];
    let s = this.scores.find(s => s.Year === y && s.Title === d);
    if (!s) {
      s = <InputScore>{ Year: y, Title: d, Value: '' };
    }
    res.push(s);
    return res;
  }

  refresh() {
    this.tech = this.appState.project.technologies.find(t => t.id == this.params['technology']);
    this.updateTech(this.tech);
    this.years = this.appState.project.years;

    // missing
  }

  scoreChanged(s: InputScore) {
    let input = this.appState.project.radarinput.find(ri => ri._Technology === this.tech);
    let found = false;
    input.Scores.forEach(score=>{
      if (score.Year === s.Year && score.Title === s.Title) {
        score.Value = s.Value;
        found = true;
      }
    })
    if (!found) input.Scores.push(s);
    this.appState.updateRadarInput(input);
  }

  removePlatform(e: Example) {
    this.appState.removePlatformFromTechnology(this.tech, e);

  }

  addTrend() {
    let tr = this.appState.project.trends.find(t => t.id === this.selectedTrend);
    if (tr) this.appState.addTechnologyToTrend(tr, this.tech);
  }

  addExample() {
    let ex = this.appState.project.examples.find(t => t.id === this.selectedExample);
    if (ex) this.appState.addPlatformToTechnology(this.tech, ex);
  }

  removeTrendTechnology(trend: Trend) {
    this.appState.removeTrendTechnology(trend, this.tech);
  }

  update() {
    this.appState.updateTechnology(this.tech);
  }

  updateTech(t: ITechnology) {
    console.log('Get examples');
    this.examples = [];
    this.tech = t;
    this.wiki = t.WikiResult;
    this.examples = this.appState.getTechExamples(t);
    let input = this.appState.project.radarinput.find(ri => ri._Technology === this.tech);
    if (input) {
      this.scores = input.Scores;
    }
    let s = this.appState.project.dimensions;
  }

  closeSheet(e: MouseEvent) {
    this.show = false;
  }

  public selectPlatform(e: MouseEvent, example: Example) {
    e.cancelBubble = true;
    this.show = false;
    this.appState.selectPlatform(example);

  }

  public selectCategory() {
    console.log('select category');
    window.location.href = '#/platforms/' + this.tech.Category + '/all';
  }

  public selectTrend(e: MouseEvent, trend: Trend) {
    e.cancelBubble = true;
    this.show = false;
    window.location.href = '#/trends/' + trend.id + '/detail';
  }

  constructor(public appState: ApplicationState, private bus: MessageBusService, private router: Router) {

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
