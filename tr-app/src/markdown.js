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
import * as md from 'marked';
// import * as katex from 'katex';
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
var MarkdownCustomAttribute = (function () {
    function MarkdownCustomAttribute(templatingEngine, element) {
        this.templatingEngine = templatingEngine;
        this.element = element;
        this.templatingEngine = templatingEngine;
        this.element = element;
        console.log('Markdown');
    }
    MarkdownCustomAttribute.prototype.valueChanged = function (html) {
        this.element.innerHTML = '';
        if (!html) {
            return '';
        }
        this.enhance(html);
    };
    MarkdownCustomAttribute.prototype.enhance = function (html) {
        console.log('enhance');
        html = md(html, {
            renderer: new md.Renderer(),
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });
        this.element.innerHTML = html;
        this.enhanceChildren(this.element);
    };
    /**
     * Use the templating engine to apply Aurelia to custom elements.
     *
     * See:
     * - https://ilikekillnerds.com/2016/01/enhancing-at-will-using-aurelias-templating-engine-enhance-api/
     * - http://stackoverflow.com/questions/37325758/how-an-aurelia-binding-behavior-could-enhance-an-innerhtml-content
     *
     * Note that the custom element must be available as global resource (see main.ts).
     * See:
     * - http://drdwilcox.blogspot.nl/2015/12/aurelia-making-custom-element-global.html
     *
     * @private
     * @param {Element} element
     *
     * @memberOf MarkdownCustomAttribute
     */
    MarkdownCustomAttribute.prototype.enhanceChildren = function (element) {
        for (var i = 0; i < element.children.length; i++) {
            var child = element.children.item(i);
            this.templatingEngine.enhance({ element: child });
        }
    };
    MarkdownCustomAttribute = __decorate([
        inject(TemplatingEngine, DOM.Element),
        __metadata("design:paramtypes", [TemplatingEngine, Element])
    ], MarkdownCustomAttribute);
    return MarkdownCustomAttribute;
}());
export { MarkdownCustomAttribute };
//# sourceMappingURL=markdown.js.map