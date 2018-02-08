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
// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../static/styles.css';
import '../static/radar.css';
import 'valueconverters';
import 'aurelia-bootstrapper';
import 'bootstrap';
import 'bootstrap-select';
import 'd3';
import 'feathers/client';
import 'socket.io-client';
import { PLATFORM } from 'aurelia-pal';
import * as Bluebird from 'bluebird';
import 'aurelia-google-analytics';
// import '../node_modules/ag-grid/dist/styles/ag-grid.css';
// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });
export function configure(aurelia) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    aurelia.use
                        .standardConfiguration()
                        .developmentLogging()
                        .plugin(PLATFORM.moduleName('aurelia-validation'));
                    //   .plugin(PLATFORM.moduleName('aurelia-google-analytics'), config => {
                    //   config.init('UA-98391880-1');
                    //   config.attach({
                    //     logging: {
                    //       enabled: true // Set to `true` to have some log messages appear in the browser console.
                    //     },
                    //     pageTracking: {
                    //       enabled: true // Set to `false` to disable in non-production environments.
                    //     }, 
                    //     clickTracking: {
                    //       enabled: true // Set to `false` to disable in non-production environments.
                    //     },
                    //     exceptionTracking: {
                    //       enabled: true // Set to `false` to disable in non-production environments.
                    //     }
                    //   })
                    // });
                    // Uncomment the line below to enable animation.
                    //aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
                    // if the css animator is enabled, add swap-order="after" to all router-view elements
                    // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
                    // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));
                    return [4 /*yield*/, aurelia.start()];
                case 1:
                    //   .plugin(PLATFORM.moduleName('aurelia-google-analytics'), config => {
                    //   config.init('UA-98391880-1');
                    //   config.attach({
                    //     logging: {
                    //       enabled: true // Set to `true` to have some log messages appear in the browser console.
                    //     },
                    //     pageTracking: {
                    //       enabled: true // Set to `false` to disable in non-production environments.
                    //     }, 
                    //     clickTracking: {
                    //       enabled: true // Set to `false` to disable in non-production environments.
                    //     },
                    //     exceptionTracking: {
                    //       enabled: true // Set to `false` to disable in non-production environments.
                    //     }
                    //   })
                    // });
                    // Uncomment the line below to enable animation.
                    //aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
                    // if the css animator is enabled, add swap-order="after" to all router-view elements
                    // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
                    // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));
                    _a.sent();
                    return [4 /*yield*/, aurelia.setRoot(PLATFORM.moduleName('app'))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=main.js.map