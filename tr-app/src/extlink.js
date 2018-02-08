var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { TemplatingEngine, inject, DOM } from 'aurelia-framework';
/**
* This markdown custom attribute can be applied to any HTML element. You bind it to a markdown string,
* which may contain custom HTML, Aurelia (global) custome elements, and LaTeX. The element's innerHTML
* will be replaced by the generated content.
*
* Example usage:
* <template>
*   <require from="../helpers/markdown"></require>
*   <div markdown.bind="content"></div>
* </template>
*
* @export
* @class MarkdownCustomAttribute
*/
var ExtlinkComponent = (function () {
    function ExtlinkComponent(templatingEngine, element) {
        this.templatingEngine = templatingEngine;
        this.element = element;
        this.templatingEngine = templatingEngine;
        this.element = element;
        console.log('external link');
    }
    ExtlinkComponent.prototype.valueChanged = function (html) {
        this.element.innerHTML = '';
        // if (!html) { return ''; }
        this.element.innerHTML = "<a href='nu.nl'></a>";
    };
    ExtlinkComponent = __decorate([
        inject(TemplatingEngine, DOM.Element),
        __metadata("design:paramtypes", [TemplatingEngine, Element])
    ], ExtlinkComponent);
    return ExtlinkComponent;
}());
export { ExtlinkComponent };
//# sourceMappingURL=extlink.js.map