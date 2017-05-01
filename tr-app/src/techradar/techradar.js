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
var classes = require('./classes.ts');
import { ApplicationState } from './ApplicationState';
var Techradar = (function () {
    function Techradar(appState) {
        this.appState = appState;
    }
    Techradar.prototype.activate = function (parms, routeConfig) {
        var _this = this;
        this.appState.loadSheets().then(function () {
            console.log(_this.appState.sheets);
        });
    };
    return Techradar;
}());
Techradar = __decorate([
    inject(ApplicationState),
    __metadata("design:paramtypes", [Object])
], Techradar);
export { Techradar };
