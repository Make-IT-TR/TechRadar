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
import { ApplicationState } from '../ApplicationState';
import { CssAnimator } from 'aurelia-animator-css';
import { MessageBusService } from './../MessageBus';
var Admin = (function () {
    function Admin(element, appState, animator, bus) {
        this.bus = bus;
        this.showResult = false;
        this.appState = appState;
        this.trendOptions = {};
        this.trendOptions.rowData = this.createRowData();
        this.trendOptions.enableFilter = true;
        this.trendOptions.defaultColDef = {
            menuTabs: ['filterMenuTab']
        };
        this.appState.loadSheets().then(function () {
            //this.appState.sheets.sheets.Technologies[0].Technology
        });
    }
    Admin.prototype.createRowData = function () {
        return [
            { "row": "Row 1", "name": "Michael Phelps" },
            { "row": "Row 2", "name": "Natalie Coughlin" },
            { "row": "Row 3", "name": "Aleksey Nemov" },
            { "row": "Row 4", "name": "Alicia Coutts" },
            { "row": "Row 5", "name": "Missy Franklin" },
            { "row": "Row 6", "name": "Ryan Lochte" },
            { "row": "Row 7", "name": "Allison Schmitt" },
            { "row": "Row 8", "name": "Natalie Coughlin" },
            { "row": "Row 9", "name": "Ian Thorpe" },
            { "row": "Row 10", "name": "Bob Mill" },
            { "row": "Row 11", "name": "Willy Walsh" },
            { "row": "Row 12", "name": "Sarah McCoy" },
            { "row": "Row 13", "name": "Jane Jack" },
            { "row": "Row 14", "name": "Tina Wills" }
        ];
    };
    Admin.prototype.attached = function () {
    };
    Admin = __decorate([
        inject(Element, ApplicationState, CssAnimator, MessageBusService),
        __metadata("design:paramtypes", [Object, Object, Object, MessageBusService])
    ], Admin);
    return Admin;
}());
export { Admin };
//# sourceMappingURL=admin.js.map