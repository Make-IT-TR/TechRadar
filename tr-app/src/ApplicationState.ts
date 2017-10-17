
import { lazy, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
var a = require('async');
var _ = require('lodash');
import { Trend, Example, RadarInput, InputScore, ITechnology, WikiResult, Project, Config } from './classes';
import { MessageBusService } from './MessageBus';
import * as feathers from 'feathers/client';
import * as socketio from 'feathers-socketio/client';
import openLoginPopup from 'feathers-authentication-popups';
import * as errors from 'feathers-errors'; // An object with all of the custom error types.
import * as io from 'socket.io-client/dist/socket.io';
// var GoogleStrategy = require('passport-google-oauth2').OAuthStrategy;
const rest = require('feathers-rest/client');
const superagent = require('superagent');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication-client');
const localStorage = require('localstorage-memory');

// var CircularJSON = require('circular-json');

// polyfill fetch client conditionally
const fetchPolyfill = !self.fetch ? System.import('isomorphic-fetch') : Promise.resolve(self.fetch);

@inject(MessageBusService)
export class ApplicationState {

  // public trends: Array<Trend> = [];

  // public platforms: Array<Example> = [];
  // public dimensions: Array<any> = [];
  // public radarinput: Array<RadarInput> = [];
  // // public sheets: classes.SpreadsheetService;
  // public technologies: Array<ITechnology> = [];
  // // public data: classes.SpreadsheetService;
  // public examples: Example[] = [];
  public colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
  public wiki: { [url: string]: WikiResult };
  public authenticated: boolean;
  public project: Project = new Project();
  public activeConfig: Config;
  // public presets: Config[] = [];
  public activeTrend: Trend;
  public initialized = false;
  public adminMode = true;
  public showLogin = false;

  public horizontal: string[];
  public vertical: string[];
  public radial: string[];
  public colorsD: string[];
  public size: string[];
  public items: RadarInput[];
  // public passport = new Passport();
  baseUrl = '';

  _loadingSheets: boolean;

  http: HttpClient;

  constructor(public bus: MessageBusService, @lazy(HttpClient) private getHttpClient: () => HttpClient) { }

  public services: { [id: string]: feathers.Service<any> } = {};
  public feathersClient: feathers.Application;

  initFeathers() {
    const socket = io(location.hostname + ':8010', {
      transports: ['websocket']
    });

    this.feathersClient = feathers();
    this.feathersClient.configure(hooks())
      .configure(rest('http://' + location.hostname + ':8010').superagent(superagent))
      // .configure(socketio(socket))
      .configure(auth({ storage: localStorage }));

    (<any>this.feathersClient).authenticate()
      .then((e) => {
        console.log('authenticated');
        this.authenticated = true;
        this.adminMode = true;
      })
      .catch(() => {
        console.log('not authenticated');
        this.authenticated = false;
        this.adminMode = false;
      });

    // this.feathersClient.authenticate({
    //   strategy: 'github'}).then((result) => {
    //   console.log('Authenticated!', result);
    //   alert('Your JWT is: ' + this.feathersClient.get('token'));
    // }).catch(function (error) {
    //   console.error('Error authenticating!', error);
    // });
    // openLoginPopup('http://localhost:3030/auth/github');
  }

  subscribeObject(service: string, project: Project, result: Function) {

    if (!this.services.hasOwnProperty(service)) {
      let s = this.feathersClient.service(service);
      this.services[service] = s;
      s.find().then(res => {
        project[service] = res;

        result(res);
      });

      s.on('updated', dim => {
        if (service === 'technologies') {
          let ti = this.project.technologies.findIndex(t => t.id === dim.id);
          if (~ti) {
            this.project.technologies[ti] = dim;
            this.project.linkObjects();
            this.bus.publish('refresh', 'technology', dim);
          }
        }
        if (service === 'trends') {
          let ti = this.project.trends.findIndex(t => t.id === dim.id);
          if (~ti) {
            this.project.trends[ti] = dim;
            this.project.linkObjects();
            this.bus.publish('refresh', 'trend', dim);
          }
        }
        // let s = dimensions;
        // console.log(dim);
      });
    }
  }

  public logout() {
    (<any>this.feathersClient).logout();
  }

  public guid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  public updateTechnology(t: ITechnology) {
    this.services['technologies'].update(t.id, _.omitBy(t, ((value, key) => { return key[0] === '_'; }))).catch(e => {
      console.log(e);
    }).then(() => {
      // this.project.linkTechnology(t);
    })
  }

  public updateTrend(trend: Trend) {
    this.services['trends'].update(trend.id, _.omitBy(trend, ((value, key) => { return key[0] === '_'; }))).catch(e => {
      console.log(e);
    }).then(() => {
      this.project.linkTrend(trend);
    })
  }

  public updatePlatform(platform: Example) {
    this.services['examples'].update(platform.id, _.omitBy(platform, ((value, key) => { return key[0] === '_'; }))).catch(e => {
      console.log(e);
    }).then(v => {
      console.log(v);
    })
  }

  public updateRadarInput(ri : RadarInput) {
    this.services['radarinput'].update(ri.id, _.omitBy(ri, ((value, key) => { return key[0] === '_'; }))).catch(e => {
      console.log(e);
    }).then(v => {
      console.log(v);
    })
  }

  public addPlatform(p: Example): any {
    this.services['examples'].create(_.omitBy(p, ((value, key) => { return key[0] === '_'; }))).catch(e => {
      console.log(e);
    }).then(() => {
      p._Technologies.forEach(t => {
        this.updateTechnology(t);
      });
      // this.project.linkTrend(trend);
    });

  }

  public addPlatformToTechnology(t: ITechnology, e: Example) {
    // if (t._Examples.indexOf(e) === -1) t._Examples.push(e);
    t._Examples = [];
    if (t.Platforms.indexOf(e.id) === -1) t.Platforms.push(e.id);
    // if (e._Technologies.indexOf(t) === -1) e._Technologies.push(t);
    this.updateTechnology(t);
  }

  public removePlatformFromTechnology(t: ITechnology, e: Example) {
    t._Examples = t._Examples.filter(ex => ex.Name !== e.Name);
    t.Platforms = t.Platforms.filter(p => p !== e.id);
    e._Technologies = e._Technologies.filter(te => te.id !== t.id);
    this.updateTechnology(t);

  }

  public addTechnologyToTrend(trend: Trend, tech: ITechnology) {
    if (trend._Technologies.indexOf(tech) === -1) {
      trend._Technologies.push(tech);
      trend.Technologies.push(tech.Technology);
      tech._Trends.push(trend);
      this.updateTrend(trend);
    }
  }

  public getDimensionValues(title: string): string[] {
    let dim = this.project.dimensions.find(f => f.title === title);
    if (dim) return dim.values;
    return [];
  }

  public cleanJSON(j: any): any {
    let s = JSON.parse(JSON.stringify(j));
    let keys = [];
    for (var k in s) { if (k[0] === '_') keys.push(k); }
    keys.forEach(k => delete s[k]);
    return s;
  }

  public removeTrendTechnology(trend: Trend, tech: ITechnology) {
    trend._Technologies = trend._Technologies.filter(t => t.id !== tech.id);
    trend.Technologies = trend.Technologies.filter(t => t !== tech.Technology);
    tech._Trends = tech._Trends.filter(t => t.id !== trend.id);
    this.updateTrend(trend);

  }

  async loadSheets(): Promise<void> {
    console.log('connecting socket');
    return new Promise<void>((resolve) => {
      if (this.initialized) { resolve(); return; }
      this.initFeathers();
      a.series([
        (cb) => { this.subscribeObject('dimensions', this.project, (res) => { cb(); }) },
        (cb) => { this.subscribeObject('categories', this.project, (res) => { cb(); }) },
        (cb) => { this.subscribeObject('subcategories', this.project, (res) => { cb(); }) },
        (cb) => { this.subscribeObject('examples', this.project, (res) => { cb() }) },
        (cb) => { this.subscribeObject('trends', this.project, (res) => { cb() }) },
        (cb) => { this.subscribeObject('technologies', this.project, (res) => { cb() }) },
        (cb) => { this.subscribeObject('radarinput', this.project, (res) => { cb() }) },
        (cb) => { this.subscribeObject('presets', this.project, (res) => { cb() }) },
        (cb) => { this.subscribeObject('years', this.project, (res) => { cb() }) }

      ], () => {
        this.project.linkObjects();
        this.activeConfig = this.project.presets[0];
        console.log('got all data');
        this.initialized = true;
        // this.services['technologies'].on('update',)

        resolve();

      })
    })







    // if (!this._loadingSheets && !this.sheets) {
    //   await fetchPolyfill;
    //   const http = this.http = this.getHttpClient();

    //   http.configure(config => {
    //     config
    //       .useStandardConfiguration()
    //       .withBaseUrl(this.baseUrl);
    //   });

    //   // const response = await http.fetch('sheets.json?time=' + new Date().getTime());
    //   const response = await http.fetch('http://localhost:8031/api/makeit/all?time=' + new Date().getTime());
    //   var text = await response.text();
    //   this.sheets = await CircularJSON.parse(text);
    //   this.data = this.sheets;

    //   this.trends = await this.sheets.sheets.Trends;
    //   this.platforms = await this.sheets.sheets.Examples;
    //   this.dimensions = this.sheets.sheets.Dimensions;

    //   //TODO: find empty example categories and hide them in platform view
    //   // this.sheets.sheets.Categories.forEach(c=>{
    //   //   this.platforms.find(p=>p.)
    //   // });

    //   await this.loadWiki().then(() => {
    //     console.log('got wiki');
    //   })
    // }
  }

  async loadWiki(): Promise<void> {
    console.log('Loading wiki');
    if (!this.wiki) {
      await fetchPolyfill;
      const http = this.http = this.getHttpClient();

      http.configure(config => {
        config
          .useStandardConfiguration()
          .withBaseUrl(this.baseUrl);
      });

      const response = await http.fetch('wiki.json');
      var text = await response.text();
      this.wiki = await JSON.parse(text);
      console.log('Got wiki');

    }
  }

  public getTechExamples(tech: ITechnology) {
    let examples: Example[] = [];
    examples = _.union(tech._Examples);
    tech._RadarInput.forEach(ri => examples = _.union(examples, ri._Examples));
    return examples;
  }

  public getTrendExamples(trend: Trend) {
    let examples: Example[] = [];
    if (trend && trend._Technologies) {
      trend._Technologies.forEach(tech => {
        examples = _.union(examples, tech._Examples);
        tech._RadarInput.forEach(ri => examples = _.union(examples, ri._Examples));
      });
    }
    return examples;
  }

  public getDimensionValue(input: RadarInput, title: string, year?: number) {
    if (_.isUndefined(year)) year = 2016;
    var score = _.find(input.Scores, s => { return s.Title === title && (!s.Year || s.Year === year); });
    if (score) return score.Value;
    return null;
  }

  public getDimensionScore(input: RadarInput, title: string, year?: number): InputScore {
    if (_.isUndefined(year)) year = 2016;
    var score = _.find(input.Scores, s => { return s.Title === title && (!s.Year || s.Year === year); });
    if (score) return score;
    return null;
  }

  public selectPlatform(platform: Example) {
    window.open(platform.Url, 'platformResult');
  }

}
