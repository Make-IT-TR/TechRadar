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
var TechEdit = (function () {
    function TechEdit(appState, bus, router) {
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
    TechEdit.prototype.activate = function (parms, routeConfig) {
        var _this = this;
        this.params = parms;
        this.bus.subscribe('refresh', function (a, d) {
            // if (a === 'technology') {
            _this.refresh();
            //}
        });
        this.appState.loadSheets().then(function () {
            if (_this.params.hasOwnProperty('technology')) {
                _this.refresh();
            }
        });
    };
    TechEdit.prototype.getScores = function (y, d) {
        var res = [];
        var s = this.scores.find(function (s) { return s.Year === y && s.Title === d; });
        if (!s) {
            s = { Year: y, Title: d, Value: '' };
        }
        res.push(s);
        return res;
    };
    TechEdit.prototype.refresh = function () {
        var _this = this;
        this.tech = this.appState.project.technologies.find(function (t) { return t.id == _this.params['technology']; });
        this.updateTech(this.tech);
        this.years = this.appState.project.years;
        // missing
    };
    TechEdit.prototype.scoreChanged = function (s) {
        var _this = this;
        var input = this.appState.project.radarinput.find(function (ri) { return ri._Technology === _this.tech; });
        var found = false;
        input.Scores.forEach(function (score) {
            if (score.Year === s.Year && score.Title === s.Title) {
                score.Value = s.Value;
                found = true;
            }
        });
        if (!found)
            input.Scores.push(s);
        this.appState.updateRadarInput(input);
    };
    TechEdit.prototype.removePlatform = function (e) {
        this.appState.removePlatformFromTechnology(this.tech, e);
    };
    TechEdit.prototype.addTrend = function () {
        var _this = this;
        var tr = this.appState.project.trends.find(function (t) { return t.id === _this.selectedTrend; });
        if (tr)
            this.appState.addTechnologyToTrend(tr, this.tech);
    };
    TechEdit.prototype.addExample = function () {
        var _this = this;
        var ex = this.appState.project.examples.find(function (t) { return t.id === _this.selectedExample; });
        if (ex)
            this.appState.addPlatformToTechnology(this.tech, ex);
    };
    TechEdit.prototype.removeTrendTechnology = function (trend) {
        this.appState.removeTrendTechnology(trend, this.tech);
    };
    TechEdit.prototype.update = function () {
        this.appState.updateTechnology(this.tech);
    };
    TechEdit.prototype.updateTech = function (t) {
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
    TechEdit.prototype.closeSheet = function (e) {
        this.show = false;
    };
    TechEdit.prototype.selectPlatform = function (e, example) {
        e.cancelBubble = true;
        this.show = false;
        this.appState.selectPlatform(example);
    };
    TechEdit.prototype.selectCategory = function () {
        console.log('select category');
        window.location.href = '#/platforms/' + this.tech.Category + '/all';
    };
    TechEdit.prototype.selectTrend = function (e, trend) {
        e.cancelBubble = true;
        this.show = false;
        window.location.href = '#/trends/' + trend.id + '/detail';
    };
    TechEdit = __decorate([
        inject(ApplicationState, MessageBusService, Router),
        __metadata("design:paramtypes", [ApplicationState, MessageBusService, Router])
    ], TechEdit);
    return TechEdit;
}());
export { TechEdit };
//# sourceMappingURL=techedit.js.map