var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { customAttribute, bindable, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
var GoToRoute = (function () {
    function GoToRoute(element, router) {
        this.element = element;
        this.router = router;
        this.element = element;
        this.router = router;
    }
    GoToRoute.prototype.attached = function () {
        var _this = this;
        this.element.addEventListener("click", function () {
            _this.router.navigateToRoute(_this.route, _this.params);
        });
    };
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], GoToRoute.prototype, "route", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], GoToRoute.prototype, "params", void 0);
    GoToRoute = __decorate([
        inject(Element, Router),
        customAttribute('go-to-route'),
        __metadata("design:paramtypes", [Object, Object])
    ], GoToRoute);
    return GoToRoute;
}());
export { GoToRoute };
//# sourceMappingURL=GoToRoute.js.map