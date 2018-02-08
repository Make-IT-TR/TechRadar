var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { ApplicationState } from '../ApplicationState';
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus';
import { Router, RouterConfiguration } from 'aurelia-router';
var AddPlatform = (function () {
    function AddPlatform(element, appState, animator, bus, router, routerConfig) {
        this.bus = bus;
        this.router = router;
        this.routerConfig = routerConfig;
        this.heading = 'Platforms 2';
        this.categoryOptions = {
            style: 'btn-info',
            size: 4
        };
        this.appState = appState;
        this.appState.loadSheets().then(function () {
            // this.appState.sheets.sheets.Technologies[0].Technology
            //this.appState.sheets.sheets.Technologies[0].Technology
        });
    }
    AddPlatform.prototype.submit = function () {
        window.location.href = "#/platforms/all/all";
    };
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], AddPlatform.prototype, "selectedCategory", void 0);
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], AddPlatform.prototype, "selectedTechnology", void 0);
    AddPlatform = __decorate([
        inject(Element, ApplicationState, CssAnimator, MessageBusService, RouterConfiguration, Router),
        __metadata("design:paramtypes", [Object, Object, Object, MessageBusService, Router, RouterConfiguration])
    ], AddPlatform);
    return AddPlatform;
}());
export { AddPlatform };
//# sourceMappingURL=add.js.map