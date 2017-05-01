import { classes } from './../classes';
import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import * as _ from "lodash";
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus';
import { Router, RouterConfiguration } from 'aurelia-router';


@inject(Element, ApplicationState, CssAnimator, MessageBusService,RouterConfiguration, Router)
export class Platforms {

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

  public selectedCategoryChanged(n, o) {
    this.selectedTechnology = "all";
    this.availableTechnologies = _.filter(this.appState.sheets.sheets.Technologies, ((t) => { return t.Category === n }));

    this.updatePlatforms();
    //appState.sheets.sheets.Technologies | filterOnProperty:'Category': selectedCategory

  }

  public selectedTechnologyChanged(n, o) {
    if (n) {
      console.log('changed');
      
      this.updatePlatforms();
    }
  }

  public more(tech: classes.ITechnology) {
    this.bus.publish('technologysheet', 'show', tech);
  }

 

  public updatePlatforms() {
    if (!this.selectedCategory) this.selectedCategory = "all";
    if (!this.selectedTechnology) this.selectedTechnology = "all";
    console.log('update platforms');
    history.pushState({}, "new title", "#/platforms/" + encodeURIComponent(this.selectedCategory) + "/" + encodeURIComponent(this.selectedTechnology)); 
    var temp = [];
    this.appState.sheets.sheets.Examples.forEach((p) => {
      var score = 0;
      if (p.Name !== "" && p._Technologies) {
        p._Technologies.forEach(t => {
          if (this.selectedCategory === "all") {
            score = 1;
          } else if (this.selectedTechnology !== "all") {
            if (t && t.Technology === this.selectedTechnology) {
              score += 1;
            }
          }
          else {

            if (t && t._Category && t._Category.Category === this.selectedCategory)
            { score += 1; }
          }
        })
      }
      if (score > 0) temp.push(p);

      this.availablePlatforms = _.orderBy(temp, 'Featured', 'desc');
    })

  }


  /**
   * ref element on the binding-context
   */
  image: HTMLImageElement;

  constructor(element, appState, animator, private bus: MessageBusService, private router : Router, private routerConfig : RouterConfiguration) {
    this.appState = appState;

    

    this.appState.loadSheets().then(() => {
      this.updatePlatforms();
      //this.appState.sheets.sheets.Technologies[0].Technology
    })

  }

  activate(parms, routeConfig) {
    this.selectedCategory = parms['category'];
    this.selectedTechnology = parms['technology'];
  }

}

