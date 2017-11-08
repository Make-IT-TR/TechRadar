import { MessageBusService } from './../MessageBus';

import { inject } from 'aurelia-framework';
import { Trend, Example, ITechnology, WikiResult, Project, Config, Vis, Filter } from './../classes';
import $ from 'jquery';
import { ApplicationState } from '../ApplicationState';
var d3 = require('d3');


@inject(ApplicationState, MessageBusService)
export class Techradar {

  appState: ApplicationState;
  bus: MessageBusService;
  mobile: boolean;
  editMode: boolean = true;
  activePreset: Config;

  constructor(appState, bus) {
    this.appState = appState;


    this.bus = bus;


  }

  showAll() {
    this.bus.publish("filter", "all");
  }

  showTrends() {
    this.bus.publish("filter", "trend", this.appState.project.trends[0]);
  }

  updatePreset() {
    this.appState.activeConfig = this.activePreset;

    this.updateFilter();
  }

  updateFilter() {
    console.log('publish');
    this.bus.publish("reload", "all");

  }

  toggleReverse(v: Vis) {
    console.log('toggle reverse');
    v.Reverse = !v.Reverse;
    this.updateFilter();
  }

  addNewFilter(value: string) {
    this.appState.activeConfig.Filters.forEach(f => {
      if (f.Dimension === value) f.Enabled = true;
    });
    this.updateFilter();
  }

  selectTrend(t: Trend) {
    this.bus.publish("filter", "trend", t);
  }

  disableFilter(f: Filter) {
    f.Enabled = false;
    this.updateFilter();
  }

  activate(parms, routeConfig) {
    this.mobile = $(document).width() < 800;
    this.appState.loadSheets().then(() => {
      setTimeout(() => this.bus.publish("reload", "all"), 300);


      // this.appState.activeConfig.Filters.forEach(f=>f.Enabled = false);
      // this.updateFilter();

    })
  }
}
