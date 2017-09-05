import { MessageBusService } from './../MessageBus';

import { inject } from 'aurelia-framework';
import { classes } from '../classes';
import $ from 'jquery';
import { ApplicationState } from '../ApplicationState';
var d3 = require('d3');


@inject(ApplicationState, MessageBusService)
export class Techradar {

  appState: ApplicationState;
  bus: MessageBusService;
  mobile: boolean;
  editMode : boolean = true;
  activePreset : classes.Config;

  constructor(appState, bus) {
    this.appState = appState;


    this.bus = bus;


  }

  showAll()
  {
    this.bus.publish("filter","all");
  }

  showTrends()
  {
    this.bus.publish("filter","trend",this.appState.trends[0]);
  }

  updatePreset()
  {
    this.appState.data.activeConfig = this.activePreset;
    this.updateFilter();
  }

  updateFilter() {
    console.log('publish');
    this.bus.publish("reload", "all");

  }

  toggleReverse(v: classes.Vis) {
    console.log('toggle reverse');
    v.Reverse = !v.Reverse;
    this.updateFilter();
  }

  addNewFilter(value: string) {
    this.appState.data.activeConfig.Filters.forEach(f => {
      if (f.Dimension === value) f.Enabled = true;
    });
    this.updateFilter();
  }

  selectTrend(t:classes.Trend)
  {
    this.bus.publish("filter","trend",t);
  }

  disableFilter(f: classes.Filter) {
    f.Enabled = false;
    this.updateFilter();
  }

  activate(parms, routeConfig) {
    this.mobile = $(document).width() < 800;
    this.appState.loadSheets().then(()=>{
      this.showTrends();
    })
  }
}
