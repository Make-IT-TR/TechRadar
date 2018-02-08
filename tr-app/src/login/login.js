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
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus';
var Login = (function () {
    function Login(element, appState, animator, bus) {
        this.bus = bus;
        this.appState = appState;
    }
    Login.prototype.login = function (strategy) {
        // alert('login');
        location.replace('auth/' + strategy);
    };
    Login = __decorate([
        inject(Element, ApplicationState, CssAnimator, MessageBusService),
        __metadata("design:paramtypes", [Object, Object, Object, MessageBusService])
    ], Login);
    return Login;
}());
export { Login };
//# sourceMappingURL=login.js.map