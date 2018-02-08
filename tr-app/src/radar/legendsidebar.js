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
import { ApplicationState } from '../ApplicationState';
var Legendsidebar = (function () {
    function Legendsidebar(appState, bus) {
        this.appState = appState;
        this.bus = bus;
    }
    Legendsidebar.prototype.colorRenderer = function (color) {
        var colorValue = color;
        var cv = "#000";
        if (this.appState.colorsD.indexOf(colorValue) !== -1) {
            var index = this.appState.colorsD.indexOf(colorValue);
        }
        return "<span style='width:15px;height:15px;border-radius:8px;background:" + this.appState.colors[index] + ";float:left;margin-right:5px'></span>";
    };
    Legendsidebar.prototype.sizeRenderer = function (size) {
        var s = 5;
        var sizeIndex = this.appState.size.length - this.appState.size.indexOf(size);
        if (sizeIndex >= 0) {
            s = (15 / this.appState.size.length * sizeIndex) + 5;
        }
        return "<span style='width:" + s + "px;height:" + s + "px;border-radius:" + s / 2 + "px;background:black;float:left;margin-right:5px'></span>";
    };
    Legendsidebar = __decorate([
        inject(ApplicationState, MessageBusService),
        __metadata("design:paramtypes", [Object, Object])
    ], Legendsidebar);
    return Legendsidebar;
}());
export { Legendsidebar };
//# sourceMappingURL=legendsidebar.js.map