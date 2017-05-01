import { Platforms } from './platforms/platforms';
import { Trends } from './trends/trends';
import { lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { classes } from './classes';
var _ = require('lodash');
import { MessageBusService } from './MessageBus';

var CircularJSON = require('circular-json');

// polyfill fetch client conditionally
const fetchPolyfill = !self.fetch ? System.import('isomorphic-fetch') : Promise.resolve(self.fetch);


export class ApplicationState {

  public trends: Array<classes.Trend> = [];
  public platforms: Array<classes.Example> = [];
  public sheets: classes.SpreadsheetService;
  public data: classes.SpreadsheetService;
  public dimensions = [];
  public colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
  public wiki: { [url: string]: classes.WikiResult };

  baseUrl = '';

  _loadingSheets: boolean;

  http: HttpClient;


  constructor( @lazy(HttpClient) private getHttpClient: () => HttpClient) { }

  async loadSheets(): Promise<void> {
    if (!this._loadingSheets && !this.sheets) {
      await fetchPolyfill;
      const http = this.http = this.getHttpClient();

      http.configure(config => {
        config
          .useStandardConfiguration()
          .withBaseUrl(this.baseUrl);
      });

      const response = await http.fetch('sheets.json?time=' + new Date().getTime());
      var text = await response.text();
      this.sheets = await CircularJSON.parse(text);
      this.data = this.sheets;

      this.trends = await this.sheets.sheets.Trends;
      this.platforms = await this.sheets.sheets.Examples;
      this.dimensions = this.sheets.sheets.Dimensions;

      //TODO: find empty example categories and hide them in platform view
      // this.sheets.sheets.Categories.forEach(c=>{
      //   this.platforms.find(p=>p.)
      // });

      await this.loadWiki().then(() => {
        console.log('got wiki');
      })
    }
  }

  async loadWiki(): Promise<void> {
    console.log('Loading wiki');
    if (!this.wiki) {
      await fetchPolyfill;
      const http = this.http = this.getHttpClient();

      http.configure(config => {
        config
          .useStandardConfiguration()
          .withBaseUrl(this.baseUrl);
      });

      const response = await http.fetch('wiki.json');
      var text = await response.text();
      this.wiki = await JSON.parse(text);
      console.log('Got wiki');

    }
  }

  public getTechExamples(tech: classes.ITechnology) {
    let examples : classes.Example[] = [];
    examples = _.union(tech._Examples);
    tech._RadarInput.forEach(ri => examples = _.union(examples, ri._Examples));
    return examples;
  }

   public getTrendExamples(trend: classes.Trend) {
    let examples : classes.Example[] = [];
    trend._TrendTechnologies.forEach(tt=>{
      let tech = tt._Technology;
      examples = _.union(examples,tech._Examples);
      tech._RadarInput.forEach(ri => examples = _.union(examples, ri._Examples));
    })
    return examples;
  }

  public getDimensionValue(input: classes.RadarInput, title: string, year?: number) {
    if (_.isUndefined(year)) year = 2016;
    var score = _.find(input.Scores, s => { return s.Title === title && (!s.Year || s.Year === year); });
    if (score) return score.Value;
    return null;
  }

  public getDimensionScore(input: classes.RadarInput, title: string, year?: number): classes.InputScore {
    if (_.isUndefined(year)) year = 2016;
    var score = _.find(input.Scores, s => { return s.Title === title && (!s.Year || s.Year === year); });
    if (score) return score;
    return null;
  }

  public selectPlatform(platform: classes.Example) {
    window.open(platform.Url, 'platformResult');
  }

}
