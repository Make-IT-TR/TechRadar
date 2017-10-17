"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class ProjectConfig {
}
exports.ProjectConfig = ProjectConfig;
class Dimension {
}
exports.Dimension = Dimension;
class Project {
    linkExamples(e) {
        e.Name = _.trim(e.Name);
        e._Technologies = [];
    }
    linkTechnology(t) {
        t._Category = _.find(this.categories, { Category: t.Category });
        t._SubCategory = _.find(this.subcategories, { SubCategory: t.SubCategory });
        t._RadarInput = [];
        t._Examples = [];
        t._Trends = [];
        t.Platforms.forEach(p => {
            let example = _.find(this.examples, { id: p });
            if (example) {
                t._Examples.push(example);
                example._Technologies.push(t);
            }
        });
    }
    linkRadarInput(ri) {
        ri._Technology = _.find(this.technologies, { Technology: ri.Technology });
        if (ri._Technology) {
            if (!ri._Technology._RadarInput)
                ri._Technology._RadarInput = [];
            ri._Technology._RadarInput.push(ri);
        }
    }
    linkTrend(tr) {
        tr._Preset = _.find(this.presets, { Title: tr.Preset });
        tr._Technologies = [];
        tr.Technologies.forEach(t => {
            let tech = _.find(this.technologies, { Technology: t });
            if (tech) {
                tr._Technologies.push(tech);
                tech._Trends.push(tr);
            }
        });
    }
    linkObjects() {
        this.examples.forEach(e => {
            this.linkExamples(e);
        });
        this.technologies.forEach(t => {
            this.linkTechnology(t);
        });
        this.radarinput.forEach(ri => {
            this.linkRadarInput(ri);
        });
        this.trends.forEach(tr => {
            this.linkTrend(tr);
        });
        this.subcategories.forEach(sc => {
            sc._Category = _.find(this.categories, { Category: sc.Category });
        });
    }
}
exports.Project = Project;
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
class Config {
}
exports.Config = Config;
class Sheets {
    constructor() {
        this.Years = [2016, 2020];
        this.Examples = [];
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
class RadarCircle {
}
exports.RadarCircle = RadarCircle;
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
        /**
         * Load a worksheet.
         */
    }
    initConfig(config) {
        config.Visualisation = [];
        // config.Visualisation.push(new Vis("Horizontal", "Adoption", false,false));
        // config.Visualisation.push(new Vis("Radial", "Category", false));
        // config.Visualisation.push(new Vis("Color", "TRL", false));
        // config.Visualisation.push(new Vis("Size", "TRL", false));
    }
    parseLists(lists) {
        var cn = lists.columnNames;
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
}
exports.SpreadsheetService = SpreadsheetService;
//# sourceMappingURL=classes.js.map