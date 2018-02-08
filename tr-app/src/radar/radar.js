var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Trend, RadarCircle } from './../classes';
import { inject } from 'aurelia-framework';
import { bindable } from "aurelia-framework";
import { ApplicationState } from '../ApplicationState';
import { MessageBusService } from './../MessageBus';
import * as _ from "lodash";
var d3 = require('d3');
var tip = require('./../utils/d3tip');
var Radar = (function () {
    function Radar(element, appState, bus) {
        var _this = this;
        this.view = "all";
        this.heading = 'Radar';
        this.element = element;
        this.appState = appState;
        this.bus = bus;
        if (this.view === "all") {
            this.id = "all";
        }
        else {
            this.id = this.trend.id;
            this.appState.activeConfig.ShowTrend = false;
        }
        this.bus.subscribe("filter", function (title, t) {
            switch (title) {
                case "all":
                    console.log('select all');
                    _this.selectAll();
                    break;
                case "trend":
                    _this.selectTrend(t);
                    break;
            }
        });
        this.bus.subscribe("reload", function (title, data) {
            _this.updateFilter();
            _this.draw();
        });
    }
    Radar.prototype.selectAll = function () {
        this.trend = null;
        this.selectPreset(this.appState.project.presets[0]);
        this.draw();
    };
    Radar.prototype.trendChanged = function (newValue) {
        console.log('trend changed');
        var trend = _.find(this.appState.project.trends, function (t) { return t.id === newValue; });
        if (trend)
            this.selectTrend(trend);
    };
    Radar.prototype.activate = function (parms, routeConfig) {
        console.log('Active Radar');
    };
    Radar.prototype.selectPreset = function (preset) {
        this.appState.activeConfig = preset;
        this.updateFilter();
    };
    Radar.prototype.getDimensions = function (dim, reverse) {
        if (reverse === void 0) { reverse = false; }
        var res = [];
        // dimension has been defined is lists sheet
        if (this.appState.project.dimensions.hasOwnProperty(dim)) {
            res = this.appState.project.dimensions[dim];
        }
        else {
            // get dimensions from actual items
            this.appState.project.radarinput.forEach(function (ri) {
                var s = _.find(ri.Scores, { Title: dim });
                if (s && s.Value !== '')
                    if (s && res.indexOf(s.Value) === -1)
                        res.push(s.Value);
            });
        }
        if (reverse)
            return (res.reverse());
        return res;
    };
    Radar.prototype.updateFilter = function () {
        var _this = this;
        this.appState.items = [];
        // if (!this.data.sheets || !this.data.sheets.RadarInput) return;
        this.appState.project.radarinput.forEach(function (ri) {
            var match = true;
            if (_this.view === 'all' && _this.appState.activeConfig && _this.appState.activeConfig.Filters) {
                _this.appState.activeConfig.Filters.forEach(function (f) {
                    if (f.Enabled && f.Value && _this.appState.getDimensionValue(ri, f.Dimension) !== f.Value) {
                        match = false;
                    }
                });
            }
            else {
                // match = !_.isUndefined(_.find(this.appState.activeTrend._TrendTechnologies, tt => tt._Technology === ri._Technology));
            }
            if (match)
                _this.appState.items.push(ri);
        });
        this.appState.activeConfig.Visualisation.forEach(function (f) {
            switch (f.Visual) {
                case 'Horizontal':
                    _this.appState.horizontal = _this.getDimensions(f.Dimension, f.Reverse);
                    _this.appState.activeConfig.horizontalDimension = f.Dimension;
                    break;
                case 'Radial':
                    _this.appState.radial = _this.getDimensions(f.Dimension, f.Reverse);
                    _this.appState.activeConfig.radialDimension = f.Dimension;
                    break;
                case 'Color':
                    _this.appState.colorsD = _this.getDimensions(f.Dimension, f.Reverse);
                    _this.appState.activeConfig.colorDimension = f.Dimension;
                    break;
                case 'Size':
                    _this.appState.size = _this.getDimensions(f.Dimension, f.Reverse);
                    _this.appState.activeConfig.sizeDimension = f.Dimension;
                    break;
            }
        });
        // this.busService.publish('filter', 'updated');
    };
    Radar.prototype.selectTrend = function (t) {
        console.log('select trend');
        // this.data = this.appState.sheets;
        this.trend = t;
        this.appState.activeTrend = t;
        if (t._Preset) {
            this.selectPreset(t._Preset);
            this.appState.activeConfig.ShowTrend = true;
        }
        else
            this.updateFilter();
        this.draw();
    };
    Radar.prototype.draw = function () {
        var _this = this;
        setTimeout(function () { return _this.draw2(); }, 1);
    };
    Radar.prototype.draw2 = function () {
        var _this = this;
        console.log('start drawing');
        if (!this.appState.radial || !this.appState.horizontal)
            return;
        var radial = this.appState.radial; // ["2016", "2017", "2018", "2019", "2020", "2021", "2022"];
        var horizontal = ["very low", "low", "neutral", "high", "very high"];
        // Get the dimensions of the container div
        // We set it as a square (1:1 rect)
        // So that we can easily use Viebox for making it responsive
        var container = d3.select("#techradar-vis").node();
        var width = container.getBoundingClientRect().width;
        // Scale it a bit dow in order to make it fir into the viz
        width = width * 0.85;
        var height = width;
        var radius = 12; // radius of a circle
        var thickness = 6; //thickness of a circle
        var nr_of_segments = radial.length;
        var nr_of_levels = horizontal.length;
        var rings = d3.scale.linear().domain([0, horizontal.length + 1]).range([0, radius]);
        var padding_rings = rings(1); // distance between rings
        var _outer_radius = radius;
        var _inner_radius = radius - thickness;
        var _start_angle = -0.6 * Math.PI;
        var _end_angle = 0.6 * Math.PI;
        var degrees = d3.scale.linear().domain([0, 180]).range([_start_angle, _end_angle]);
        var start_angle = degrees(0);
        var end_angle = degrees(180);
        var segment = d3.scale.linear().domain([0, nr_of_segments]).range([start_angle, end_angle]);
        // Remove previous visualisations
        var svg = d3.select("#techradar-vis svg").remove();
        // Add the svg for the visualisation
        var svg = d3.select("#techradar-vis").append("svg");
        // Make it responsive with viewBox
        svg.attr('preserveAspectRatio', "xMinYMin meet")
            .attr("viewBox", "0 0 1000 600")
            .attr('width', '100%');
        var radar = svg.append("g")
            .attr("class", "wrapper")
            .attr("transform", "translate(500, 450)");
        var tech = svg.append("g")
            .attr("class", "wrapper")
            .attr("transform", "translate(500, 450)");
        var radial = this.appState.radial; // ["2016", "2017", "2018", "2019", "2020", "2021", "2022"];
        var horizontal = this.appState.horizontal; //["very low", "low", "neutral", "high", "very high"];
        var step = 180 / nr_of_segments;
        var minDepth = 0.25;
        var arcDepth = (0.95 - minDepth) / this.appState.horizontal.length;
        var arcWidth = width / 2 / horizontal.length * (0.95 - minDepth);
        var first = true;
        var id = this.appState.horizontal.length;
        var mycolor = d3.rgb("#eee");
        var hpos = 1;
        var all = [];
        var horTitlePos = 80;
        var horTitleSteps = horTitlePos / this.appState.horizontal.length;
        this.appState.horizontal.forEach(function (h) {
            var segmentData = [];
            var start = 0;
            _this.appState.radial.forEach(function (r) {
                segmentData.push({ title: r, startAngle: start, endAngle: start + step, items: [] });
                start += step;
            });
            var haxispos = -((arcWidth * (horizontal.length - hpos + 1) - arcWidth / 8 + _inner_radius / 8));
            // var text = svg.append("text")
            //     .attr("x", haxispos)
            //     .attr("y", 30)
            //     .attr("class", "horizontalTitle")
            //     .attr("text-anchor", "middle")
            //     .text(h);
            // var text = svg.append("text")
            //     .attr("x", -haxispos)
            //     .attr("y", 30)
            //     .attr("class", "horizontalTitle")
            //     .attr("text-anchor", "middle")
            //     .text(h);
            var txt = h;
            if (h.length > 10 && h.indexOf('-') > 0)
                txt = h[0];
            if (txt.length > 15)
                txt = txt.substr(0, 14);
            var textWidth = 75;
            horTitlePos -= horTitleSteps;
            radar.append("foreignObject")
                .attr("x", haxispos - 40 - textWidth / 2) /*the position of the text (left to right)*/
                .attr("y", 55 + horTitlePos) /*the position of the text (Up and Down)*/
                .attr("class", "horizontalTitle")
                .attr("width", textWidth)
                .append("xhtml:div")
                .text(txt);
            radar.append("foreignObject")
                .attr("x", -haxispos + 40 - textWidth / 2) /*the position of the text (left to right)*/
                .attr("y", 55 + horTitlePos) /*the position of the text (Up and Down)*/
                .attr("class", "horizontalTitle")
                .attr("width", textWidth)
                .append("xhtml:div")
                .text(txt);
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                var res = d.join(',');
                return "<strong>Technology:</strong> <span style='color:red'>" + res + "</span>";
            });
            svg.call(tip);
            hpos += 1;
            var years = [2016];
            // if (this.appState.activeConfig.ShowTrend) years.push(2020);
            var its = [];
            console.log('colors');
            console.log(_this.appState.activeConfig.colorDimension);
            _this.appState.project.radarinput.forEach(function (i) {
                var techs = [];
                if (_this.view === 'all' && _this.appState.items) {
                    techs = _this.appState.items;
                }
                else if (_this.appState.activeTrend) {
                    techs = _this.appState.activeTrend._Technologies;
                }
                if (_.findIndex(techs, function (t) { return t.Technology === i.Technology; }) >= 0) {
                    years.forEach(function (y) {
                        if (years.indexOf(y) >= 0) {
                            var future = (years.length > 1 && years[1] === y);
                            var horScore = _this.appState.getDimensionScore(i, _this.appState.activeConfig.horizontalDimension, y);
                            if (horScore.Value === h) {
                                var radScore = _this.appState.getDimensionScore(i, _this.appState.activeConfig.radialDimension, y);
                                if (radScore) {
                                    var pos = _this.appState.radial.indexOf(radScore.Value);
                                    if (pos !== -1) {
                                        var segment = _.find(segmentData, (function (s) { return s.title === radScore.Value; }));
                                        if (segment) {
                                            segment.items.push(i);
                                            var c = new RadarCircle();
                                            c._future = future;
                                            c._segment = segment;
                                            c._year = y;
                                            c._segmentPos = pos;
                                            c._segmentItemPos = segment.items.length;
                                            c._Input = i;
                                            c._Technology = i._Technology;
                                            c._horScore = horScore;
                                            c._radScore = radScore;
                                            //    console.log(horScore.Value + ' - ' + radScore.Value);
                                            if (i._Technology) {
                                                its.push(c);
                                                all.push(c);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        ;
                    });
                }
            });
            var depth = ((arcDepth * id) + minDepth) / 2;
            //Creates a function that makes SVG paths in the shape of arcs with the specified inner and outer radius
            var arc = d3.svg.arc()
                .innerRadius(width * depth - arcWidth)
                .outerRadius(width * depth);
            //Creates function that will turn the month data into start and end angles
            var pie = d3.layout.pie()
                .value(function (d) { return d.endAngle - d.startAngle; })
                .startAngle(_start_angle)
                .endAngle(_end_angle)
                .sort(null);
            //Draw the arcs themselves
            radar.selectAll(".monthArc" + id)
                .data(pie(segmentData))
                .enter().append("path")
                .attr("class", "segmentArc")
                .attr("id", function (d, i) { return "monthArc_" + i; })
                .style("fill", mycolor.toString())
                .attr("d", arc)
                .on('mouseenter', function (d) {
                console.log(d);
                if (d.data && d.data.items && d.data.items.length > 0) {
                    var res_1 = [];
                    d.data.items.forEach(function (t) { return res_1.push(t.Technology); });
                    tip.show(res_1);
                }
                // bus.publish("segment", "mouseover", d.data);
                if (d.parentNode)
                    d.parentNode.appendChild(d);
                // radar.ts:367 Uncaught TypeError: Cannot read property 'appendChild' of undefined
            })
                .on('mouseleave', function (d) {
                tip.hide();
            });
            // console.log(its);
            its.forEach(function (i) {
                console.log(i._segment.items.length);
                var difS = 0;
                var difE = 1;
                if (i._segment.items.length > 1) {
                    difS = difE = (i._segmentItemPos / i._segment.items.length) * 0.9;
                }
                var segmentArc = d3.svg.arc()
                    .innerRadius(width * depth - arcWidth)
                    .outerRadius(width * depth)
                    .startAngle(segment(i._segmentPos + difS))
                    .endAngle(segment(i._segmentPos + difE));
                var pos = segmentArc.centroid();
                i._pos = pos;
                var color = "black";
                if (_this.appState.activeConfig.colorDimension) {
                    var colorValue = _this.appState.getDimensionValue(i._Input, _this.appState.activeConfig.colorDimension, i._year);
                    if (!colorValue && i._future)
                        colorValue = _this.appState.getDimensionValue(i._Input, _this.appState.activeConfig.colorDimension);
                    if (colorValue && _this.appState.colorsD.indexOf(colorValue) !== -1) {
                        color = _this.appState.colors[_this.appState.colorsD.indexOf(colorValue)];
                    }
                }
                i._color = color;
                var size = 10;
                if (_this.appState.activeConfig.sizeDimension && _this.appState.activeConfig.sizeDimension !== "-none-") {
                    var sizeValue = _this.appState.getDimensionValue(i._Input, _this.appState.activeConfig.sizeDimension, i._year);
                    var sizeIndex = _this.appState.size.length - _this.appState.size.indexOf(sizeValue);
                    if (sizeValue && sizeIndex >= 0) {
                        size = (10 / _this.appState.size.length * sizeIndex) + 3;
                    }
                }
                var circle = tech.append("circle")
                    .attr("cx", pos[0])
                    .attr("cy", pos[1])
                    .attr("r", size)
                    .attr("class", "techCircle")
                    .style("fill", color.toString())
                    .style("opacity", i._future ? 0.5 : 1)
                    .on('mouseenter', function (d) {
                    tip.show([i._Technology.Technology]);
                    console.log('Enter ' + i._Technology.Technology);
                })
                    .on('mouseleave', function (d) {
                    tip.hide();
                    console.log('Leave ' + i._Technology.Technology);
                })
                    .on("mousedown", function () {
                    _this.bus.publish('technologysheet', 'show', i._Technology);
                });
                var px = pos[0] - 75 / 2;
                var py = pos[1] + size + 5;
                if (!i._future && i._Technology) {
                    tech.append("foreignObject")
                        .attr("x", px) /*the position of the text (left to right)*/
                        .attr("y", py) /*the position of the text (Up and Down)*/
                        .attr("class", "techTitle !important")
                        .attr("width", 75)
                        .append("xhtml:div")
                        .text(i._Technology.Technology);
                }
            });
            if (first) {
                //Append the month names within the arcs
                radar.selectAll(".monthText")
                    .data(segmentData)
                    .enter().append("text")
                    .attr("class", "radialText")
                    .style("text-anchor", "left") //place the text halfway on the arc
                    .attr("x", 5) //Move the text from the start angle of the arc
                    .attr("dy", -11) //Move the text down
                    .append("textPath")
                    .attr("xlink:href", function (d, i) { return "#monthArc_" + i; })
                    .text(function (d) {
                    var txt = d.title;
                    if (h.length > 10 && h.indexOf('-') > 0)
                        txt = h[0];
                    if (txt.length > 30)
                        txt = txt.substr(0, 29);
                    return txt;
                });
                first = false;
            }
            //arcPos -= (1 / this.data.horizontal.length);
            mycolor = mycolor.darker(0.5 / _this.appState.horizontal.length);
            id -= 1;
        });
        //console.log(all);
        all.forEach(function (i) {
            if (i._future) {
                var origin = _.find(all, function (item) {
                    var o = (item._Input === i._Input && item._pos != i._pos);
                    return o;
                });
                //all.forEach((origin: classes.RadarCircle) => {
                //console.log("link");
                // console.log(origin);
                // console.log(i);
                tech.append('line')
                    .style("stroke", i._color.toString())
                    .attr({
                    "class": "arrow",
                    "marker-end": "url(#arrow)",
                    "x2": i._pos[0],
                    "y2": i._pos[1],
                    "x1": origin._pos[0],
                    "y1": origin._pos[1]
                });
                //});
            }
        });
    };
    __decorate([
        bindable,
        __metadata("design:type", Object)
    ], Radar.prototype, "view", void 0);
    __decorate([
        bindable,
        __metadata("design:type", Trend)
    ], Radar.prototype, "trend", void 0);
    Radar = __decorate([
        inject(Element, ApplicationState, MessageBusService),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], Radar);
    return Radar;
}());
export { Radar };
//# sourceMappingURL=radar.js.map