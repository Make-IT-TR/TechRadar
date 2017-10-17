"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_fetch_client_1 = require("aurelia-fetch-client");
var a = require('async');
var _ = require('lodash');
const classes_1 = require("./classes");
const MessageBus_1 = require("./MessageBus");
const feathers = require("feathers/client");
const feathers_authentication_popups_1 = require("feathers-authentication-popups");
const io = require("socket.io-client/dist/socket.io");
// var GoogleStrategy = require('passport-google-oauth2').OAuthStrategy;
const rest = require('feathers-rest/client');
const superagent = require('superagent');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication-client');
const localStorage = require('localstorage-memory');
// var CircularJSON = require('circular-json');
// polyfill fetch client conditionally
const fetchPolyfill = !self.fetch ? System.import('isomorphic-fetch') : Promise.resolve(self.fetch);
let ApplicationState = class ApplicationState {
    constructor(bus, getHttpClient) {
        this.bus = bus;
        this.getHttpClient = getHttpClient;
        // public trends: Array<Trend> = [];
        // public platforms: Array<Example> = [];
        // public dimensions: Array<any> = [];
        // public radarinput: Array<RadarInput> = [];
        // // public sheets: classes.SpreadsheetService;
        // public technologies: Array<ITechnology> = [];
        // // public data: classes.SpreadsheetService;
        // public examples: Example[] = [];
        this.colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
        this.project = new classes_1.Project();
        this.initialized = false;
        this.adminMode = true;
        // public passport = new Passport();
        this.baseUrl = '';
        this.services = {};
    }
    initFeathers() {
        const socket = io(location.hostname + ':8011', {
            transports: ['websocket']
        });
        this.feathersClient = feathers();
        this.feathersClient.configure(hooks())
            .configure(rest('http://' + location.hostname + ':8011').superagent(superagent))
            .configure(auth({ storage: localStorage }));
        // this.feathersClient.authenticate({
        //   strategy: 'github'}).then((result) => {
        //   console.log('Authenticated!', result);
        //   alert('Your JWT is: ' + this.feathersClient.get('token'));
        // }).catch(function (error) {
        //   console.error('Error authenticating!', error);
        // });
        feathers_authentication_popups_1.default('http://localhost:3030/auth/github');
    }
    subscribeObject(service, project, result) {
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
    initGoogle() {
        // passport.initialize();
        // passport.use(new GoogleStrategy({
        //   consumerKey: '741362351536-54ta0tioh4nrd2tto7vlppeb3db5rbjg.apps.googleusercontent.com',
        //   consumerSecret: 'oNH2m9rZAxRu7OselZsITyUt',
        //   callbackURL: "http://localhost:8010/auth/google/callback"
        // },
        //   function (token, tokenSecret, profile, done) {
        //     User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //       return done(err, user);
        //     });
        //   }
        // ));
    }
    updateTechnology(t) {
        this.services['technologies'].update(t.id, _.omitBy(t, ((value, key) => { return key[0] === '_'; }))).catch(e => {
            console.log(e);
        }).then(() => {
            this.project.linkTechnology(t);
        });
    }
    updateTrend(trend) {
        this.services['trends'].update(trend.id, _.omitBy(trend, ((value, key) => { return key[0] === '_'; }))).catch(e => {
            console.log(e);
        }).then(() => {
            this.project.linkTrend(trend);
        });
    }
    addPlatformToTechnology(t, e) {
        if (t._Examples.indexOf(e) === -1)
            t._Examples.push(e);
        if (t.Platforms.indexOf(e.id) === -1)
            t.Platforms.push(e.id);
        if (e._Technologies.indexOf(t) === -1)
            e._Technologies.push(t);
        this.updateTechnology(t);
    }
    removePlatformFromTechnology(t, e) {
        t._Examples = t._Examples.filter(ex => ex.Name !== e.Name);
        t.Platforms = t.Platforms.filter(p => p !== e.id);
        e._Technologies = e._Technologies.filter(te => te.id !== t.id);
        this.updateTechnology(t);
    }
    addTechnologyToTrend(trend, tech) {
        if (trend._Technologies.indexOf(tech) === -1) {
            trend._Technologies.push(tech);
            trend.Technologies.push(tech.Technology);
            tech._Trends.push(trend);
            this.updateTrend(trend);
        }
    }
    getDimensionValues(title) {
        let dim = this.project.dimensions.find(f => f.title === title);
        if (dim)
            return dim.values;
        return [];
    }
    cleanJSON(j) {
        let s = JSON.parse(JSON.stringify(j));
        let keys = [];
        for (var k in s) {
            if (k[0] === '_')
                keys.push(k);
        }
        keys.forEach(k => delete s[k]);
        return s;
    }
    removeTrendTechnology(trend, tech) {
        trend._Technologies = trend._Technologies.filter(t => t.id !== tech.id);
        trend.Technologies = trend.Technologies.filter(t => t !== tech.Technology);
        tech._Trends = tech._Trends.filter(t => t.id !== trend.id);
        this.updateTrend(trend);
    }
    loadSheets() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('connecting socket');
            this.initGoogle();
            return new Promise((resolve) => {
                if (this.initialized) {
                    resolve();
                    return;
                }
                this.initFeathers();
                a.series([
                    (cb) => { this.subscribeObject('dimensions', this.project, (res) => { cb(); }); },
                    (cb) => { this.subscribeObject('categories', this.project, (res) => { cb(); }); },
                    (cb) => { this.subscribeObject('subcategories', this.project, (res) => { cb(); }); },
                    (cb) => { this.subscribeObject('examples', this.project, (res) => { cb(); }); },
                    (cb) => { this.subscribeObject('trends', this.project, (res) => { cb(); }); },
                    (cb) => { this.subscribeObject('technologies', this.project, (res) => { cb(); }); },
                    (cb) => { this.subscribeObject('radarinput', this.project, (res) => { cb(); }); },
                    (cb) => { this.subscribeObject('presets', this.project, (res) => { cb(); }); },
                    (cb) => { this.subscribeObject('years', this.project, (res) => { cb(); }); }
                ], () => {
                    this.project.linkObjects();
                    this.activeConfig = this.project.presets[0];
                    console.log('got all data');
                    this.initialized = true;
                    // this.services['technologies'].on('update',)
                    resolve();
                });
            });
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
        });
    }
    loadWiki() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading wiki');
            if (!this.wiki) {
                yield fetchPolyfill;
                const http = this.http = this.getHttpClient();
                http.configure(config => {
                    config
                        .useStandardConfiguration()
                        .withBaseUrl(this.baseUrl);
                });
                const response = yield http.fetch('wiki.json');
                var text = yield response.text();
                this.wiki = yield JSON.parse(text);
                console.log('Got wiki');
            }
        });
    }
    getTechExamples(tech) {
        let examples = [];
        examples = _.union(tech._Examples);
        tech._RadarInput.forEach(ri => examples = _.union(examples, ri._Examples));
        return examples;
    }
    getTrendExamples(trend) {
        let examples = [];
        if (trend && trend._Technologies) {
            trend._Technologies.forEach(tech => {
                examples = _.union(examples, tech._Examples);
                tech._RadarInput.forEach(ri => examples = _.union(examples, ri._Examples));
            });
        }
        return examples;
    }
    getDimensionValue(input, title, year) {
        if (_.isUndefined(year))
            year = 2016;
        var score = _.find(input.Scores, s => { return s.Title === title && (!s.Year || s.Year === year); });
        if (score)
            return score.Value;
        return null;
    }
    getDimensionScore(input, title, year) {
        if (_.isUndefined(year))
            year = 2016;
        var score = _.find(input.Scores, s => { return s.Title === title && (!s.Year || s.Year === year); });
        if (score)
            return score;
        return null;
    }
    selectPlatform(platform) {
        window.open(platform.Url, 'platformResult');
    }
};
ApplicationState = __decorate([
    aurelia_framework_1.inject(MessageBus_1.MessageBusService),
    __param(1, aurelia_framework_1.lazy(aurelia_fetch_client_1.HttpClient))
], ApplicationState);
exports.ApplicationState = ApplicationState;
//# sourceMappingURL=ApplicationState.js.map