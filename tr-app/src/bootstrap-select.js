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
import { MessageBusService } from './MessageBus';
import $ from 'jquery';
var BootstrapSelectCustomAttribute = (function () {
    function BootstrapSelectCustomAttribute(element, bus) {
        this.bus = bus;
        this.element = element;
    }
    BootstrapSelectCustomAttribute.prototype.attached = function () {
        var _this = this;
        this.updateSize();
        this.bus.subscribe('platformselect', function (d, e) {
            _this.updateSize();
        });
        $(this.element).change(function () {
            _this.updateSize();
        });
    };
    BootstrapSelectCustomAttribute.prototype.updateSize = function () {
        var text = $(this.element).find('option:selected').text();
        var $test = $("<span class='platform-select'>").html(text);
        $test.appendTo('body');
        var width = $test.width() + 30;
        $test.remove();
        $(this.element).width(width);
        $(this.element).blur();
    };
    BootstrapSelectCustomAttribute = __decorate([
        inject(Element, MessageBusService),
        __metadata("design:paramtypes", [Object, MessageBusService])
    ], BootstrapSelectCustomAttribute);
    return BootstrapSelectCustomAttribute;
}());
export { BootstrapSelectCustomAttribute };
//# sourceMappingURL=bootstrap-select.js.map