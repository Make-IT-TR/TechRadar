var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Example } from './../classes';
import { bindable, NewInstance } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import * as _ from "lodash";
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus';
import { Router, RouterConfiguration } from 'aurelia-router';
import $ from 'jquery';
import { ValidationRules, ValidationController } from 'aurelia-validation';
var Platforms = (function () {
    function Platforms(element, appState, animator, bus, router, routerConfig, controller) {
        this.bus = bus;
        this.router = router;
        this.routerConfig = routerConfig;
        this.controller = controller;
        this.heading = 'Platforms 2';
        this.categoryOptions = {
            style: 'btn-info',
            size: 4
        };
        this.appState = appState;
        this.activePlatform = new Example("");
        if (this.appState.searchFilter && this.appState.searchFilter.length > 0) {
            this.searchText = this.appState.searchFilter;
            this.appState.searchFilter = "";
            this.searchFocus();
        }
        ValidationRules
            .ensure(function (m) { return m.Name; }).displayName("Name").required()
            .ensure(function (m) { return m.Url; }).displayName("Url").required()
            .on(this.activePlatform);
    }
    Platforms.prototype.searchTextChanged = function (n, o) {
        this.updatePlatforms();
        // $('#platformSearch').css('width', n.length>0 ? '300px' : '50px');
    };
    Platforms.prototype.searchFocus = function () {
        $('#platformSearch').css('width', '300px');
    };
    Platforms.prototype.searchBlur = function () {
        if (this.searchText && this.searchText.length === 0)
            $('#platformSearch').css('width', '50px');
    };
    Platforms.prototype.selectedCategoryChanged = function (n, o) {
        this.selectedTechnology = "all";
        this.availableTechnologies = _.filter(this.appState.project.technologies, (function (t) { return t.Category === n; }));
        this.updatePlatforms();
        //appState.sheets.sheets.Technologies | filterOnProperty:'Category': selectedCategory
    };
    Platforms.prototype.savePlatform = function () {
        if (this.activePlatform._isNew) {
            this.activePlatform._isNew = false;
            this.appState.addPlatform(this.activePlatform);
        }
        else {
            this.updatePlatform();
            $('#editplatform').modal('hide');
        }
    };
    Platforms.prototype.addPlatform = function () {
        if (!this.appState.adminMode) {
            this.appState.showLogin = true;
        }
        else {
            this.isNew = true;
            this.activePlatform = new Example("");
            this.activePlatform.id = this.appState.guid();
            this.activePlatform._isNew = true;
        }
    };
    Platforms.prototype.selectedTechnologyChanged = function (n, o) {
        if (n) {
            console.log('changed');
            this.updatePlatforms();
        }
    };
    Platforms.prototype.more = function (tech) {
        this.bus.publish('technologysheet', 'show', tech);
    };
    Platforms.prototype.editPlatform = function (platform) {
        this.activePlatform = platform;
    };
    Platforms.prototype.updatePlatform = function () {
        this.appState.updatePlatform(this.activePlatform);
        // this.appState.feathersClient.service('examples').update(this.activePlatform.Name, this.activePlatform);
        // alert('updating');
    };
    Platforms.prototype.addTechnology = function () {
        var _this = this;
        if (this.activePlatform._isNew) {
            var tech = this.appState.project.technologies.find(function (k) { return k.Technology === _this.selectedTech; });
            this.activePlatform._Technologies.push(tech);
        }
        else {
            var tech = this.appState.project.technologies.find(function (k) { return k.Technology === _this.selectedTech; });
            if (tech && this.activePlatform)
                this.appState.addPlatformToTechnology(tech, this.activePlatform);
        }
    };
    Platforms.prototype.removePlatform = function () {
        this.activePlatform.Removed = true;
        this.appState.updatePlatform(this.activePlatform);
    };
    Platforms.prototype.cancelUpdate = function () {
        // this.appState.project.technologies
        // alert('cancel update');
    };
    Platforms.prototype.removeTechnology = function (t) {
        if (this.activePlatform._isNew) {
            this.activePlatform._Technologies = this.activePlatform._Technologies.filter(function (te) { return t.id != te.id; });
        }
        else {
            this.appState.removePlatformFromTechnology(t, this.activePlatform);
        }
    };
    Platforms.prototype.match = function (p) {
        if (p.Name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0)
            return true;
        var i = 0;
        while (i < p._Technologies.length) {
            var t = p._Technologies[i];
            if (t.Technology.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) {
                return true;
            }
            i += 1;
        }
        return false;
    };
    Platforms.prototype.updatePlatforms = function () {
        var _this = this;
        if (!this.selectedCategory)
            this.selectedCategory = "all";
        if (!this.selectedTechnology)
            this.selectedTechnology = "all";
        console.log('update platforms');
        history.pushState({}, "new title", "#/platforms/" + encodeURIComponent(this.selectedCategory) + "/" + encodeURIComponent(this.selectedTechnology));
        var temp = [];
        this.appState.project.examples.forEach(function (p) {
            var score = 0;
            if (p.Name !== "" && p._Technologies && !p.Removed) {
                p._Technologies.forEach(function (t) {
                    if (_this.selectedCategory === "all") {
                        score = 1;
                    }
                    else if (_this.selectedTechnology !== "all") {
                        if (t && t.Technology === _this.selectedTechnology) {
                            score += 1;
                        }
                    }
                    else {
                        if (t && t._Category && t._Category.Category === _this.selectedCategory) {
                            score += 1;
                        }
                    }
                });
            }
            if (_this.searchText && _this.searchText.length > 0 && _this.match(p) === false)
                score = 0;
            if (score > 0)
                temp.push(p);
        });
        this.availablePlatforms = _.orderBy(temp, 'Featured', 'desc');
        this.bus.publish('platformselect', null, null);
    };
    Platforms.prototype.validateMe = function () {
        var _this = this;
        this.controller
            .validate()
            .then(function (v) {
            if (v.valid)
                _this.message = "All is good!";
            else
                _this.message = "You have errors!";
        });
    };
    Platforms.prototype.created = function () {
        var _this = this;
        console.log('created');
        this.appState.loadSheets().then(function () {
            _this.updatePlatforms();
            //this.appState.sheets.sheets.Technologies[0].Technology
        });
        this.appState.bus.subscribe('platformsearch', function (s, a) {
            _this.searchText = s;
        });
    };
    Platforms.prototype.activate = function (parms, routeConfig) {
        this.selectedCategory = parms['category'];
        this.selectedTechnology = parms['technology'];
        this.searchText = parms['search'];
    };
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], Platforms.prototype, "selectedCategory", void 0);
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], Platforms.prototype, "selectedTechnology", void 0);
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], Platforms.prototype, "searchText", void 0);
    Platforms = __decorate([
        inject(Element, ApplicationState, CssAnimator, MessageBusService, RouterConfiguration, Router, NewInstance.of(ValidationController)),
        __metadata("design:paramtypes", [Object, Object, Object, MessageBusService, Router, RouterConfiguration, ValidationController])
    ], Platforms);
    return Platforms;
}());
export { Platforms };
//# sourceMappingURL=platforms.js.map