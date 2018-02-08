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
import { inject, bindable } from 'aurelia-framework';
import { Example } from './../classes';
import $ from 'jquery';
import { ApplicationState } from '../ApplicationState';
var AddPlatform = (function () {
    function AddPlatform(appState, bus, router) {
        var _this = this;
        this.appState = appState;
        this.bus = bus;
        this.router = router;
        alert('init');
        this.bus.subscribe("addplatform", function (title, t) {
            switch (title) {
                case "show":
                    _this.show = true;
                    break;
                case "hide":
                    _this.show = false;
                    break;
            }
        });
    }
    AddPlatform.prototype.savePlatform = function () {
        if (this.activePlatform._isNew) {
            this.activePlatform._isNew = false;
            this.appState.addPlatform(this.activePlatform);
        }
        else {
            this.updatePlatform();
            $('#editplatform').modal('hide');
        }
    };
    AddPlatform.prototype.addPlatform = function () {
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
    AddPlatform.prototype.updatePlatform = function () {
        this.appState.updatePlatform(this.activePlatform);
        // this.appState.feathersClient.service('examples').update(this.activePlatform.Name, this.activePlatform);
        // alert('updating');
    };
    AddPlatform.prototype.addTechnology = function () {
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
    AddPlatform.prototype.removePlatform = function () {
        this.activePlatform.Removed = true;
        this.appState.updatePlatform(this.activePlatform);
    };
    AddPlatform.prototype.cancelUpdate = function () {
        // this.appState.project.technologies
        // alert('cancel update');
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
        inject(ApplicationState, MessageBusService, Router),
        __metadata("design:paramtypes", [ApplicationState, MessageBusService, Router])
    ], AddPlatform);
    return AddPlatform;
}());
export { AddPlatform };
//# sourceMappingURL=addplatform.js.map