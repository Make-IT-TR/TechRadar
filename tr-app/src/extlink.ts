import { TemplatingEngine, inject, DOM } from 'aurelia-framework';
import {} from 'aurelia-framework';
import * as md from 'marked';
import * as katex from 'katex';
 
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
@inject(TemplatingEngine, DOM.Element)
export class ExtlinkComponent {
  public constructor(private templatingEngine: TemplatingEngine, private element: Element) {
    this.templatingEngine = templatingEngine;
    this.element = <HTMLElement> element;
    console.log('external link');
  }
 
  public valueChanged(html: string) { 
    this.element.innerHTML = '';
    // if (!html) { return ''; }
    this.element.innerHTML = "<a href='nu.nl'></a>";
  }
 
}
