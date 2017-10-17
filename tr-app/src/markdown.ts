import { TemplatingEngine, inject, DOM } from 'aurelia-framework';
import {} from 'aurelia-framework';
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
@inject(TemplatingEngine, DOM.Element)
export class MarkdownCustomAttribute {
  public constructor(private templatingEngine: TemplatingEngine, private element: Element) {
    this.templatingEngine = templatingEngine;
    this.element = <HTMLElement> element;
    console.log('Markdown');
  }
 
  public valueChanged(html: string) { 
    this.element.innerHTML = '';
    if (!html) { return ''; }
    this.enhance(html);
  }
 
  private enhance(html: string) {
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
  }
 
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
  private enhanceChildren(element: Element) {
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children.item(i);
      this.templatingEngine.enhance({ element: child });
    }
  }
 
  // private parseMath(str: string) {
  //   // var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}");
 
  //   const inlineRegex = /\$\$(.*)\$\$/gmi; // Math between $$ and $$
 
  //   str = str.replace(inlineRegex, (s, r) => {
  //     return katex.renderToString(r, { displayMode: false });
  //   });
 
  //   const multilineRegex = /\\\\\[(?!(\\\\\]))([\s\S]*?)\\\\\]/gmi;   // Math between \\[ and \\]
 
  //   str = str.replace(multilineRegex, (s, ignore, r) => {
  //     return katex.renderToString(r, { displayMode: true });
  //   });
  //   return str;
  // }
}
