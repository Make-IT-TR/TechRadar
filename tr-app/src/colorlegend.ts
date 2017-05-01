import { bindable } from 'aurelia-framework';
import { ApplicationState } from './ApplicationState';
import { TemplatingEngine, inject, DOM } from 'aurelia-framework';
import { } from 'aurelia-framework';
import * as md from 'marked';
import * as katex from 'katex';
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
@inject(ApplicationState, TemplatingEngine, DOM.Element)
export class colorlegend {
  @bindable public color: string;
  public constructor(private appState, private templatingEngine: TemplatingEngine, private element: Element) {
    this.templatingEngine = templatingEngine;
    this.element = <HTMLElement>element;
    console.log('Markdown');
  }

  public valueChanged(html: string) {
    this.element.innerHTML = '';
    if (!html) { return ''; }
    this.enhance(html);
  }

  private enhance(html: string) {
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

  }

}
