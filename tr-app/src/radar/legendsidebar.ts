import { MessageBusService } from './../MessageBus';

import { inject } from 'aurelia-framework';
import { classes } from '../classes';
import $ from 'jquery';
import { ApplicationState } from '../ApplicationState';


@inject(ApplicationState, MessageBusService)
export class Legendsidebar {

  appState: ApplicationState;
  bus: MessageBusService;
  mobile: boolean;

  constructor(appState, bus) {
    this.appState = appState;
    this.bus = bus;
  }


  public colorRenderer(color) {
    var colorValue = color;
    var cv = "#000";
    if (this.appState.data.colors.indexOf(colorValue) !== -1) {
      var index = this.appState.data.colors.indexOf(colorValue);
    }
    return "<span style='width:15px;height:15px;border-radius:8px;background:" + this.appState.colors[index] + ";float:left;margin-right:5px'></span>";

  }

  public sizeRenderer(size) {
    var s = 5;
    var sizeIndex = this.appState.data.size.length - this.appState.data.size.indexOf(size);
    if (sizeIndex >= 0) {
      s = (15 / this.appState.data.size.length * sizeIndex) + 5;
    }
    return "<span style='width:" + s + "px;height:" + s + "px;border-radius:" + s / 2 + "px;background:black;float:left;margin-right:5px'></span>";
  }
}
