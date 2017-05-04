import { classes } from './../classes';
import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import * as _ from "lodash";
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus';
import { Router, RouterConfiguration } from 'aurelia-router';


@inject(Element, ApplicationState, CssAnimator, MessageBusService,RouterConfiguration, Router)
export class AddPlatform {

  heading: string = 'Platforms 2';
  appState: ApplicationState;
  @bindable selectedCategory: string;
  availableTechnologies: classes.ITechnology[];
  @bindable selectedTechnology: string;
  availablePlatforms: classes.Example[];

  categoryOptions = {
    style: 'btn-info',
    size: 4
  }

submit()
{
  window.location.href="#/platforms/all/all";
}

  constructor(element, appState, animator, private bus: MessageBusService, private router : Router, private routerConfig : RouterConfiguration) {
    this.appState = appState;

    

    this.appState.loadSheets().then(() => {
    // this.appState.sheets.sheets.Technologies[0].Technology
      //this.appState.sheets.sheets.Technologies[0].Technology
    })

  }

 

}

