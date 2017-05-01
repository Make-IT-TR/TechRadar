"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Tabletop = require("Tabletop");
var CircularJSON = require("circular-json");
var WikiResult = (function () {
    function WikiResult(ref) {
        if (ref === void 0) { ref = []; }
        this.ref = ref;
    }
    return WikiResult;
}());
exports.WikiResult = WikiResult;
var Vis = (function () {
    function Vis(Visual, Dimension, Enabled, Reverse) {
        if (Enabled === void 0) { Enabled = true; }
        if (Reverse === void 0) { Reverse = false; }
        this.Visual = Visual;
        this.Dimension = Dimension;
        this.Enabled = Enabled;
        this.Reverse = Reverse;
        if (Dimension[0] === '!') {
            this.Dimension = Dimension.replace('!', '');
            this.Reverse = true;
        }
    }
    return Vis;
}());
exports.Vis = Vis;
var Filter = (function () {
    function Filter(Dimension, Value, Enabled) {
        this.Dimension = Dimension;
        this.Value = Value;
        this.Enabled = Enabled;
    }
    return Filter;
}());
exports.Filter = Filter;
var Trend = (function () {
    function Trend() {
    }
    return Trend;
}());
exports.Trend = Trend;
var TrendTechnology = (function () {
    function TrendTechnology() {
    }
    return TrendTechnology;
}());
exports.TrendTechnology = TrendTechnology;
var Config = (function () {
    function Config() {
    }
    return Config;
}());
exports.Config = Config;
var Sheets = (function () {
    function Sheets() {
        this.Years = [2016, 2020];
        this.Examples = [];
        this.Dimensions = ["-none-"];
    }
    return Sheets;
}());
exports.Sheets = Sheets;
var InputScore = (function () {
    function InputScore(title, obj, sheet, description) {
        var _this = this;
        this.Title = title;
        sheet.Years.forEach(function (y) {
            if (title.indexOf(y.toString()) >= 0) {
                var t = title.replace(' ' + y, '');
                _this.Title = t;
                _this.Year = y;
            }
        });
        this.Value = obj[title];
        this.Description = description;
        if (sheet.Dimensions.indexOf(this.Title) === -1)
            sheet.Dimensions.push(this.Title);
    }
    return InputScore;
}());
exports.InputScore = InputScore;
var RadarInput = (function () {
    function RadarInput(input, sheet) {
        this.Technology = input.Technology;
        this.Users = input.Users;
        this.Description = input.Description;
        this.Scores = [];
        this.Remarks = input.Remarks;
        this.Examples = input["Examples & Products"].trim();
        this.Scores.push(new InputScore("TRL 2016", input, sheet));
        this.Scores.push(new InputScore("TRL 2020", input, sheet));
        this.Scores.push(new InputScore("Adoption 2016", input, sheet));
        this.Scores.push(new InputScore("Adoption 2020", input, sheet));
        this.Scores.push(new InputScore("Perez Technological Revolution 2016", input, sheet));
        this.Scores.push(new InputScore("Scale and interaction 2016", input, sheet));
        this.Trend = input["Trend"];
        //this.Scores.push(new InputScore("Potential Impact", input, sheet));
    }
    RadarInput.prototype.getDimensionValue = function (title, year) {
        if (_.isUndefined(year))
            year = 2016;
        var score = _.find(this.Scores, function (s) { return s.Title === title && (!s.Year || s.Year === year); });
        if (score)
            return score.Value;
        return null;
    };
    return RadarInput;
}());
exports.RadarInput = RadarInput;
var Example = (function () {
    function Example(i) {
        this._Technologies = [];
        this.Featured = 0;
        if (i.indexOf('[') >= 0) {
            var result = /(.*)\[(.*)\]/.exec(i);
            if (result && result.length > 2) {
                this.Name = result[1];
                this.Url = result[2];
            }
            else {
                this.Name = i;
            }
        }
        else {
            this.Name = i;
            this.Url = "http://www." + i.trim() + ".com";
        }
    }
    return Example;
}());
exports.Example = Example;
var SpreadsheetService = (function () {
    function SpreadsheetService() {
        this.dimensions = {};
    }
    SpreadsheetService.prototype.initConfig = function (config) {
        config.Visualisation = [];
        // config.Visualisation.push(new Vis("Horizontal", "Adoption", false,false));
        // config.Visualisation.push(new Vis("Radial", "Category", false));
        // config.Visualisation.push(new Vis("Color", "TRL", false));
        // config.Visualisation.push(new Vis("Size", "TRL", false));
    };
    /** Load the technologies */
    SpreadsheetService.prototype.loadTechnologies = function (url, callback) {
        var _this = this;
        this.presets = [];
        // setTimeout(() => {
        //     var serialized = localStorage.getItem('backup');
        //     var r = CircularJSON.parse(serialized);
        //     this.parseTechnologies(r, callback);
        // }, 1000);
        // d3.json('/api/db', (err, data) => {
        //     this.parseData(data, callback);
        //     console.log("got data");
        // });
        this.loadSheet(url, function (r) {
            var serialized = CircularJSON.stringify(r);
            //localStorage.setItem('backup', serialized);
            _this.parseTechnologies(r, callback);
            // just use this in the browser with the provided bundle
        });
    };
    SpreadsheetService.prototype.parseLists = function (lists) {
        var _this = this;
        var cn = lists.columnNames;
        var count = 0;
        cn.forEach(function (c) {
            _this.dimensions[c] = [];
        });
        lists.elements.forEach(function (e) {
            for (var c in _this.dimensions) {
                if (e.hasOwnProperty(c) && e[c] !== "")
                    _this.dimensions[c].push(e[c]);
            }
        });
        //console.log(this.dimensions);
    };
    SpreadsheetService.prototype.cloneWithoutUnderscore = function (v) {
        var _this = this;
        if (typeof v !== 'object')
            return v;
        if (v instanceof Array) {
            var a = [];
            v.forEach(function (i) {
                a.push(_this.cloneWithoutUnderscore(i));
            });
            return a;
        }
        else {
            var c = {};
            for (var k in v) {
                if (k[0] !== '_')
                    c[k] = this.cloneWithoutUnderscore(v[k]);
            }
            return c;
        }
    };
    SpreadsheetService.prototype.parseTechnologies = function (r, callback) {
        var _this = this;
        this.sheets = new Sheets();
        this.sheets.Technologies = r.Technologies.elements;
        this.sheets.Categories = _.filter(r.Categories.elements, function (c) { return !c.Hide; });
        this.sheets.SubCategories = r.SubCategories.elements;
        this.sheets.RadarInput = [];
        this.sheets.Domains = [];
        this.sheets.Categories.forEach(function (c) {
            if (_.findIndex(_this.sheets.Domains, function (d) { return d.Title === c.Domain; }) === -1) {
                _this.sheets.Domains.push({ Title: c.Domain });
            }
        });
        this.sheets.Examples = r.Examples.elements;
        this.sheets.Examples.forEach(function (e) { return e._Technologies = []; });
        //this.sheets.Presets = r.Presets.elements;
        this.parseLists(r.Lists);
        r['Presets'].elements.forEach(function (p) {
            var c = new Config();
            c.Title = p.Title;
            c.Description = p.Description;
            c.Type = p.Visualisation;
            c.Filters = [];
            c.Visualisation = [];
            c.Visualisation.push(new Vis("Horizontal", p.Axis1, false));
            c.Visualisation.push(new Vis("Radial", p.Axis2, false));
            c.Visualisation.push(new Vis("Color", p.Color, false));
            c.Visualisation.push(new Vis("Size", p.Size, false));
            if (p.Filter1) {
                c.Filters.push(_this.parseFilter(p.Filter1));
            }
            if (p.Filter2) {
                c.Filters.push(_this.parseFilter(p.Filter2));
            }
            if (p.Filter3) {
                c.Filters.push(_this.parseFilter(p.Filter3));
            }
            _this.presets.push(c);
        });
        if (this.presets.length > 0) {
            this.activeConfig = this.presets[0];
        }
        else {
            this.activeConfig = new Config();
            this.presets.push(this.activeConfig);
            this.initConfig(this.activeConfig);
        }
        this.sheets.Trends = _.filter(r.Trends.elements, function (t) { return !t.Hide; }); //r.Trends.elements;
        this.sheets.Trends.forEach(function (t) {
            if (t.Preset) {
                t._Preset = _.find(_this.presets, function (p) { return p.Title === t.Preset; });
            }
        });
        this.sheets.Technologies.forEach(function (t) {
            t._Category = _.find(_this.sheets.Categories, function (c) { return c.Category === t.Category; });
            t._SubCategory = _.find(_this.sheets.SubCategories, function (c) { return c.SubCategory === t.SubCategory; });
            t._RadarInput = [];
            t._TrendTechnologies = [];
            t._Examples = [];
            var examples = t.Examples.split(',');
            examples.forEach(function (e) {
                // create example
                e = e.trim();
                var example = new Example(e);
                // look for existing example based on url
                var existingExample;
                _this.sheets.Examples.forEach(function (ex) {
                    if (ex.Name && example.Name && ex.Name.toLowerCase() === example.Name.toLowerCase()) {
                        existingExample = ex;
                    }
                    else if (ex.Url && example.Url && ex.Url.toLowerCase() === example.Url.toLowerCase()) {
                        existingExample = ex;
                    }
                });
                //existingExample = _.find(this.sheets.Examples, (ex) => ((ex.Url && example.Url && ex.Url.toLowerCase() === example.Url.toLowerCase())) || (!ex.Url && ex.Name && example.Name && ex.Name.toLowerCase() === example.Name.toLowerCase()))
                if (existingExample) {
                    if (!existingExample.Featured)
                        existingExample.Featured = 0;
                    t._Examples.push(existingExample);
                    if (existingExample._Technologies && existingExample._Technologies.indexOf(t) === -1) {
                        existingExample._Technologies.push(t);
                    }
                }
                else {
                    example._Technologies.push(t);
                    _this.sheets.Examples.push(example);
                    t._Examples.push(example);
                }
            });
        });
        var lastTech = '';
        console.log('Trend Technologies: ' + r["TrendTechnologies"].elements.length);
        r["TrendTechnologies"].elements.forEach(function (tt) {
            tt._Technology = _.find(_this.sheets.Technologies, function (t) { return t.Technology == tt.Technology; });
            tt._Trend = _.find(_this.sheets.Trends, function (t) { return t.Id == tt.Trend; });
            if (tt._Technology) {
                if (!tt._Technology._TrendTechnologies)
                    tt._Technology._TrendTechnologies = [];
                if (!tt._Trend._TrendTechnologies)
                    tt._Trend._TrendTechnologies = [];
                tt._Technology._TrendTechnologies.push(tt);
                tt._Trend._TrendTechnologies.push(tt);
            }
        });
        r['Radar Input'].elements.forEach(function (i) {
            var ri = new RadarInput(i, _this.sheets);
            if (ri.Users === "Makers") {
                if (ri.Technology === '')
                    ri.Technology = lastTech;
                lastTech = ri.Technology;
                ri._Examples = [];
                ri._Technology = _.find(_this.sheets.Technologies, function (t) { return t.Technology === ri.Technology; });
                if (ri._Technology && ri._Technology.Examples) {
                    //console.log("Merge");
                    ri.Examples = ri.Examples + ',' + ri._Technology.Examples;
                }
                var examples = ri.Examples.split(',');
                examples.forEach(function (e) {
                    // create example
                    e = e.trim();
                    var example = new Example(e);
                    // look for existing example based on url
                    var existingExample;
                    _this.sheets.Examples.forEach(function (ex) {
                        if (ex.Name && example.Name && ex.Name.toLowerCase() === example.Name.toLowerCase()) {
                            existingExample = ex;
                        }
                        else if (ex.Url && example.Url && ex.Url.toLowerCase() === example.Url.toLowerCase()) {
                            existingExample = ex;
                        }
                    });
                    //existingExample = _.find(this.sheets.Examples, (ex) => ((ex.Url && example.Url && ex.Url.toLowerCase() === example.Url.toLowerCase())) || (!ex.Url && ex.Name && example.Name && ex.Name.toLowerCase() === example.Name.toLowerCase()))
                    if (existingExample) {
                        if (!existingExample.Featured)
                            existingExample.Featured = 0;
                        ri._Examples.push(existingExample);
                        if (existingExample._Technologies && existingExample._Technologies.indexOf(ri._Technology) === -1) {
                            existingExample._Technologies.push(ri._Technology);
                        }
                    }
                    else {
                        example._Technologies.push(ri._Technology);
                        _this.sheets.Examples.push(example);
                        ri._Examples.push(example);
                    }
                });
                if (ri._Technology && !ri.Description)
                    ri.Description = ri._Technology.Description;
                if (!ri.Description)
                    ri.Description = ri.Technology;
                if (ri._Technology && ri.Description) {
                    //ri.Scores.push(new InputScore("Users", { "Users": ri.Users }, this.sheets));
                    if (ri._Technology) {
                        ri.Scores.push(new InputScore("Category", { "Category": ri._Technology.Category }, _this.sheets, (ri._Technology._Category) ? ri._Technology._Category.Description : ''));
                        ri.Scores.push(new InputScore("SubCategory", { "SubCategory": ri._Technology.SubCategory }, _this.sheets, (ri._Technology._SubCategory) ? ri._Technology._SubCategory.Description : ''));
                        if (ri._Technology._Category) {
                            ri.Scores.push(new InputScore("Domain", { "Domain": ri._Technology._Category.Domain }, _this.sheets));
                        }
                    }
                    _this.sheets.RadarInput.push(ri);
                }
                else {
                    console.log('Warning not found' + ri.Technology);
                }
            }
            //if (ri._Technology) ri._Technology._RadarInput.push(ri);
        });
        // init filters
        this.presets.forEach(function (p) { if (!p.Filters) {
            p.Filters = [];
        } });
        this.sheets.Dimensions.forEach(function (d) {
            if (d !== "-none-") {
                var f = new Filter(d, '', false);
                f.Options = [];
                if (_this.dimensions.hasOwnProperty(d)) {
                    f.Options = _this.dimensions[d];
                }
                else {
                    _this.sheets.RadarInput.forEach(function (ri) {
                        var v = ri.getDimensionValue(d);
                        if (v && f.Options.indexOf(v) === -1)
                            f.Options.push(v);
                    });
                }
                //if (f.Dimension === "Users") { f.Enabled = true; f.Value = "Makers"; }
                _this.presets.forEach(function (p) {
                    var existingPreset = _.find(p.Filters, function (pr) { return pr.Dimension === f.Dimension; });
                    if (_.isUndefined(existingPreset)) {
                        p.Filters.push(f);
                    }
                    else {
                        existingPreset.Options = f.Options;
                    }
                });
            }
        });
        var exportExamples = [];
        this.sheets.Examples.forEach(function (e) {
            if (e.Url) {
                e.Webshot = "img/webshots/ws" + _this.sdbmCode(e.Url) + ".jpg";
                exportExamples.push(e.Url);
            }
        });
        var res = JSON.stringify(this.cloneWithoutUnderscore(this.sheets));
        //console.log(res);
        //     console.log(JSON.stringify(exportExamples));
        var ee = "";
        this.sheets.Examples.forEach(function (e) {
            ee += e.Name + ';' + (e.Description || '') + ';' + (e.Url || '') + ';' + (e.Featured || '0') + ';' + (e.Description || '') + ';' + (e.Icon || '') + '\n';
        });
        //console.log(ee);
        callback();
    };
    SpreadsheetService.prototype.parseFilter = function (filter) {
        if (filter.indexOf('=') > 0) {
            var ff = filter.split('=');
            var f = new Filter(ff[0], ff[1], true);
            return f;
        }
        return null;
    };
    SpreadsheetService.prototype.sdbmCode = function (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = char + (hash << 6) + (hash << 16) - hash;
        }
        return hash;
    };
    /**
     * Load a worksheet.
     */
    SpreadsheetService.prototype.loadSheet = function (url, callback) {
        console.log('Initializing tabletop');
        Tabletop.init({
            key: url,
            callback: callback,
            singleton: true,
            simpleSheet: false,
            parseNumbers: true
        });
    };
    return SpreadsheetService;
}());
exports.SpreadsheetService = SpreadsheetService;
