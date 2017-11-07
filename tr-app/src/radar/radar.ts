import { Technology } from './../../../tr-host/src/utils/technology';

import { Trend, Example, ITechnology, WikiResult, Project, SpreadsheetService, Config, RadarInput, RadarCircle } from './../classes';
import { inject } from 'aurelia-framework';
import { bindable } from "aurelia-framework";
import { ApplicationState } from '../ApplicationState';
import { MessageBusService } from './../MessageBus'
import $ from 'jquery';
import * as _ from "lodash";

var d3 = require('d3');

@inject(Element, ApplicationState, MessageBusService)
export class Radar {
  @bindable view = "all";
  @bindable trend: Trend;

  id: string;
  heading: string = 'Radar';
  appState: ApplicationState;
  bus: MessageBusService;


  element;

  /**
   * ref element on the binding-context
   */
  image: HTMLImageElement;


  constructor(element, appState, bus) {
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
    this.bus.subscribe("filter", (title, t: Trend) => {
      switch (title) {
        case "all":
          console.log('select all');          
          this.selectAll();
          break;
        case "trend":
          this.selectTrend(t);
          break;
      }
    });
    this.bus.subscribe("reload", (title, data) => {            
      this.updateFilter();
      this.draw();
    });



  }

  selectAll() {
    this.trend = null;
    this.selectPreset(this.appState.project.presets[0]);
    this.draw();

  }

  trendChanged(newValue) {
    console.log('trend changed');
    var trend = _.find(this.appState.project.trends, t => t.id === newValue);
    if (trend) this.selectTrend(trend);
  }

  activate(parms, routeConfig) {
    console.log('Active Radar');
  }

  public selectPreset(preset: Config) {
    this.appState.activeConfig = preset;
    this.updateFilter();
  }

  private getDimensions(dim: string, reverse = false): string[] {
    var res: string[] = [];
    // dimension has been defined is lists sheet
    if (this.appState.project.dimensions.hasOwnProperty(dim)) { res = this.appState.project.dimensions[dim]; }
    else {
      // get dimensions from actual items
      this.appState.project.radarinput.forEach(ri => {
        var s = _.find(ri.Scores, { Title: dim });
        if (s && s.Value !== '') if (s && res.indexOf(s.Value) === -1) res.push(s.Value);
      });
    }
    if (reverse) return (res.reverse());
    return res;


  }

  public updateFilter() {
    this.appState.items = [];
    // if (!this.data.sheets || !this.data.sheets.RadarInput) return;

    this.appState.project.radarinput.forEach(ri => {
      var match = true;
      if (this.view === 'all' && this.appState.activeConfig && this.appState.activeConfig.Filters) {
        this.appState.activeConfig.Filters.forEach(f => {
          if (f.Enabled && f.Value && this.appState.getDimensionValue(ri, f.Dimension) !== f.Value) {
            match = false;
          }
        });
      } else {
         // match = !_.isUndefined(_.find(this.appState.activeTrend._TrendTechnologies, tt => tt._Technology === ri._Technology));
      }
      if (match) this.appState.items.push(ri);
    });
    this.appState.activeConfig.Visualisation.forEach(f => {
      switch (f.Visual) {
        case 'Horizontal':
          this.appState.horizontal = this.getDimensions(f.Dimension, f.Reverse);
          this.appState.activeConfig.horizontalDimension = f.Dimension;
          break;
        case 'Radial':
          this.appState.radial = this.getDimensions(f.Dimension, f.Reverse);
          this.appState.activeConfig.radialDimension = f.Dimension;
          break;
        case 'Color':
          this.appState.colorsD = this.getDimensions(f.Dimension, f.Reverse);
          this.appState.activeConfig.colorDimension = f.Dimension;
          break;
        case 'Size':
          this.appState.size = this.getDimensions(f.Dimension, f.Reverse);
          this.appState.activeConfig.sizeDimension = f.Dimension;
          break;
      }
    });

    // this.busService.publish('filter', 'updated');

  }

  public selectTrend(t: Trend) {
    console.log('select trend');
    // this.data = this.appState.sheets;
    this.trend = t;
    this.appState.activeTrend = t;
    if (t._Preset) {
      this.selectPreset(t._Preset);
      this.appState.activeConfig.ShowTrend = true;
    }
    else this.updateFilter();
    this.draw();
  }

  draw() {
    setTimeout(() => this.draw2(), 1);
  }

