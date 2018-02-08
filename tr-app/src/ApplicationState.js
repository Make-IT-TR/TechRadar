var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { lazy, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
var a = require('async');
var _ = require('lodash');
import { Project } from './classes';
import { MessageBusService } from './MessageBus';
import * as feathers from 'feathers/client';
import * as io from 'socket.io-client/dist/socket.io';
// var GoogleStrategy = require('passport-google-oauth2').OAuthStrategy;
var rest = require('feathers-rest/client');
var superagent = require('superagent');
var hooks = require('feathers-hooks');
var auth = require('feathers-authentication-client');
var localStorage = require('localstorage-memory');
// var CircularJSON = require('circular-json');
// polyfill fetch client conditionally
var fetchPolyfill = !self.fetch ? System.import('isomorphic-fetch') : Promise.resolve(self.fetch);
var ApplicationState = (function () {
    function ApplicationState(bus, getHttpClient) {
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
        this.authenticated = false;
        this.project = new Project();
        this.initialized = false;
        this.adminMode = true;
        this.showLogin = false;
        // public passport = new Passport();
        this.baseUrl = '';
        this.services = {};
    }
    ApplicationState.prototype.initFeathers = function () {
        var _this = this;
        var socket = io(location.hostname + ':8080', {
            transports: ['rest']
        });
        this.feathersClient = feathers();
        this.feathersClient.configure(hooks())
            .configure(rest('http://' + location.hostname + ':8080').superagent(superagent))
            .configure(auth());
        // this.authenticated = true;
        this.adminMode = true;
        this.feathersClient.authenticate()
            .then(function (e) {
            console.log('authenticated');
            _this.authenticated = true;
            _this.adminMode = true;
        })
            .catch(function () {
            console.log('not authenticated');
            _this.authenticated = false;
            _this.adminMode = false;
        });
        // this.feathersClient.authenticate({
        //   strategy: 'github'
        // }).then((result) => {
        //   console.log('Authenticated!', result);
        //   alert('Your JWT is: ' + this.feathersClient.get('token'));
        // }).catch(function (error) {
        //   console.error('Error authenticating!', error);
        // });
        // openLoginPopup('http://localhost:8080/auth/github');
    };
    ApplicationState.prototype.subscribeObject = function (service, project, result) {
        var _this = this;
        if (!this.services.hasOwnProperty(service)) {
            var s = this.feathersClient.service(service);
            this.services[service] = s;
            s.find().then(function (res) {
                project[service] = res;
                result(res);
            });
            s.on('updated', function (dim) {
                if (service === 'technologies') {
                    var ti = _this.project.technologies.findIndex(function (t) { return t.id === dim.id; });
                    if (~ti) {
                        _this.project.technologies[ti] = dim;
                        _this.project.linkObjects();
                        _this.bus.publish('refresh', 'technology', dim);
                    }
                }
                if (service === 'trends') {
                    var ti = _this.project.trends.findIndex(function (t) { return t.id === dim.id; });
                    if (~ti) {
                        _this.project.trends[ti] = dim;
                        _this.project.linkObjects();
                        _this.bus.publish('refresh', 'trend', dim);
                    }
                }
                // let s = dimensions;
                // console.log(dim);
            });
        }
    };
    ApplicationState.prototype.logout = function () {
        this.feathersClient.logout();
    };
    ApplicationState.prototype.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    ApplicationState.prototype.updateTechnology = function (t) {
        this.services['technologies'].update(t.id, _.omitBy(t, (function (value, key) { return key[0] === '_'; }))).catch(function (e) {
            console.log(e);
        }).then(function () {
            // this.project.linkTechnology(t);
        });
    };
    ApplicationState.prototype.updateTrend = function (trend) {
        var _this = this;
        this.services['trends'].update(trend.id, _.omitBy(trend, (function (value, key) { return key[0] === '_'; }))).catch(function (e) {
            console.log(e);
        }).then(function () {
            _this.project.linkTrend(trend);
        });
    };
    ApplicationState.prototype.updatePlatform = function (platform) {
        this.services['examples'].update(platform.id, _.omitBy(platform, (function (value, key) { return key[0] === '_'; }))).catch(function (e) {
            console.log(e);
        }).then(function (v) {
            console.log(v);
        });
    };
    ApplicationState.prototype.updateRadarInput = function (ri) {
        this.services['radarinput'].update(ri.id, _.omitBy(ri, (function (value, key) { return key[0] === '_'; }))).catch(function (e) {
            console.log(e);
        }).then(function (v) {
            console.log(v);
        });
    };
    ApplicationState.prototype.addPlatform = function (p) {
        var _this = this;
        p._Technologies.forEach(function (t) {
            if (!t.Platforms.includes(p.id))
                t.Platforms.push(p.id);
        });
        this.services['examples'].create(_.omitBy(p, (function (value, key) { return key[0] === '_'; }))).catch(function (e) {
            console.log(e);
        }).then(function () {
            p._Technologies.forEach(function (t) {
                _this.updateTechnology(t);
            });
            // this.project.linkTrend(trend);
        });
    };
    ApplicationState.prototype.addPlatformToTechnology = function (t, e) {
        // if (t._Examples.indexOf(e) === -1) t._Examples.push(e);
        // t._Examples = [];
        if (t.Platforms.indexOf(e.id) === -1)
            t.Platforms.push(e.id);
        if (e._Technologies.indexOf(t) === -1)
            e._Technologies.push(t);
        this.updateTechnology(t);
    };
    ApplicationState.prototype.removePlatformFromTechnology = function (t, e) {
        t._Examples = t._Examples.filter(function (ex) { return ex.Name !== e.Name; });
        t.Platforms = t.Platforms.filter(function (p) { return p !== e.id; });
        e._Technologies = e._Technologies.filter(function (te) { return te.id !== t.id; });
        this.updateTechnology(t);
    };
    ApplicationState.prototype.addTechnologyToTrend = function (trend, tech) {
        if (trend._Technologies.indexOf(tech) === -1) {
            trend._Technologies.push(tech);
            trend.Technologies.push(tech.Technology);
            tech._Trends.push(trend);
            this.updateTrend(trend);
        }
    };
    ApplicationState.prototype.getDimensionValues = function (title) {
        var dim = this.project.dimensions.find(function (f) { return f.title === title; });
        if (dim)
            return dim.values;
        return [];
    };
    ApplicationState.prototype.cleanJSON = function (j) {
        var s = JSON.parse(JSON.stringify(j));
        var keys = [];
        for (var k in s) {
            if (k[0] === '_')
                keys.push(k);
        }
        keys.forEach(function (k) { return delete s[k]; });
        return s;
    };
    ApplicationState.prototype.removeTrendTechnology = function (trend, tech) {
        trend._Technologies = trend._Technologies.filter(function (t) { return t.id !== tech.id; });
        trend.Technologies = trend.Technologies.filter(function (t) { return t !== tech.Technology; });
        tech._Trends = tech._Trends.filter(function (t) { return t.id !== trend.id; });
        this.updateTrend(trend);
    };
    ApplicationState.prototype.loadSheets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('connecting socket');
                return [2 /*return*/, new Promise(function (resolve) {
                        if (_this.initialized) {
                            resolve();
                            return;
                        }
                        _this.initFeathers();
                        a.series([
                            function (cb) { _this.subscribeObject('dimensions', _this.project, function (res) { cb(); }); },
                            function (cb) { _this.subscribeObject('categories', _this.project, function (res) { cb(); }); },
                            function (cb) { _this.subscribeObject('subcategories', _this.project, function (res) { cb(); }); },
                            function (cb) { _this.subscribeObject('examples', _this.project, function (res) { cb(); }); },
                            function (cb) { _this.subscribeObject('trends', _this.project, function (res) { cb(); }); },
                            function (cb) { _this.subscribeObject('technologies', _this.project, function (res) { cb(); }); },
                            function (cb) { _this.subscribeObject('radarinput', _this.project, function (res) { cb(); }); },
                            function (cb) { _this.subscribeObject('presets', _this.project, function (res) { cb(); }); },
                            function (cb) { _this.subscribeObject('years', _this.project, function (res) { cb(); }); }
                        ], function () {
                            _this.project.linkObjects();
                            _this.activeConfig = _this.project.presets[0];
                            _this.activeConfig.Filters.forEach(function (f) { return f.Enabled = false; });
                            console.log('got all data');
                            console.log(_this.activeConfig);
                            _this.initialized = true;
                            // this.services['technologies'].on('update',)
                            resolve();
                        });
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
                ];
            });
        });
    };
    ApplicationState.prototype.loadWiki = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var http, response, text, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('Loading wiki');
                        if (!!this.wiki) return [3 /*break*/, 5];
                        return [4 /*yield*/, fetchPolyfill];
                    case 1:
                        _b.sent();
                        http = this.http = this.getHttpClient();
                        http.configure(function (config) {
                            config
                                .useStandardConfiguration()
                                .withBaseUrl(_this.baseUrl);
                        });
                        return [4 /*yield*/, http.fetch('wiki.json')];
                    case 2:
                        response = _b.sent();
                        return [4 /*yield*/, response.text()];
                    case 3:
                        text = _b.sent();
                        _a = this;
                        return [4 /*yield*/, JSON.parse(text)];
                    case 4:
                        _a.wiki = _b.sent();
                        console.log('Got wiki');
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ApplicationState.prototype.getTechExamples = function (tech) {
        var examples = [];
        examples = _.union(tech._Examples);
        tech._RadarInput.forEach(function (ri) { return examples = _.union(examples, ri._Examples); });
        return examples;
    };
    ApplicationState.prototype.getTrendExamples = function (trend) {
        var examples = [];
        if (trend && trend._Technologies) {
            trend._Technologies.forEach(function (tech) {
                examples = _.union(examples, tech._Examples);
                tech._RadarInput.forEach(function (ri) { return examples = _.union(examples, ri._Examples); });
            });
        }
        return examples;
    };
    ApplicationState.prototype.getDimensionValue = function (input, title, year) {
        if (_.isUndefined(year))
            year = 2016;
        var score = _.find(input.Scores, function (s) { return s.Title === title && (!s.Year || s.Year === year); });
        if (score)
            return score.Value;
        return null;
    };
    ApplicationState.prototype.getDimensionScore = function (input, title, year) {
        if (_.isUndefined(year))
            year = 2016;
        var score = _.find(input.Scores, function (s) { return s.Title === title && (!s.Year || s.Year === year); });
        if (score)
            return score;
        return null;
    };
    ApplicationState.prototype.selectPlatform = function (platform) {
        // (<any>window).ga('send', 'event', 'platforms', 'select', platform.id);
        window.open(platform.Url, 'platformResult');
    };
    ApplicationState = __decorate([
        inject(MessageBusService),
        __param(1, lazy(HttpClient)),
        __metadata("design:paramtypes", [MessageBusService, Function])
    ], ApplicationState);
    return ApplicationState;
}());
export { ApplicationState };
//# sourceMappingURL=ApplicationState.js.map