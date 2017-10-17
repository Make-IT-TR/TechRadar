import { autoinject, customElement, bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import * as _ from "lodash";
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus'
import * as $ from 'jquery';

import { GridOptions } from 'ag-grid';

@inject(Element, ApplicationState, CssAnimator, MessageBusService)
export class Admin {

  appState: ApplicationState;
  showResult = false;
  private trendOptions: GridOptions;


  constructor(element, appState, animator, private bus: MessageBusService) {
    this.appState = appState;
    this.trendOptions = <GridOptions>{};
    this.trendOptions.rowData = this.createRowData();
    this.trendOptions.enableFilter = true;
    this.trendOptions.defaultColDef = {
      menuTabs: ['filterMenuTab']
    }

    this.appState.loadSheets().then(() => {



      //this.appState.sheets.sheets.Technologies[0].Technology
    })

  }

  private createRowData() {
    return [
      { "row": "Row 1", "name": "Michael Phelps" },
      { "row": "Row 2", "name": "Natalie Coughlin" },
      { "row": "Row 3", "name": "Aleksey Nemov" },
      { "row": "Row 4", "name": "Alicia Coutts" },
      { "row": "Row 5", "name": "Missy Franklin" },
      { "row": "Row 6", "name": "Ryan Lochte" },
      { "row": "Row 7", "name": "Allison Schmitt" },
      { "row": "Row 8", "name": "Natalie Coughlin" },
      { "row": "Row 9", "name": "Ian Thorpe" },
      { "row": "Row 10", "name": "Bob Mill" },
      { "row": "Row 11", "name": "Willy Walsh" },
      { "row": "Row 12", "name": "Sarah McCoy" },
      { "row": "Row 13", "name": "Jane Jack" },
      { "row": "Row 14", "name": "Tina Wills" }
    ];
  }





  attached() {


  }

}

