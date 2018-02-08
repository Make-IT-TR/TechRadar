import * as _ from 'lodash';
var ProjectConfig = (function () {
    function ProjectConfig() {
    }
    return ProjectConfig;
}());
export { ProjectConfig };
var Dimension = (function () {
    function Dimension() {
    }
    return Dimension;
}());
export { Dimension };
var Project = (function () {
    function Project() {
    }
    Project.prototype.linkExamples = function (e) {
        e.Name = _.trim(e.Name);
        e._Technologies = [];
    };
    Project.prototype.linkTechnology = function (t) {
        var _this = this;
        t._Category = _.find(this.categories, { Category: t.Category });
        t._SubCategory = _.find(this.subcategories, { SubCategory: t.SubCategory });
        t._RadarInput = [];
        t._Examples = [];
        t._Trends = [];
        t.Platforms.forEach(function (p) {
            var example = _.find(_this.examples, { id: p });
            if (example) {
                if (!t._Examples.includes(example))
                    t._Examples.push(example);
                if (!example._Technologies.includes(t))
                    example._Technologies.push(t);
            }
        });
    };
    Project.prototype.linkRadarInput = function (ri) {
        ri._Technology = _.find(this.technologies, { Technology: ri.Technology });
        if (ri._Technology) {
            if (!ri._Technology._RadarInput)
                ri._Technology._RadarInput = [];
            if (!ri._Technology._RadarInput.includes)
                ri._Technology._RadarInput.push(ri);
        }
    };
    Project.prototype.linkTrend = function (tr) {
        var _this = this;
        tr._Preset = _.find(this.presets, { Title: tr.Preset });
        tr._Technologies = [];
        tr.Technologies.forEach(function (t) {
            var tech = _.find(_this.technologies, { Technology: t });
            if (tech) {
                if (!tr._Technologies.includes(tech))
                    tr._Technologies.push(tech);
                if (!tech._Trends.includes(tr))
                    tech._Trends.push(tr);
            }
        });
    };
    Project.prototype.linkObjects = function () {
        var _this = this;
        this.examples.forEach(function (e) {
            _this.linkExamples(e);
        });
        this.technologies.forEach(function (t) {
            _this.linkTechnology(t);
        });
        this.radarinput.forEach(function (ri) {
            _this.linkRadarInput(ri);
        });
        this.trends.forEach(function (tr) {
            _this.linkTrend(tr);
        });
        this.subcategories.forEach(function (sc) {
            sc._Category = _.find(_this.categories, { Category: sc.Category });
        });
    };
    return Project;
}());
export { Project };
var WikiResult = (function () {
    function WikiResult(ref) {
        if (ref === void 0) { ref = []; }
        this.ref = ref;
    }
    return WikiResult;
}());
export { WikiResult };
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
export { Vis };
var Filter = (function () {
    function Filter(Dimension, Value, Enabled) {
        this.Dimension = Dimension;
        this.Value = Value;
        this.Enabled = Enabled;
    }
    return Filter;
}());
export { Filter };
var Trend = (function () {
    function Trend() {
        this.Technologies = [];
    }
    return Trend;
}());
export { Trend };
var Config = (function () {
    function Config() {
    }
    return Config;
}());
export { Config };
var Sheets = (function () {
    function Sheets() {
        this.Years = [2016, 2020];
        this.Examples = [];
        this.Dimensions = ["-none-"];
    }
    return Sheets;
}());
export { Sheets };
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
export { InputScore };
var RadarCircle = (function () {
    function RadarCircle() {
    }
    return RadarCircle;
}());
export { RadarCircle };
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
export { RadarInput };
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
export { Example };
var SpreadsheetService = (function () {
    function SpreadsheetService() {
        this.dimensions = {};
        /**
         * Load a worksheet.
         */
    }
    SpreadsheetService.prototype.initConfig = function (config) {
        config.Visualisation = [];
        // config.Visualisation.push(new Vis("Horizontal", "Adoption", false,false));
        // config.Visualisation.push(new Vis("Radial", "Category", false));
        // config.Visualisation.push(new Vis("Color", "TRL", false));
        // config.Visualisation.push(new Vis("Size", "TRL", false));
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
    return SpreadsheetService;
}());
export { SpreadsheetService };
//# sourceMappingURL=classes.js.map