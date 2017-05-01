var _ = require('lodash');
export var classes;
(function (classes) {
    var Content = (function () {
        function Content(id, contentType, content, subTitle) {
            this.id = id;
            this.contentType = contentType;
            this.content = content;
            this.subTitle = subTitle;
        }
        return Content;
    }());
    classes.Content = Content;
    /** description of a technology  */
    var Technology = (function () {
        function Technology(id, priority, category, thumbnail, timePeriod, relativeRadius, shortTitle, title, subTitle, text, color, visible, focus) {
            if (visible === void 0) { visible = true; }
            if (focus === void 0) { focus = false; }
            this.id = id;
            this.priority = priority;
            this.category = category;
            this.thumbnail = thumbnail;
            this.timePeriod = timePeriod;
            this.relativeRadius = relativeRadius;
            this.shortTitle = shortTitle;
            this.title = title;
            this.subTitle = subTitle;
            this.text = text;
            this.color = color;
            this.visible = visible;
            this.focus = focus;
            this.content = [];
            this.content = [];
        }
        return Technology;
    }());
    classes.Technology = Technology;
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
    classes.Vis = Vis;
    var Filter = (function () {
        function Filter(Dimension, Value, Enabled) {
            this.Dimension = Dimension;
            this.Value = Value;
            this.Enabled = Enabled;
        }
        return Filter;
    }());
    classes.Filter = Filter;
    var Trend = (function () {
        function Trend() {
        }
        return Trend;
    }());
    classes.Trend = Trend;
    var TrendTechnology = (function () {
        function TrendTechnology() {
        }
        return TrendTechnology;
    }());
    classes.TrendTechnology = TrendTechnology;
    var Config = (function () {
        function Config() {
        }
        return Config;
    }());
    classes.Config = Config;
    var Sheets = (function () {
        function Sheets() {
            this.Years = [2016, 2020];
            this.Examples = [];
            this.Dimensions = ["-none-"];
        }
        return Sheets;
    }());
    classes.Sheets = Sheets;
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
    classes.InputScore = InputScore;
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
    classes.RadarInput = RadarInput;
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
                this.Url = "http://" + i + ".com";
            }
        }
        return Example;
    }());
    classes.Example = Example;
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
        return SpreadsheetService;
    }());
    classes.SpreadsheetService = SpreadsheetService;
})(classes || (classes = {}));
