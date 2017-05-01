import { PLATFORM } from 'aurelia-pal';
var App = (function () {
    function App() {
    }
    App.prototype.configureRouter = function (config, router) {
        config.title = 'TechRadar';
        config.map([
            { route: ['', 'techradar'], name: 'techradar', moduleId: PLATFORM.moduleName('./techradar'), nav: true, title: 'Radar' },
            { route: 'trends', name: 'trends', moduleId: PLATFORM.moduleName('./trends/trends'), nav: true, title: 'Trends' },
            { route: 'trends/:trend/detail', name: 'trendsDetail', moduleId: PLATFORM.moduleName('./trends/detail'), nav: false },
            { route: 'platforms', name: 'Platforms', moduleId: PLATFORM.moduleName('./platforms/platforms'), nav: true, title: 'Platforms' }
        ]);
        this.router = router;
    };
    return App;
}());
export { App };
