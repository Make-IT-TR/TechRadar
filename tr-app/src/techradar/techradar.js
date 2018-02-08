var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MessageBusService } from './../MessageBus';
import { inject } from 'aurelia-framework';
import $ from 'jquery';
import { ApplicationState } from '../ApplicationState';
var d3 = require('d3');
var Techradar = (function () {
    function Techradar(appState, bus) {
        this.editMode = true;
        this.appState = appState;
        this.bus = bus;
    }
    Techradar.prototype.showAll = function () {
        this.bus.publish("filter", "all");
    };
    Techradar.prototype.showTrends = function () {
        this.bus.publish("filter", "trend", this.appState.project.trends[0]);
    };
    Techradar.prototype.updatePreset = function () {
        this.appState.activeConfig = this.activePreset;
        this.updateFilter();
    };
    Techradar.prototype.updateFilter = function () {
        console.log('publish');
        this.bus.publish("reload", "all");
    };
    Techradar.prototype.toggleReverse = function (v) {
        console.log('toggle reverse');
        v.Reverse = !v.Reverse;
        this.updateFilter();
    };
    Techradar.prototype.addNewFilter = function (value) {
        this.appState.activeConfig.Filters.forEach(function (f) {
            if (f.Dimension === value)
                f.Enabled = true;
        });
        this.updateFilter();
    };
    Techradar.prototype.selectTrend = function (t) {
        this.bus.publish("filter", "trend", t);
    };
    Techradar.prototype.disableFilter = function (f) {
        f.Enabled = false;
        this.updateFilter();
    };
    Techradar.prototype.activate = function (parms, routeConfig) {
        var _this = this;
        this.mobile = $(document).width() < 800;
        this.appState.loadSheets().then(function () {
            setTimeout(function () { return _this.bus.publish("reload", "all"); }, 300);
            // this.appState.activeConfig.Filters.forEach(f=>f.Enabled = false);
            // this.updateFilter();
        });
    };
    Techradar = __decorate([
        inject(ApplicationState, MessageBusService),
        __metadata("design:paramtypes", [Object, Object])
    ], Techradar);
    return Techradar;
}());
export { Techradar };
//# sourceMappingURL=techradar.js.map