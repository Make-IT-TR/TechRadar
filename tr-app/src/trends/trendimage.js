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
var Trends = (function () {
    function Trends(appState) {
        this.heading = 'Trend ';
        this.appState = appState;
    }
    Trends.prototype.activate = function (parms, routeConfig) {
        var _this = this;
        this.params = parms;
        this.appState.loadSheets().then(function () {
            _this.trend = _this.appState.project.trends.find(function (t) { return t.id == _this.params["trend"]; });
            $('.page-host').css('margin-top', 0);
            $('#techradar-' + _this.trend.id).css('margin-left', '-25px');
        });
    };
    Trends = __decorate([
        inject(ApplicationState),
        __metadata("design:paramtypes", [Object])
    ], Trends);
    return Trends;
}());
export { Trends };
//# sourceMappingURL=trendimage.js.map