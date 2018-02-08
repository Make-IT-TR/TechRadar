var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { browser, element, by, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
var PageObject_Welcome = (function () {
    function PageObject_Welcome() {
    }
    PageObject_Welcome.prototype.getGreeting = function () {
        return element(by.tagName('h2')).getText();
    };
    PageObject_Welcome.prototype.setFirstname = function (value) {
        var firstName = element(by.valueBind('firstName'));
        return firstName.clear().then(function () { return firstName.sendKeys(value); });
    };
    PageObject_Welcome.prototype.setLastname = function (value) {
        var lastName = element(by.valueBind('lastName'));
        return lastName.clear().then(function () { return lastName.sendKeys(value); });
    };
    PageObject_Welcome.prototype.getFullname = function () {
        return element(by.css('.help-block')).getText();
    };
    PageObject_Welcome.prototype.pressSubmitButton = function () {
        return element(by.css('button[type="submit"]')).click();
    };
    PageObject_Welcome.prototype.openAlertDialog = function () {
        var _this = this;
        return browser.wait(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pressSubmitButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser.wait(ExpectedConditions.alertIsPresent(), 5000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, browser.switchTo().alert().then(
                            // use alert.accept instead of alert.dismiss which results in a browser crash
                            function (alert) { alert.accept(); return true; }, function () { return false; })];
                }
            });
        }); });
    };
    return PageObject_Welcome;
}());
export { PageObject_Welcome };
//# sourceMappingURL=welcome.po.js.map