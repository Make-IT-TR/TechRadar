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
import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
var Technologysheet = (function () {
    function Technologysheet(appState, bus, router) {
        var _this = this;
        this.appState = appState;
        this.bus = bus;
        this.router = router;
        this.show = false;
        this.bus.subscribe("technologysheet", function (title, t) {
            switch (title) {
                case "show":
                    if (_this.tech != t || !_this.show) {
                        _this.updateTech(t);
                        _this.show = true;
                    }
                    else {
                        _this.show = false;
                    }
                    break;
                case "hide":
                    _this.show = false;
                    break;
            }
        });
    }
    Technologysheet.prototype.updateTech = function (t) {
        var _this = this;
        console.log('Get examples');
        this.examples = [];
        this.tech = t;
        this.wiki = t.WikiResult;
        this.examples = this.appState.getTechExamples(t);
        var input = this.appState.project.radarinput.find(function (ri) { return ri._Technology === _this.tech; });
        if (input) {
            this.scores = input.Scores;
        }
        var s = this.appState.project.dimensions;
    };
    Technologysheet.prototype.closeSheet = function (e) {
        // console.log(e);
        this.show = false;
    };
    Technologysheet.prototype.selectPlatform = function (e, example) {
        e.cancelBubble = true;
        this.show = false;
        // this.appState.selectPlatform(example);
        this.appState.searchFilter = example.Name;
        this.router.navigateToRoute('Platforms', { category: 'all', technology: 'all', search: example.Name });
        this.bus.publish('platformsearch', example.Name, null);
    };
    Technologysheet.prototype.selectCategory = function () {
        console.log('select category');
        //window.location.href = '#/platforms/' + this.tech.Category + '/all';  
        this.router.navigateToRoute('Platforms', { category: this.tech.Category });
    };
    Technologysheet.prototype.selectTrend = function (e, trend) {
        // e.cancelBubble = true;
        // this.show = false;
        // window.location.href = '#/trends/' + trend.id + '/detail';  
        this.router.navigateToRoute('trendsDetail', { trend: trend.id });
        // history.pushState({}, "new title", "#/trends/" + trend.id + "/detail");
    };
    Technologysheet.prototype.editTech = function (tech) {
        this.router.navigateToRoute('techEdit', { technology: tech.id });
    };
    Technologysheet = __decorate([
        inject(ApplicationState, MessageBusService, Router),
        __metadata("design:paramtypes", [ApplicationState, MessageBusService, Router])
    ], Technologysheet);
    return Technologysheet;
}());
export { Technologysheet };
//# sourceMappingURL=technologysheet.js.map