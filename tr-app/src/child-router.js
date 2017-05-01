import { PLATFORM } from 'aurelia-pal';
var ChildRouter = (function () {
    function ChildRouter() {
        this.heading = 'Child Router';
    }
    ChildRouter.prototype.configureRouter = function (config, router) {
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: PLATFORM.moduleName('./welcome'), nav: true, title: 'Welcome' },
            { route: 'child-router', name: 'child-router', moduleId: PLATFORM.moduleName('./child-router'), nav: true, title: 'Child Router' }
        ]);
        this.router = router;
    };
    return ChildRouter;
}());
export { ChildRouter };
