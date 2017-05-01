import { bindable, inject } from 'aurelia-framework';
import $ from 'jquery';


@inject(Element)
export class BootstrapSelectCustomAttribute {
  public element;
  constructor(element) {
    this.element = element;
  }

  attached() {
    this.updateSize();
    $(this.element).change(() => {
      this.updateSize();
    });
  }

  updateSize() {
    var text = $(this.element).find('option:selected').text();
    var $test = $("<span class='nlf-select'>").html(text);
    $test.appendTo('body');
    var width = $test.width() + 30;
    $test.remove();

    $(this.element).width(width);
  }

}



