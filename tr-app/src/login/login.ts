import { Trend, Example, ITechnology, WikiResult, Project } from './../classes';
import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import * as _ from "lodash";
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus';
import { Router, RouterConfiguration } from 'aurelia-router';

@inject(Element, ApplicationState, CssAnimator, MessageBusService)
export class Login {

  public appState: ApplicationState;

  constructor(element, appState, animator, private bus: MessageBusService) {
    this.appState = appState;
  }

  public login(strategy: string)
  {
    location.replace('http://localhost:8010/auth/' + strategy)
  }

}

