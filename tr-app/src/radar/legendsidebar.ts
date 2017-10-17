import { MessageBusService } from './../MessageBus';

import { inject } from 'aurelia-framework';
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
    if (this.appState.colorsD.indexOf(colorValue) !== -1) {
      var index = this.appState.colorsD.indexOf(colorValue);
    }
    return "<span style='width:15px;height:15px;border-radius:8px;background:" + this.appState.colors[index] + ";float:left;margin-right:5px'></span>";

  }

  public sizeRenderer(size) {
    var s = 5;
    var sizeIndex = this.appState.size.length - this.appState.size.indexOf(size);
    if (sizeIndex >= 0) {
      s = (15 / this.appState.size.length * sizeIndex) + 5;
    }
    return "<span style='width:" + s + "px;height:" + s + "px;border-radius:" + s / 2 + "px;background:black;float:left;margin-right:5px'></span>";
  }
}
