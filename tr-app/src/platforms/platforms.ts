
import { Trend, Example, ITechnology, WikiResult, Project } from './../classes';
import { bindable, NewInstance } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import * as _ from "lodash";
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus';
import { Router, RouterConfiguration } from 'aurelia-router';
import $ from 'jquery';
import { ValidationRules, ValidationRenderer, RenderInstruction, ValidateResult, ValidationControllerFactory, ValidationController } from 'aurelia-validation';


@inject(Element, ApplicationState, CssAnimator, MessageBusService, RouterConfiguration, Router, NewInstance.of(ValidationController))
export class Platforms {

  heading: string = 'Platforms 2';
  appState: ApplicationState;
  @bindable selectedCategory: string;
  availableTechnologies: ITechnology[];
  @bindable selectedTechnology: string;
  availablePlatforms: Example[];
  activePlatform: Example;
  selectedTech: string;
  @bindable searchText: string;
  isNew: boolean;

  categoryOptions = {
    style: 'btn-info',
    size: 4
  }


  constructor(element, appState, animator, private bus: MessageBusService, private router: Router, private routerConfig: RouterConfiguration, private controller: ValidationController) {
    this.appState = appState;
    this.activePlatform = new Example("");
    if (this.appState.searchFilter && this.appState.searchFilter.length > 0) {
      this.searchText = this.appState.searchFilter;
      this.appState.searchFilter = "";
      this.searchFocus();
    }
    ValidationRules
      .ensure((m: Example) => m.Name).displayName("Name").required()
      .ensure((m: Example) => m.Url).displayName("Url").required()
      .on(this.activePlatform);
  }

  public searchTextChanged(n, o) {
    this.updatePlatforms();
    // $('#platformSearch').css('width', n.length>0 ? '300px' : '50px');
  }

  public searchFocus() {
    $('#platformSearch').css('width', '300px');
  }

  public searchBlur() {
    if (this.searchText && this.searchText.length === 0) $('#platformSearch').css('width', '50px');
  }

  public selectedCategoryChanged(n, o) {
    this.selectedTechnology = "all";
    this.availableTechnologies = _.filter(this.appState.project.technologies, ((t) => { return t.Category === n }));

    this.updatePlatforms();
    //appState.sheets.sheets.Technologies | filterOnProperty:'Category': selectedCategory

  }

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

  public selectedTechnologyChanged(n, o) {
    if (n) {
      console.log('changed');

      this.updatePlatforms();
    }
  }

  public more(tech: ITechnology) {
    this.bus.publish('technologysheet', 'show', tech);
  }

  public editPlatform(platform: Example) {
    this.activePlatform = platform;

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

  public removeTechnology(t: ITechnology) {
    if (this.activePlatform._isNew) {
      this.activePlatform._Technologies = this.activePlatform._Technologies.filter(te => t.id != te.id);
    } else {
      this.appState.removePlatformFromTechnology(t, this.activePlatform);
    }
  }

  public match(p: Example) {
    if (p.Name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) return true;
    let i = 0;
    while (i < p._Technologies.length) {
      let t = p._Technologies[i];
      if (t.Technology.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) { return true; }
      i += 1;
    }
    return false;
  }

  public updatePlatforms() {
    if (!this.selectedCategory) this.selectedCategory = "all";
    if (!this.selectedTechnology) this.selectedTechnology = "all";
    console.log('update platforms');
    history.pushState({}, "new title", "#/platforms/" + encodeURIComponent(this.selectedCategory) + "/" + encodeURIComponent(this.selectedTechnology));
    var temp = [];

    this.appState.project.examples.forEach((p) => {
      var score = 0;
      if (p.Name !== "" && !p.Removed) {
        if (p._Technologies && p._Technologies.length>0) {
          p._Technologies.forEach(t => {
            if (this.selectedCategory === "all") {
              score = 1;
            } else if (this.selectedTechnology !== "all") {
              if (t && t.Technology === this.selectedTechnology) {
                score += 1;
              }
            }
            else {
              if (t && t._Category && t._Category.Category === this.selectedCategory) { score += 1; }
            }
          })
        }
        else {
          if (this.selectedCategory === "all") {
            score = 1;
          }
        }
      }
      if (this.searchText && this.searchText.length > 0 && this.match(p) === false) score = 0;
      if (score > 0) temp.push(p);
    })
    this.availablePlatforms = temp; //_.orderBy(temp, 'Featured', 'desc');
    this.bus.publish('platformselect', null, null);

  }


  /**
   * ref element on the binding-context
   */
  image: HTMLImageElement;
  message: string;

  validateMe() {
    this.controller
      .validate()
      .then(v => {
        if (v.valid)
          this.message = "All is good!";
        else
          this.message = "You have errors!";
      });
  }

  created() {
    console.log('created');
    this.appState.loadSheets().then(() => {
      this.updatePlatforms();
      //this.appState.sheets.sheets.Technologies[0].Technology
    });
    this.appState.bus.subscribe('platformsearch', (s: string, a: any) => {
      this.searchText = s;
    })
  }

  activate(parms, routeConfig) {
    this.selectedCategory = parms['category'];
    this.selectedTechnology = parms['technology'];
    this.searchText = parms['search'];
  }

}

