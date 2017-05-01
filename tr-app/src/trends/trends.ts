import {inject} from 'aurelia-framework'; 

import {ApplicationState} from '../ApplicationState';

@inject(ApplicationState)
export class Trends {
  
  heading: string = 'Trends';
  appState : ApplicationState;  
  /**
   * ref element on the binding-context
   */
  image: HTMLImageElement;

  constructor (appState) {
    this.appState = appState;
    this.appState.loadSheets();
  }

}
