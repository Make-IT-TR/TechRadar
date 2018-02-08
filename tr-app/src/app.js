var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApplicationState } from './ApplicationState';
import { Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import 'bootstrap';
import 'cookieconsent';
import { inject } from 'aurelia-framework';
var App = (function () {
    function App(router, appState) {
        // show intro at main screen
        this.showIntro = false;
        this.router = router;
        this.appState = appState;
    }
    App.prototype.activate = function () {
        // console.log(this.router);
    };
    App.prototype.login = function () {
        this.appState.showLogin = true;
        // 
    };
    App.prototype.logout = function () {
        this.appState.logout();
        location.reload();
    };
    App.isLoggedIn = function () {
        var auth_token = localStorage.getItem("auth_token");
        return (typeof auth_token !== "undefined" && auth_token !== null);
    };
    App.prototype.configureRouter = function (config, router) {
        config.title = 'TechRadar';
        config.addAuthorizeStep(AuthorizeStep);
        config.map([
            { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('./home/home'), nav: true, title: 'Home' },
            { route: ['trends'], name: 'trends', moduleId: PLATFORM.moduleName('./trends/trends'), nav: true, title: 'Trends' },
            { route: 'trends/:trend/detail', name: 'trendsDetail', moduleId: PLATFORM.moduleName('./trends/trenddetail'), title: 'Trend', nav: false },
            { route: 'technology/:technology/edit', name: 'techEdit', moduleId: PLATFORM.moduleName('./technology/techedit'), auth: true, title: 'Technology', nav: false },
            { route: 'platforms/:category/:technology', href: 'platforms/all/all', name: 'Platforms', moduleId: PLATFORM.moduleName('./platforms/platforms'), nav: true, title: 'Platforms' },
            { route: ['platforms'], name: 'platforms-page', moduleId: PLATFORM.moduleName('./platforms/platforms'), nav: false, title: 'Platforms' },
            { route: ['techradar'], name: 'techradar', moduleId: PLATFORM.moduleName('./techradar/techradar'), nav: true, title: 'Radar' },
            { route: ['about'], name: 'about', moduleId: PLATFORM.moduleName('./about/about'), nav: true, title: 'About' },
            { route: 'trends/:trend/image', name: 'trendsImage', moduleId: PLATFORM.moduleName('./trends/trendimage'), title: 'RadarImage', nav: false },
            { route: 'platforms/add', name: 'addPlatform', moduleId: PLATFORM.moduleName('./platforms/add'), nav: false },
            {
                route: 'auth/github/callback',
                name: 'callback',
                moduleId: PLATFORM.moduleName('./callback'),
                nav: false,
                title: 'Callback'
            }
        ]);
        this.router = router;
        window.cookieconsent.initialise({
            container: document.getElementById("content"),
            palette: {
                popup: { background: "#fff" },
                button: { background: "#aa0000" },
            },
            revokable: true,
            onStatusChange: function (status) {
                console.log(this.hasConsented() ?
                    'enable cookies' : 'disable cookies');
            },
            law: {
                regionalLaw: false,
            },
            location: true,
        });
    };
    App = __decorate([
        inject(Router, ApplicationState),
        __metadata("design:paramtypes", [Object, Object])
    ], App);
    return App;
}());
export { App };
var AuthorizeStep = (function () {
    function AuthorizeStep(appState) {
        this.appState = appState;
    }
    AuthorizeStep.prototype.run = function (routingContext, next) {
        if (routingContext.config.auth) {
            var isLoggedIn = this.appState.authenticated;
            if (!isLoggedIn) {
                alert("Not Logged In!\nClick the Sign In icon to log in");
                return next.cancel();
            }
        }
        return next();
    };
    AuthorizeStep.isLoggedIn = function () {
        var auth_token = localStorage.getItem("auth_token");
        return (typeof auth_token !== "undefined" && auth_token !== null);
    };
    AuthorizeStep = __decorate([
        inject(ApplicationState),
        __metadata("design:paramtypes", [Object])
    ], AuthorizeStep);
    return AuthorizeStep;
}());
//# sourceMappingURL=app.js.map