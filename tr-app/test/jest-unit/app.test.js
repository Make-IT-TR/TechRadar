import { App } from '../../src/app';
var RouterStub = (function () {
    function RouterStub() {
    }
    RouterStub.prototype.configure = function (handler) {
        handler(this);
    };
    RouterStub.prototype.map = function (routes) {
        this.routes = routes;
    };
    return RouterStub;
}());
describe('the App module', function () {
    var sut;
    var mockedRouter;
    beforeEach(function () {
        mockedRouter = new RouterStub();
        sut = new App();
        sut.configureRouter(mockedRouter, mockedRouter);
    });
    it('contains a router property', function () {
        expect(sut.router).toBeDefined();
    });
    it('configures the router title', function () {
        expect(sut.router.title).toEqual('Aurelia');
    });
    // it('should have a welcome route', () => {
    //   expect(sut.router.routes).toContainEqual({ route: ['', 'welcome'], name: 'welcome', moduleId: './welcome', nav: true, title: 'Welcome' });
    // });
    // it('should have a users route', () => {
    //   expect(sut.router.routes).toContainEqual({ route: 'users', name: 'users', moduleId: './users', nav: true, title: 'Github Users' });
    // });
    // it('should have a child router route', () => {
    //   expect(sut.router.routes).toContainEqual({ route: 'child-router', name: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' });
    // });
});
