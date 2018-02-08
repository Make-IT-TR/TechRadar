var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bindingMode, observable } from 'aurelia-binding';
import { bindable } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';
var nextID = 0;
var Autocomplete = (function () {
    function Autocomplete(element) {
        this.element = element;
        this.placeholder = '';
        this.delay = 300;
        this.id = nextID++;
        this.expanded = false;
        this.inputValue = '';
        this.updatingInput = false;
        this.suggestions = [];
        this.index = -1;
        this.suggestionsUL = null;
        this.userInput = '';
        this.element = element;
    }
    Autocomplete.prototype.display = function (name) {
        this.updatingInput = true;
        this.inputValue = name;
        this.updatingInput = false;
    };
    Autocomplete.prototype.getName = function (suggestion) {
        if (suggestion == null) {
            return '';
        }
        return this.service.getName(suggestion);
    };
    Autocomplete.prototype.collapse = function () {
        this.expanded = false;
        this.index = -1;
    };
    Autocomplete.prototype.select = function (suggestion, notify) {
        if (!suggestion) {
            this.lastSelect = null;
            return;
        }
        if (suggestion === this.lastSelect)
            return;
        this.value = suggestion;
        var name = this.getName(this.value.name);
        this.userInput = name;
        this.display(name);
        this.collapse();
        if (notify) {
            var event_1 = DOM.createCustomEvent('change', { bubbles: true });
            event_1.value = suggestion;
            event_1.autocomplete = this;
            this.element.dispatchEvent(event_1);
        }
        if (suggestion && suggestion.select) {
            this.lastSelect = suggestion;
            suggestion.select(suggestion);
        }
    };
    Autocomplete.prototype.valueChanged = function () {
        this.select(this.value, false);
    };
    Autocomplete.prototype.inputValueChanged = function (value) {
        var _this = this;
        if (this.updatingInput) {
            return;
        }
        this.userInput = value;
        if (value === '') {
            this.value = null;
            this.collapse();
            return;
        }
        this.service.suggest(value)
            .then(function (suggestions) {
            _this.index = -1;
            (_a = _this.suggestions).splice.apply(_a, [0, _this.suggestions.length].concat(suggestions));
            // if (suggestions.length === 1 && suggestions[0] !== this.value) {
            //   this.select(suggestions[0], true);
            // } else 
            if (suggestions.length === 0) {
                _this.collapse();
            }
            else {
                _this.expanded = true;
            }
            var _a;
        });
    };
    Autocomplete.prototype.scroll = function () {
        var ul = this.suggestionsUL;
        var li = ul.children.item(this.index === -1 ? 0 : this.index);
        if (li.offsetTop + li.offsetHeight > ul.offsetHeight) {
            ul.scrollTop += li.offsetHeight;
        }
        else if (li.offsetTop < ul.scrollTop) {
            ul.scrollTop = li.offsetTop;
        }
    };
    // keydown(key) {
    //   if (!this.expanded) {
    //     return true;
    //   }
    //   // down
    //   if (key === 40) {
    //     debugger;
    //     if (this.index < this.suggestions.length - 1) {
    //       this.index++;
    //       this.display(this.getName(this.suggestions[this.index]));
    //     } else {
    //       this.index = -1;
    //       this.display(this.userInput);
    //     }
    //     this.scroll();
    //     return;
    //   }
    //   // up
    //   if (key === 38) {
    //     if (this.index === -1) {
    //       this.index = this.suggestions.length - 1;
    //       this.display(this.getName(this.suggestions[this.index]));
    //     } else if (this.index > 0) {
    //       this.index--;
    //       this.display(this.getName(this.suggestions[this.index]));
    //     } else {
    //       this.index = -1;
    //       this.display(this.userInput);
    //     }
    //     this.scroll();
    //     return;
    //   }
    //   // escape
    //   if (key === 27) {
    //     this.display(this.userInput);
    //     this.collapse();
    //     return;
    //   }
    //   // enter
    //   if (key === 13) {
    //     if (this.index >= 0) {
    //       this.select(this.suggestions[this.index], true);
    //     }
    //     return;
    //   }
    //   return true;
    // }
    Autocomplete.prototype.blur = function () {
        this.select(this.value, false);
        this.element.dispatchEvent(DOM.createCustomEvent('blur', null));
    };
    Autocomplete.prototype.suggestionClicked = function (suggestion) {
        this.select(suggestion, true);
    };
    Autocomplete.prototype.focus = function () {
        this.element.firstElementChild.focus();
    };
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], Autocomplete.prototype, "service", void 0);
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], Autocomplete.prototype, "value", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], Autocomplete.prototype, "placeholder", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], Autocomplete.prototype, "delay", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], Autocomplete.prototype, "inputValue", void 0);
    Autocomplete = __decorate([
        inject(Element),
        __metadata("design:paramtypes", [Object])
    ], Autocomplete);
    return Autocomplete;
}());
export { Autocomplete };
// aria-activedescendant
// https://webaccessibility.withgoogle.com/unit?unit=6&lesson=13
// https://www.w3.org/TR/wai-aria/states_and_properties#aria-autocomplete
// https://www.w3.org/TR/wai-aria/roles#combobox
//# sourceMappingURL=autocomplete.js.map