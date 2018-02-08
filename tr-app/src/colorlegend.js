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
import { ApplicationState } from './ApplicationState';
import { TemplatingEngine, inject, DOM } from 'aurelia-framework';
import { d3 } from 'd3';
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
var colorlegend = (function () {
    function colorlegend(appState, templatingEngine, element) {
        this.appState = appState;
        this.templatingEngine = templatingEngine;
        this.element = element;
        this.templatingEngine = templatingEngine;
        this.element = element;
        console.log('Markdown');
    }
    colorlegend.prototype.valueChanged = function (html) {
        this.element.innerHTML = '';
        if (!html) {
            return '';
        }
        this.enhance(html);
    };
    colorlegend.prototype.enhance = function (html) {
        var c10 = d3.scale.category10();
        var colorValue = this.color;
        var cv = "#000";
        if (this.appState.data.colors.indexOf(colorValue) !== -1) {
            //cv = d3.scale.linear().domain([0,data.colors.indexOf(colorValue),10]).range(["white","#4169e1"])
            cv = c10(this.appState.data.colors.indexOf(colorValue).toString());
        }
        var c = "<span style='width:15;height:15;border-radius:8px;background:" + cv + ";float:left;margin-right:5px'></span>";
        this.element.innerHTML = c;
        this.element.innerHTML = html;
    };
    __decorate([
        bindable,
        __metadata("design:type", String)
    ], colorlegend.prototype, "color", void 0);
    colorlegend = __decorate([
        inject(ApplicationState, TemplatingEngine, DOM.Element),
        __metadata("design:paramtypes", [Object, TemplatingEngine, Element])
    ], colorlegend);
    return colorlegend;
}());
export { colorlegend };
//# sourceMappingURL=colorlegend.js.map