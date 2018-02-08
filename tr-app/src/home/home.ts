import { Router } from 'aurelia-router';
import { Example, Project } from './../classes';
import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import * as _ from "lodash";
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus'
import * as $ from 'jquery';


@inject(Element, ApplicationState, CssAnimator, MessageBusService, Router)
export class Home {

  appState: ApplicationState;
  showResult = false;
  model = {
    example: null,
    city: null
  };

  suggestionService = null;

  @bindable searchInput: string;

  public searchInputChanged(n, o) {
    if (n.length > 0) {
      $('#search-form').addClass('search-top');
      this.showResult = true;
    }
    else {
      $('#search-form').removeClass('search-top');
      this.showResult = false;
    }

  }


  /**
   * ref element on the binding-context
   */
  image: HTMLImageElement;

  constructor(element, appState, animator, private bus: MessageBusService, public router: Router) {
    this.appState = appState;


    this.appState.loadSheets().then(() => {
      this.suggestionService = new SuggestionService(this.router, this.model, this.appState.project, this.appState);

      //this.appState.sheets.sheets.Technologies[0].Technology
    })

  }



  attached() {

  }
}

export class SuggestionResult {
  constructor(public name, public type, public select: Function) {

  }
}


export class SuggestionService {
  constructor(public router: Router, public model, public project: Project, public appState: ApplicationState) {
    // this.model = model;
    // this.countryIndex = countries;
    // this.project = Object.keys(countries);
  }

  example = {
    suggest: value => {
      if (value === '') {
        return Promise.resolve([]);
      }
      value = value.toLowerCase();
      this.project.examples.filter
      let result = [];

      this.project.examples
        .filter(x => x.Name.toLowerCase().indexOf(value) === 0)
        .forEach(e => result.push(new SuggestionResult(e.Name, 'example', (sr: SuggestionResult) => {
          this.appState.searchFilter = e.Name;
          this.router.navigateToRoute('Platforms', { category: 'all', technology: 'all'}, { search: e.Name});          
        })));

      this.project.technologies
        .filter(x => x.Technology.toLowerCase().indexOf(value) === 0)
        .forEach(e => result.push(new SuggestionResult(e.Technology, 'technology', (sr: SuggestionResult) => {
          this.router.navigateToRoute('Platforms', { category: e.Category, technology: encodeURIComponent(e.Technology)});          
        })));

      this.project.trends
        .filter(x => x.Name.toLowerCase().indexOf(value) === 0)
        .forEach(e => result.push(new SuggestionResult(e.Name, 'trend', (sr: SuggestionResult) => {
          this.router.navigateToRoute('trendsDetail', { trend : e.id});
        })));

      return Promise.resolve(result);
    },

    getName: suggestion => suggestion
  };
}

