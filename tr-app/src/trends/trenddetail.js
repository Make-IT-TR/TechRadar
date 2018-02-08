var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import $ from 'jquery';
import { MessageBusService } from './../MessageBus';
import { Router } from 'aurelia-router';
var Trends = (function () {
    function Trends(appState, bus, router) {
        this.appState = appState;
        this.bus = bus;
        this.router = router;
        this.heading = 'Trend ';
    }
    Trends.prototype.selectTechnology = function (tech) {
        this.bus.publish('technologysheet', 'show', tech);
    };
    Trends.prototype.checkKey = function (e) {
        console.log('check key');
    };
    Trends.prototype.getNextTrend = function () {
        var ni = this.appState.project.trends.indexOf(this.trend) + 1;
        if (ni === this.appState.project.trends.length)
            ni = 0;
        return this.appState.project.trends[ni];
    };
    Trends.prototype.getPrevTrend = function () {
        var ni = this.appState.project.trends.indexOf(this.trend) - 1;
        if (ni === -1)
            ni = this.appState.project.trends.length - 1;
        return this.appState.project.trends[ni];
    };
    Trends.prototype.prevTrend = function () {
        this.trend = this.getPrevTrend();
        history.pushState({}, "new title", "#/trends/" + this.trend.id + "/detail");
    };
    Trends.prototype.nextTrend = function () {
        this.trend = this.getNextTrend();
        history.pushState({}, "new title", "#/trends/" + this.trend.id + "/detail");
    };
    Trends.prototype.selectPlatform = function (platform) {
        // this.router.navigateToRoute('Platforms', { category: e.Category, technology: encodeURIComponent(e.Technology)});   
        this.appState.searchFilter = platform.Name;
        this.router.navigateToRoute('Platforms', { category: 'all', technology: 'all', search: encodeURIComponent(platform.Name) });
    };
    Trends.prototype.activate = function (parms, routeConfig) {
        this.params = parms;
        console.log(this.params);
        this.update();
    };
    Trends.prototype.addTechnology = function () {
        var _this = this;
        var tech = this.appState.project.technologies.find(function (t) { return t.Technology === _this.selectedTech; });
        if (tech) {
            this.appState.addTechnologyToTrend(this.appState.activeTrend, tech);
            this.update();
            this.bus.publish('reload', 'update');
        }
    };
    Trends.prototype.editTechnology = function (t) {
        this.router.navigateToRoute('techEdit', { technology: t.id });
    };
    Trends.prototype.removeTrendTechnology = function (t) {
        this.appState.removeTrendTechnology(this.appState.activeTrend, t);
        this.update();
        this.bus.publish('reload', 'update');
    };
    Trends.prototype.update = function () {
        var _this = this;
        if (!this.appState.project || !this.appState.project.trends)
            return;
        this.trend = this.appState.project.trends.find(function (t) { return t.id == _this.params["trend"]; });
        //this.trend._TrendTechnologies[0]._Technology.Technology
        if (!this.trend.Description || this.trend.Description === "")
            this.trend.Description = " ";
        // console.log(this.trend.Description);
        this.appState.activeConfig.ShowTrend = true;
        // this.radarmodel.selectTrend(this.trend);
        this.mobileImage = "img/radar/trend-" + this.trend.id + ".png";
        this.platforms = this.appState.getTrendExamples(this.trend);
    };
    Trends.prototype.updateFilter = function () {
        console.log('publish');
        this.bus.publish("reload", "all");
    };
    Trends.prototype.toggleReverse = function (v) {
        console.log('toggle reverse');
        v.Reverse = !v.Reverse;
        this.updateFilter();
    };
    Trends.prototype.attached = function () {
        var _this = this;
        this.mobile = $(document).width() < 800;
        // console.log(this.params);
        this.appState.loadSheets().then(function () {
            _this.update();
            _this.bus.subscribe('refresh', function (a, d) {
                if (a === 'trend') {
                    _this.update();
                }
            });
            //this.bus.publish("reload", "all");
        });
        document.onkeydown = (function (e) {
            //e = e || window.event;
            if (e.keyCode === 37) {
                // left arrow
                _this.prevTrend();
            }
            else if (e.keyCode === 39) {
                _this.nextTrend();
                // right arrow
            }
        });
    };
    Trends = __decorate([
        inject(ApplicationState, MessageBusService, Router),
        __metadata("design:paramtypes", [ApplicationState, MessageBusService, Router])
    ], Trends);
    return Trends;
}());
export { Trends };
//# sourceMappingURL=trenddetail.js.map