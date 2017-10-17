import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import * as _ from "lodash";
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus'
import * as $ from 'jquery';


@inject(Element, ApplicationState, CssAnimator, MessageBusService)
export class Home {

  appState: ApplicationState;
  showResult = false;

  @bindable searchInput: string;

  public searchInputChanged(n, o) {
    if (n.length > 0)
    {
      $('#search-form').addClass('search-top');
      this.showResult = true; 
    }
    else
    {
      $('#search-form').removeClass('search-top');
      this.showResult = false;
    }
    
  }


  /**
   * ref element on the binding-context
   */
  image: HTMLImageElement;

  constructor(element, appState, animator, private bus: MessageBusService) {
    this.appState = appState;
  

    this.appState.loadSheets().then(() => {
     
      //this.appState.sheets.sheets.Technologies[0].Technology
    })

  }



  attached() {
  

  }

}

