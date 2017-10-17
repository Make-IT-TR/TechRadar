"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_framework_2 = require("aurelia-framework");
const ApplicationState_1 = require("../ApplicationState");
const _ = require("lodash");
const aurelia_animator_css_1 = require("aurelia-animator-css");
const MessageBus_1 = require("./../MessageBus");
const aurelia_router_1 = require("aurelia-router");
let Platforms = class Platforms {
    constructor(element, appState, animator, bus, router, routerConfig) {
        this.bus = bus;
        this.router = router;
        this.routerConfig = routerConfig;
        this.heading = 'Platforms 2';
        this.categoryOptions = {
            style: 'btn-info',
            size: 4
        };
        this.appState = appState;
    }
    selectedCategoryChanged(n, o) {
        this.selectedTechnology = "all";
        this.availableTechnologies = _.filter(this.appState.project.technologies, ((t) => { return t.Category === n; }));
        this.updatePlatforms();
        //appState.sheets.sheets.Technologies | filterOnProperty:'Category': selectedCategory
    }
    selectedTechnologyChanged(n, o) {
        if (n) {
            console.log('changed');
            this.updatePlatforms();
        }
    }
    more(tech) {
        this.bus.publish('technologysheet', 'show', tech);
    }
    editPlatform(platform) {
        this.activePlatform = platform;
    }
    updatePlatform() {
        this.appState.services['examples'].update(this.activePlatform.Name, this.activePlatform).catch(e => {
            console.log(e);
        }).then(v => {
            console.log(v);
        });
        // this.appState.feathersClient.service('examples').update(this.activePlatform.Name, this.activePlatform);
        // alert('updating');
    }
    addTechnology() {
        let tech = this.appState.project.technologies.find(k => k.Technology === this.selectedTech);
        if (tech && this.activePlatform)
            this.appState.addPlatformToTechnology(tech, this.activePlatform);
    }
    removePlatform(e) {
        e.Removed = true;
    }
    cancelUpdate() {
        // this.appState.project.technologies
        // alert('cancel update');
    }
    removeTechnology(t) {
        this.appState.removePlatformFromTechnology(t, this.activePlatform);
    }
    updatePlatforms() {
        if (!this.selectedCategory)
            this.selectedCategory = "all";
        if (!this.selectedTechnology)
            this.selectedTechnology = "all";
        console.log('update platforms');
        history.pushState({}, "new title", "#/platforms/" + encodeURIComponent(this.selectedCategory) + "/" + encodeURIComponent(this.selectedTechnology));
        var temp = [];
        this.appState.project.examples.forEach((p) => {
            var score = 0;
            if (p.Name !== "" && p._Technologies && !p.Removed) {
                p._Technologies.forEach(t => {
                    if (this.selectedCategory === "all") {
                        score = 1;
                    }
                    else if (this.selectedTechnology !== "all") {
                        if (t && t.Technology === this.selectedTechnology) {
                            score += 1;
                        }
                    }
                    else {
                        if (t && t._Category && t._Category.Category === this.selectedCategory) {
                            score += 1;
                        }
                    }
                });
            }
            if (score > 0)
                temp.push(p);
        });
        this.availablePlatforms = _.orderBy(temp, 'Featured', 'desc');
    }
    created() {
        console.log('created');
        this.appState.loadSheets().then(() => {
            this.updatePlatforms();
            //this.appState.sheets.sheets.Technologies[0].Technology
        });
    }
    activate(parms, routeConfig) {
        this.selectedCategory = parms['category'];
        this.selectedTechnology = parms['technology'];
    }
};
__decorate([
    aurelia_framework_1.bindable
], Platforms.prototype, "selectedCategory", void 0);
__decorate([
    aurelia_framework_1.bindable
], Platforms.prototype, "selectedTechnology", void 0);
Platforms = __decorate([
    aurelia_framework_2.inject(Element, ApplicationState_1.ApplicationState, aurelia_animator_css_1.CssAnimator, MessageBus_1.MessageBusService, aurelia_router_1.RouterConfiguration, aurelia_router_1.Router)
], Platforms);
exports.Platforms = Platforms;
//# sourceMappingURL=platforms.js.map