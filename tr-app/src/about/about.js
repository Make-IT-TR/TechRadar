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
import * as $ from 'jquery';
var Home = (function () {
    function Home(element, appState, animator, bus) {
        this.bus = bus;
        this.showResult = false;
        this.appState = appState;
        this.appState.loadSheets().then(function () {
            //this.appState.sheets.sheets.Technologies[0].Technology
        });
    }
    Home.prototype.searchInputChanged = function (n, o) {
        if (n.length > 0) {
            $('#search-form').addClass('search-top');
            this.showResult = true;
        }
        else {
            $('#search-form').removeClass('search-top');
            this.showResult = false;
        }
    };
    Home.prototype.attached = function () {
    };
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], Home.prototype, "searchInput", void 0);
    Home = __decorate([
        inject(Element, ApplicationState, CssAnimator, MessageBusService),
        __metadata("design:paramtypes", [Object, Object, Object, MessageBusService])
    ], Home);
    return Home;
}());
export { Home };
//# sourceMappingURL=about.js.map