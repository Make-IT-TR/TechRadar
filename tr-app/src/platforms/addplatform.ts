import { MessageBusService } from './../MessageBus';
import { Router } from 'aurelia-router';
import { inject, bindable } from 'aurelia-framework';
import { InputScore, Trend, Example, ITechnology, WikiResult, Project, RadarInput } from './../classes';

import $ from 'jquery';
import { ApplicationState } from '../ApplicationState';
import * as _ from 'lodash';


@inject(ApplicationState, MessageBusService, Router)
export class AddPlatform {

  mobile: boolean;
  @bindable selectedCategory: string;
  availableTechnologies: ITechnology[];
  @bindable selectedTechnology: string;
  availablePlatforms: Example[];
  activePlatform: Example;
  isNew: boolean;
  selectedTech: string;
  show: boolean;
  
  public savePlatform() {
    if (this.activePlatform._isNew) {
      this.activePlatform._isNew = false;
      this.appState.addPlatform(this.activePlatform);
    } else {
      this.updatePlatform();
      $('#editplatform').modal('hide');

    }
  }

  public addPlatform() {
    if (!this.appState.adminMode) {
      this.appState.showLogin = true;
    } else {
      this.isNew = true;
      this.activePlatform = new Example("");
      this.activePlatform.id = this.appState.guid();
      this.activePlatform._isNew = true;
    }
  }

  public updatePlatform() {
    this.appState.updatePlatform(this.activePlatform);
    // this.appState.feathersClient.service('examples').update(this.activePlatform.Name, this.activePlatform);
    // alert('updating');
  }

  public addTechnology() {
    if (this.activePlatform._isNew) {
      let tech = this.appState.project.technologies.find(k => k.Technology === this.selectedTech);
      this.activePlatform._Technologies.push(tech);
    } else {
      let tech = this.appState.project.technologies.find(k => k.Technology === this.selectedTech);
      if (tech && this.activePlatform) this.appState.addPlatformToTechnology(tech, this.activePlatform);
    }
  }

  public removePlatform() {
    this.activePlatform.Removed = true;
    this.appState.updatePlatform(this.activePlatform);
  }

  public cancelUpdate() {
    // this.appState.project.technologies
    // alert('cancel update');
  }

  constructor(private appState: ApplicationState, private bus: MessageBusService, private router:Router) {
    alert('init');
    this.bus.subscribe("addplatform", (title, t: ITechnology) => {
      switch (title) {
        case "show":
            this.show = true;
          
          break;
        case "hide":
          this.show = false;
          break;
      }
    });
    
  }


}
