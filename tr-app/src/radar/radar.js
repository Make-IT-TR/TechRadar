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
import { bindable } from "aurelia-framework";
import { ApplicationState } from './ApplicationState';
var _ = require('lodash');
import $ from 'jquery';
var d3 = require('d3');
var Radar = (function () {
    function Radar(element, appState) {
        this.heading = 'Radar';
        this.element = element;
        this.appState = appState;
    }
    Radar.prototype.trendChanged = function (newValue) {
        var trend = _.find(this.appState.trends, function (t) { return t.Id === newValue; });
        if (trend)
            this.selectTrend(trend);
    };
    Radar.prototype.activate = function (parms, routeConfig) {
    };
    Radar.prototype.selectPreset = function (preset) {
        this.data.activeConfig = preset;
        this.updateFilter();
    };
    Radar.prototype.getDimensions = function (dim, reverse) {
        if (reverse === void 0) { reverse = false; }
        var res = [];
        // dimension has been defined is lists sheet
        if (this.data.dimensions.hasOwnProperty(dim)) {
            res = this.data.dimensions[dim];
        }
        else {
            // get dimensions from actual items
            this.data.items.forEach(function (ri) {
                var s = _.find(ri.Scores, { Title: dim });
                if (s && s.Value !== '')
                    if (s && res.indexOf(s.Value) === -1)
                        res.push(s.Value);
            });
        }
        if (reverse)
            res.reverse();
        return res;
    };
    Radar.prototype.updateFilter = function () {
        var _this = this;
        this.data.items = [];
        if (!this.data.sheets || !this.data.sheets.RadarInput)
            return;
        this.data.sheets.RadarInput.forEach(function (ri) {
            var match = true;
            if (_this.data.activeTrend) {
                match = !_.isUndefined(_.find(_this.data.activeTrend._TrendTechnologies, function (tt) { return tt._Technology === ri._Technology; }));
            }
            _this.data.activeConfig.Filters.forEach(function (f) {
                if (f.Enabled && f.Value && _this.appState.getDimensionValue(ri, f.Dimension) !== f.Value)
                    match = false;
            });
            if (match)
                _this.data.items.push(ri);
        });
        this.data.activeConfig.Visualisation.forEach(function (f) {
            switch (f.Visual) {
                case 'Horizontal':
                    _this.data.horizontal = _this.getDimensions(f.Dimension, f.Reverse);
                    _this.data.activeConfig.horizontalDimension = f.Dimension;
                    break;
                case 'Radial':
                    _this.data.radial = _this.getDimensions(f.Dimension, f.Reverse);
                    _this.data.activeConfig.radialDimension = f.Dimension;
                    break;
                case 'Color':
                    _this.data.colors = _this.getDimensions(f.Dimension, f.Reverse);
                    _this.data.activeConfig.colorDimension = f.Dimension;
                    break;
                case 'Size':
                    _this.data.size = _this.getDimensions(f.Dimension, f.Reverse);
                    _this.data.activeConfig.sizeDimension = f.Dimension;
                    break;
            }
        });
        // this.busService.publish('filter', 'updated');
    };
    Radar.prototype.selectTrend = function (t) {
        this.data = this.appState.sheets;
        this.data.activeTrend = t;
        if (t._Preset)
            this.selectPreset(t._Preset);
        this.updateFilter();
        this.draw();
    };
    Radar.prototype.draw = function () {
        var _this = this;
        var c10 = d3.scale.category10();
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        if (!this.data.radial || !this.data.horizontal)
            return;
        var radial = this.data.radial; // ["2016", "2017", "2018", "2019", "2020", "2021", "2022"];
        var horizontal = ["very low", "low", "neutral", "high", "very high"];
        var radius = 400; // radius of a circle
        var thickness = 6; //thickness of a circle
        var nr_of_segments = radial.length;
        var nr_of_levels = horizontal.length;
        var origin_x = 10; // distance to the right from left top
        var origin_y = 1; // distance from the top from left top
        var rings = d3.scale.linear().domain([0, horizontal.length + 1]).range([0, radius]);
        var padding_rings = rings(1); // distance between rings
        var _outer_radius = radius;
        var _inner_radius = radius - thickness;
        var _start_angle = -0.5 * Math.PI;
        var _end_angle = 0.5 * Math.PI;
        var degrees = d3.scale.linear().domain([0, 180]).range([_start_angle, _end_angle]);
        var start_angle = degrees(0);
        var end_angle = degrees(180);
        var _origin_x_offset = origin_x + radius;
        var _origin_y_offset = origin_y + radius;
        var segment = d3.scale.linear().domain([0, nr_of_segments]).range([start_angle, end_angle]);
        // var width = _origin_x_offset * 2;
        // var height = _origin_y_offset * 2;
        var margin = { left: 100, top: 200, right: 100, bottom: 50 };
        var width = 1000; // Math.max(screenWidth, 900) - margin.left - margin.right;
        var height = 900; //Math.max(screenHeight, 600) - margin.top - margin.bottom;
        $(this.element).append("<div id='radarvis' style='position:absolute'></div>");
        $(this.element).append("<div id='technology' style='position:absolute'></div>");
        var radar = d3.select("#radarvis").append("svg")
            .attr("width", (width + margin.left + margin.right))
            .attr("height", (height + margin.top + margin.bottom))
            .append("g").attr("class", "wrapper")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
        var tech = d3.select("#technology").append("svg")
            .attr("width", (width + margin.left + margin.right))
            .attr("height", (height + margin.top + margin.bottom))
            .append("g").attr("class", "wrapper")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
        var radial = this.data.radial; // ["2016", "2017", "2018", "2019", "2020", "2021", "2022"];
        var horizontal = this.data.horizontal; //["very low", "low", "neutral", "high", "very high"];
        var step = 180 / nr_of_segments;
        var minDepth = 0.25;
        var arcDepth = (0.95 - minDepth) / this.data.horizontal.length;
        var arcWidth = width / 2 / horizontal.length * (0.95 - minDepth);
        var first = true;
        var id = this.data.horizontal.length;
        var mycolor = d3.rgb("#eee");
        var hpos = 1;
        this.data.horizontal.forEach(function (h) {
            var segmentData = [];
            var start = 0;
            _this.data.radial.forEach(function (r) {
                segmentData.push({ title: r, startAngle: start, endAngle: start + step, items: [] });
                start += step;
            });
            var haxispos = -((arcWidth * (horizontal.length - hpos + 1) - arcWidth / 4 + _inner_radius / 4));
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
            radar.append("foreignObject")
                .attr("x", haxispos - 75 / 2) /*the position of the text (left to right)*/
                .attr("y", 20) /*the position of the text (Up and Down)*/
                .attr("class", "horizontalTitle")
                .attr("width", 75)
                .append("xhtml:div")
                .text(txt);
            radar.append("foreignObject")
                .attr("x", -haxispos - 75 / 2) /*the position of the text (left to right)*/
                .attr("y", 20) /*the position of the text (Up and Down)*/
                .attr("class", "horizontalTitle")
                .attr("width", 75)
                .append("xhtml:div")
                .text(txt);
            hpos += 1;
            var years = [2016, 2020];
            var items = [];
            _this.data.items.forEach(function (i) {
                var f = null;
                years.forEach(function (y) {
                    var future = (years.length > 1 && years[1] === y);
                    var horValue = _this.appState.getDimensionValue(i, _this.data.activeConfig.horizontalDimension, y);
                    if (horValue === h) {
                        var radValue = _this.appState.getDimensionValue(i, _this.data.activeConfig.radialDimension, y);
                        var pos = _this.data.radial.indexOf(radValue);
                        if (pos !== -1) {
                            var segment = _.find(segmentData, (function (s) { return s.title === radValue; }));
                            if (segment) {
                                segment.items.push(i);
                                i._future = future;
                                i._segment = segment;
                                i._segmentPos = pos;
                                i._segmentItemPos = segment.items.length;
                                items.push(i);
                                f = i;
                            }
                        }
                    }
                });
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
                .on('mouseover', function (d) {
                // bus.publish("segment", "mouseover", d.data);
                d.parentNode.appendChild(d);
            });
            items.forEach(function (i) {
                //console.log(i._segment.items.length);
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
                if (_this.data.activeConfig.colorDimension) {
                    var colorValue = _this.appState.getDimensionValue(i, _this.data.activeConfig.colorDimension);
                    if (colorValue && _this.data.colors.indexOf(colorValue) !== -1) {
                        color = c10(_this.data.colors.indexOf(colorValue).toString());
                    }
                }
                i._color = color;
                var size = 10;
                if (_this.data.activeConfig.sizeDimension && _this.data.activeConfig.sizeDimension !== "-none-") {
                    var sizeValue = _this.appState.getDimensionValue(i, _this.data.activeConfig.sizeDimension);
                    var sizeIndex = _this.data.size.length - _this.data.size.indexOf(sizeValue);
                    if (sizeValue && sizeIndex >= 0) {
                        size = (15 / _this.data.size.length * sizeIndex) + 5;
                    }
                }
                var circle = tech.append("circle")
                    .attr("cx", pos[0])
                    .attr("cy", pos[1])
                    .attr("r", size)
                    .attr("class", "techCircle")
                    .style("fill", color.toString())
                    .style("opacity", i._future ? 0.5 : 1)
                    .on("mousedown", function () {
                    // bus.publish('radarinput', 'selected', i);
                });
                // var text = svg.append("text")
                //     .attr("x", pos[0])
                //     .attr("y", pos[1] + size + 15)
                //     .style("z-index", 100)
                //     .attr("text-anchor", "middle")
                //     .text(i.Technology);
                var px = pos[0] - 75 / 2;
                var py = pos[1] + size + 5;
                if (!i._future) {
                    tech.append("foreignObject")
                        .attr("x", px) /*the position of the text (left to right)*/
                        .attr("y", py) /*the position of the text (Up and Down)*/
                        .attr("class", "techTitle !important")
                        .attr("width", 75)
                        .append("xhtml:div")
                        .text(i.Technology);
                }
            });
            // items.forEach((i: csComp.Services.RadarInput) => {
            //     if (i._future) {
            //         var origin = _.find(items, (item: csComp.Services.RadarInput) => item._Technology === item._Technology);
            //         if (origin) {
            //             tech.append('line')
            //                 .style("stroke", i._color.toString())
            //                 .attr({
            //                     "class": "arrow",
            //                     "marker-end": "url(#arrow)",
            //                     "x1": i._pos[0],
            //                     "y1": i._pos[1],
            //                     "x2": origin._pos[0],
            //                     "y2": origin._pos[1]
            //                 });
            //         }
            //     }
            // });
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
                    return d.title;
                });
                first = false;
            }
            //arcPos -= (1 / this.data.horizontal.length);
            mycolor = mycolor.darker(0.5 / _this.data.horizontal.length);
            id -= 1;
        });
    };
    return Radar;
}());
__decorate([
    bindable,
    __metadata("design:type", Object)
], Radar.prototype, "trend", void 0);
Radar = __decorate([
    inject(Element, ApplicationState),
    __metadata("design:paramtypes", [Object, Object])
], Radar);
export { Radar };