  draw2() {
    console.log('start drawing');

    if (!this.appState.radial || !this.appState.horizontal) return;
    var radial = this.appState.radial; // ["2016", "2017", "2018", "2019", "2020", "2021", "2022"];
    var horizontal = ["very low", "low", "neutral", "high", "very high"];

    // Get the dimensions of the container div
    // We set it as a square (1:1 rect)
    // So that we can easily use Viebox for making it responsive
    var container = d3.select("#techradar-vis").node()
    var width = container.getBoundingClientRect().width;
    // Scale it a bit dow in order to make it fir into the viz
    width = width * 0.85;
    var height = width;

    var radius = 12; // radius of a circle
    var thickness = 6; //thickness of a circle
    var nr_of_segments = radial.length;
    var nr_of_levels = horizontal.length;

    var rings = d3.scale.linear().domain([0, horizontal.length + 1]).range([0, radius])
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
    var svg = d3.select("#techradar-vis").append("svg")

    // Make it responsive with viewBox
    svg.attr('preserveAspectRatio', "xMinYMin meet")
      .attr("viewBox", "0 0 1000 600")
      .attr('width', '100%')

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
    var all: RadarCircle[] = [];

    var horTitlePos = 80;
    var horTitleSteps = horTitlePos / this.appState.horizontal.length;
    this.appState.horizontal.forEach(h => {
      var segmentData = [];
      var start = 0;

      this.appState.radial.forEach(r => {
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
      if (h.length > 10 && h.indexOf('-') > 0) txt = h[0];
      if (txt.length > 15) txt = txt.substr(0, 14);
      var textWidth = 75;
      horTitlePos -= horTitleSteps;

      radar.append("foreignObject")
        .attr("x", haxispos -40 - textWidth / 2) /*the position of the text (left to right)*/
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


      hpos += 1;

      var years = [2016];
      // if (this.appState.activeConfig.ShowTrend) years.push(2020);

      var its = [];

      this.appState.project.radarinput.forEach(i => {
        let techs = [];
        if (this.view === 'all' && this.appState.items) {
          techs = this.appState.items;
          
        } else if (this.appState.activeTrend) {
          techs = this.appState.activeTrend._Technologies;
        }
        if (_.findIndex(techs,(t)=> t.Technology === i.Technology)>=0)
        {
          years.forEach(y => {
            if (years.indexOf(y) >= 0) {
              var future = (years.length > 1 && years[1] === y);

              var horScore = this.appState.getDimensionScore(i, this.appState.activeConfig.horizontalDimension, y);
              if (horScore.Value === h) {
                var radScore = this.appState.getDimensionScore(i, this.appState.activeConfig.radialDimension, y);
                if (radScore) {
                  var pos = this.appState.radial.indexOf(radScore.Value);
                  if (pos !== -1) {
                    var segment = _.find(segmentData, (s => s.title === radScore.Value));
                    if (segment) {
                      segment.items.push(i);
                      let c = new RadarCircle();
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


            };
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
        .value((d) => { return d.endAngle - d.startAngle; })
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
        .on('mouseover', (d) => {
          // bus.publish("segment", "mouseover", d.data);
          if (d.parentNode) d.parentNode.appendChild(d);
          // radar.ts:367 Uncaught TypeError: Cannot read property 'appendChild' of undefined
        })

      console.log(its);
      its.forEach((i: RadarCircle) => {

        //console.log(i._segment.items.length);

        var difS = 0;
        var difE = 1;
        if (i._segment.items.length > 1) { difS = difE = (i._segmentItemPos / i._segment.items.length) * 0.9; }

        var segmentArc = d3.svg.arc()
          .innerRadius(width * depth - arcWidth)
          .outerRadius(width * depth)
          .startAngle(segment(i._segmentPos + difS))
          .endAngle(segment(i._segmentPos + difE));


        var pos = segmentArc.centroid();
        i._pos = pos;
        var color = "black";

        if (this.appState.activeConfig.colorDimension) {
          var colorValue = this.appState.getDimensionValue(i._Input, this.appState.activeConfig.colorDimension, i._year);
          if (!colorValue && i._future) colorValue = this.appState.getDimensionValue(i._Input, this.appState.activeConfig.colorDimension);
          if (colorValue && this.appState.colorsD.indexOf(colorValue) !== -1) {
            color = this.appState.colors[this.appState.colorsD.indexOf(colorValue)];
          }
        }
        i._color = color;

        let size = 10;

        if (this.appState.activeConfig.sizeDimension && this.appState.activeConfig.sizeDimension !== "-none-") {
          var sizeValue = this.appState.getDimensionValue(i._Input, this.appState.activeConfig.sizeDimension, i._year);
          var sizeIndex = this.appState.size.length - this.appState.size.indexOf(sizeValue);
          if (sizeValue && sizeIndex >= 0) {
            size = (10 / this.appState.size.length * sizeIndex) + 3;
          }
        }

        var circle = tech.append("circle")
          .attr("cx", pos[0])
          .attr("cy", pos[1])
          .attr("r", size)
          .attr("class", "techCircle")
          .style("fill", color.toString())
          .style("opacity", i._future ? 0.5 : 1)
          .on('mouseenter', (d) => {
            console.log('Enter ' + i._Technology.Technology);
          })
          .on('mouseleave', (d) => {
            console.log('Leave ' + i._Technology.Technology);
          })
          .on("mousedown", () => {
            this.bus.publish('technologysheet', 'show', i._Technology);
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
          .text((d) => {
            let txt = d.title;
            if (h.length > 10 && h.indexOf('-') > 0) txt = h[0];
            if (txt.length > 30) txt = txt.substr(0, 29);
            return txt;
          });

        first = false;
      }

      //arcPos -= (1 / this.data.horizontal.length);
      mycolor = mycolor.darker(0.5 / this.appState.horizontal.length);

      id -= 1;

    });

    //console.log(all);

    all.forEach((i: RadarCircle) => {
      if (i._future) {
        var origin = _.find(all, (item: RadarCircle) => {
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


  }
}
