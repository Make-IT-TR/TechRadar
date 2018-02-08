"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Tabletop = require("tabletop");
const CircularJSON = require("circular-json");
class ProjectConfig {
}
exports.ProjectConfig = ProjectConfig;
class Project {
}
exports.Project = Project;
function linkObjects(project) {
    project.examples.forEach(e => {
        e.Name = _.trim(e.Name);
    });
    project.categories.forEach(c => {
    });
    project.technologies.forEach(t => {
        t._Category = _.find(project.categories, { Category: t.Category });
        t._SubCategory = _.find(project.subcategories, { SubCategory: t.SubCategory });
    });
    project.radarinput.forEach(ri => {
        ri._Technology = _.find(project.technologies, { Technology: ri.Technology });
    });
}
exports.linkObjects = linkObjects;
class WikiResult {
    constructor(ref = []) {
        this.ref = ref;
    }
}
exports.WikiResult = WikiResult;
class Vis {
    constructor(Visual, Dimension, Enabled = true, Reverse = false) {
        this.Visual = Visual;
        this.Dimension = Dimension;
        this.Enabled = Enabled;
        this.Reverse = Reverse;
        if (Dimension[0] === '!') {
            this.Dimension = Dimension.replace('!', '');
            this.Reverse = true;
        }
    }
}
exports.Vis = Vis;
class Filter {
    constructor(Dimension, Value, Enabled) {
        this.Dimension = Dimension;
        this.Value = Value;
        this.Enabled = Enabled;
    }
}
exports.Filter = Filter;
class Trend {
    constructor() {
        this.Technologies = [];
    }
}
exports.Trend = Trend;
class TrendTechnology {
}
exports.TrendTechnology = TrendTechnology;
class Config {
}
exports.Config = Config;
class Sheets {
    constructor() {
        this.Years = [2016, 2020];
        this.Examples = [];
        this.TrendTechnologies = [];
        this.Dimensions = ["-none-"];
    }
}
exports.Sheets = Sheets;
class InputScore {
    constructor(title, obj, sheet, description) {
        this.Title = title;
        sheet.Years.forEach(y => {
            if (title.indexOf(y.toString()) >= 0) {
                var t = title.replace(' ' + y, '');
                this.Title = t;
                this.Year = y;
            }
        });
        this.Value = obj[title];
        this.Description = description;
        if (sheet.Dimensions.indexOf(this.Title) === -1)
            sheet.Dimensions.push(this.Title);
    }
}
exports.InputScore = InputScore;
class RadarInput {
    constructor(input, sheet) {
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
    getDimensionValue(title, year) {
        if (_.isUndefined(year))
            year = 2016;
        var score = _.find(this.Scores, s => { return s.Title === title && (!s.Year || s.Year === year); });
        if (score)
            return score.Value;
        return null;
    }
}
exports.RadarInput = RadarInput;
class Example {
    constructor(i) {
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
}
exports.Example = Example;
class SpreadsheetService {
    constructor() {
        this.dimensions = {};
    }
    initConfig(config) {
        config.Visualisation = [];
        // config.Visualisation.push(new Vis("Horizontal", "Adoption", false,false));
        // config.Visualisation.push(new Vis("Radial", "Category", false));
        // config.Visualisation.push(new Vis("Color", "TRL", false));
        // config.Visualisation.push(new Vis("Size", "TRL", false));
    }
    /** Load the technologies */
    loadTechnologies(url, callback) {
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
        this.loadSheet(url, (r) => {
            var serialized = CircularJSON.stringify(r);
            //localStorage.setItem('backup', serialized);
            this.parseTechnologies(r, callback);
            // just use this in the browser with the provided bundle
        });
    }
    parseLists(lists) {
        var cn = lists.columnNames;
        console.log(cn);
        var count = 0;
        cn.forEach(c => {
            this.dimensions[c] = [];
        });
        lists.elements.forEach(e => {
            for (var c in this.dimensions) {
                if (e.hasOwnProperty(c) && e[c] !== "")
                    this.dimensions[c].push(e[c]);
            }
        });
        //console.log(this.dimensions);
    }
    cloneWithoutUnderscore(v) {
        if (typeof v !== 'object')
            return v;
        if (v instanceof Array) {
            var a = [];
            v.forEach((i) => {
                a.push(this.cloneWithoutUnderscore(i));
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
    }
    parseTechnologies(r, callback) {
        this.sheets = new Sheets();
        this.sheets.Technologies = r.Technologies.elements;
        this.sheets.Categories = _.filter(r.Categories.elements, (c) => { return !c.Hide; });
        this.sheets.SubCategories = r.SubCategories.elements;
        this.sheets.RadarInput = [];
        this.sheets.Domains = [];
        this.sheets.Categories.forEach(c => {
            if (_.findIndex(this.sheets.Domains, d => d.Title === c.Domain) === -1) {
                this.sheets.Domains.push({ Title: c.Domain });
            }
        });
        this.sheets.Examples = r.Examples.elements;
        this.sheets.Examples.forEach(e => e._Technologies = []);
        this.sheets.TrendTechnologies = r.TrendTechnologies.elements;
        //this.sheets.Presets = r.Presets.elements;
        this.parseLists(r.Dimensions);
        r['Presets'].elements.forEach(p => {
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
                c.Filters.push(this.parseFilter(p.Filter1));
            }
            if (p.Filter2) {
                c.Filters.push(this.parseFilter(p.Filter2));
            }
            if (p.Filter3) {
                c.Filters.push(this.parseFilter(p.Filter3));
            }
            this.presets.push(c);
        });
        if (this.presets.length > 0) {
            this.activeConfig = this.presets[0];
        }
        else {
            this.activeConfig = new Config();
            this.presets.push(this.activeConfig);
            this.initConfig(this.activeConfig);
        }
        this.sheets.Trends = _.filter(r.Trends.elements, (t) => { return !t.Hide; }); //r.Trends.elements;
        this.sheets.Trends.forEach(t => {
            t.id = t['Id'];
            delete t['Id'];
            if (t.Preset) {
                t._Preset = _.find(this.presets, (p) => p.Title === t.Preset);
            }
            t.Technologies = [];
        });
        this.sheets.Technologies.forEach(t => {
            t._Category = _.find(this.sheets.Categories, (c) => c.Category === t.Category);
            t._SubCategory = _.find(this.sheets.SubCategories, (c) => c.SubCategory === t.SubCategory);
            t._RadarInput = [];
            t._Examples = [];
            t.Platforms = [];
            var examples = t.Examples.split(',');
            examples.forEach(e => {
                // create example
                e = e.trim();
                var example = new Example(e);
                // look for existing example based on url
                var existingExample;
                this.sheets.Examples.forEach(ex => {
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
                    this.sheets.Examples.push(example);
                    t._Examples.push(example);
                }
            });
        });
        var lastTech = '';
        // console.log('Trend Technologies: ' + r["TrendTechnologies"].elements.length);
        // r["TrendTechnologies"].elements.forEach((tt: TrendTechnology) => {
        //     tt._Technology = _.find(this.sheets.Technologies, (t: ITechnology) => t.Technology == tt.Technology);
        //     tt._Trend = _.find(this.sheets.Trends, (t: Trend) => t.id == tt.Trend);
        //     if (tt._Technology) {
        //         if (!tt._Technology._TrendTechnologies) tt._Technology._TrendTechnologies = [];
        //         if (!tt._Trend._TrendTechnologies) tt._Trend._TrendTechnologies = [];
        //         tt._Technology._TrendTechnologies.push(tt);
        //         tt._Trend._TrendTechnologies.push(tt);
        //         tt._Trend.Technologies.push(tt.Technology);
        //     }
        // });
        r['Radar Input'].elements.forEach(i => {
            var ri = new RadarInput(i, this.sheets);
            if (ri.Users === "Makers") {
                if (ri.Technology === '')
                    ri.Technology = lastTech;
                lastTech = ri.Technology;
                ri._Examples = [];
                ri._Technology = _.find(this.sheets.Technologies, (t) => t.Technology === ri.Technology);
                if (ri._Technology && ri._Technology.Examples) {
                    //console.log("Merge");
                    ri.Examples = ri.Examples + ',' + ri._Technology.Examples;
                }
                var examples = ri.Examples.split(',');
                examples.forEach(e => {
                    // create example
                    e = e.trim();
                    var example = new Example(e);
                    // look for existing example based on url
                    var existingExample;
                    this.sheets.Examples.forEach(ex => {
                        if (ex.Name && example.Name && ex.Name.toLowerCase() === example.Name.toLowerCase()) {
                            existingExample = ex;
                        }
                        else if (ex.Url && example.Url && ex.Url.toLowerCase() === example.Url.toLowerCase()) {
                            existingExample = ex;
                        }
                    });
                    if (ri._Technology && !ri._Technology._Examples)
                        ri._Technology._Examples = [];
                    //existingExample = _.find(this.sheets.Examples, (ex) => ((ex.Url && example.Url && ex.Url.toLowerCase() === example.Url.toLowerCase())) || (!ex.Url && ex.Name && example.Name && ex.Name.toLowerCase() === example.Name.toLowerCase()))
                    if (existingExample) {
                        if (!existingExample.Featured)
                            existingExample.Featured = 0;
                        ri._Examples.push(existingExample);
                        if (ri._Technology)
                            ri._Technology._Examples.push(existingExample);
                        if (existingExample._Technologies && existingExample._Technologies.indexOf(ri._Technology) === -1) {
                            existingExample._Technologies.push(ri._Technology);
                        }
                    }
                    else {
                        example._Technologies.push(ri._Technology);
                        this.sheets.Examples.push(example);
                        if (ri._Technology)
                            ri._Technology._Examples.push(example);
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
                        ri.Scores.push(new InputScore("Category", { "Category": ri._Technology.Category }, this.sheets, (ri._Technology._Category) ? ri._Technology._Category.Description : ''));
                        ri.Scores.push(new InputScore("SubCategory", { "SubCategory": ri._Technology.SubCategory }, this.sheets, (ri._Technology._SubCategory) ? ri._Technology._SubCategory.Description : ''));
                        if (ri._Technology._Category) {
                            ri.Scores.push(new InputScore("Domain", { "Domain": ri._Technology._Category.Domain }, this.sheets));
                        }
                    }
                    this.sheets.RadarInput.push(ri);
                }
                else {
                    console.log('Warning not found' + ri.Technology);
                }
            }
            //if (ri._Technology) ri._Technology._RadarInput.push(ri);
        });
        // init filters
        this.presets.forEach(p => { if (!p.Filters) {
            p.Filters = [];
        } });
        this.sheets.Dimensions.forEach(d => {
            if (d !== "-none-") {
                var f = new Filter(d, '', false);
                f.Options = [];
                if (this.dimensions.hasOwnProperty(d)) {
                    f.Options = this.dimensions[d];
                }
                else {
                    this.sheets.RadarInput.forEach(ri => {
                        var v = ri.getDimensionValue(d);
                        if (v && f.Options.indexOf(v) === -1)
                            f.Options.push(v);
                    });
                }
                //if (f.Dimension === "Users") { f.Enabled = true; f.Value = "Makers"; }
                this.presets.forEach(p => {
                    var existingPreset = _.find(p.Filters, pr => pr.Dimension === f.Dimension);
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
        let ti = 0;
        this.sheets.Examples.forEach(e => {
            if (e.Url) {
                e.Webshot = "img/webshots/ws" + this.sdbmCode(e.Url) + ".jpg";
                exportExamples.push(e.Url);
            }
            e.id = ti.toString();
            ti += 1;
        });
        //console.log(res);
        //     console.log(JSON.stringify(exportExamples));
        var ee = "";
        this.sheets.Examples.forEach(e => {
            e.Name = e.Name.replace(/^\s*|\s*$/, "").trim();
            if (e.Name === "")
                e.Name = e.Url;
            ee += e.Name + ';' + (e.Description || '') + ';' + (e.Url || '') + ';' + (e.Featured || '0') + ';' + (e.Description || '') + ';' + (e.Icon || '') + '\n';
        });
        this.sheets.Technologies.forEach(t => {
            t.Platforms = [];
            if (t._Examples) {
                t._Examples.forEach(e => {
                    if (e.Name !== "" && e.Name !== "http://www..com" && t.Platforms.indexOf(e.id) === -1)
                        t.Platforms.push(e.id);
                });
            }
            ;
            // t.Examples = [];
        });
        var res = JSON.stringify(this.cloneWithoutUnderscore(this.sheets));
        //console.log(ee);
        callback();
    }
    parseFilter(filter) {
        if (filter.indexOf('=') > 0) {
            var ff = filter.split('=');
            var f = new Filter(ff[0], ff[1], true);
            return f;
        }
        return null;
    }
    sdbmCode(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = char + (hash << 6) + (hash << 16) - hash;
        }
        return hash;
    }
    /**
     * Load a worksheet.
     */
    loadSheet(url, callback) {
        console.log('Initializing tabletop');
        Tabletop.init({
            key: url,
            callback: callback,
            singleton: true,
            simpleSheet: false,
            parseNumbers: true
        });
    }
}
exports.SpreadsheetService = SpreadsheetService;
//# sourceMappingURL=classes.js.map