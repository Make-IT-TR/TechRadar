import { bindable, inject } from 'aurelia-framework';
import { MessageBusService } from './MessageBus';
import $ from 'jquery';


@inject(Element, MessageBusService)
export class BootstrapSelectCustomAttribute {
  public element;
  constructor(element, public bus: MessageBusService) {
    this.element = element;
  }

  attached() {
    this.updateSize();
    this.bus.subscribe('platformselect',(d,e)=>{
      this.updateSize();
    });
    $(this.element).change(() => {
      this.updateSize();
    });
  }

  updateSize() {
    var text = $(this.element).find('option:selected').text();
    var $test = $("<span class='platform-select'>").html(text);
    $test.appendTo('body');
    var width = $test.width() + 30;
    $test.remove();

    $(this.element).width(width);
    $(this.element).blur();
  }

}



