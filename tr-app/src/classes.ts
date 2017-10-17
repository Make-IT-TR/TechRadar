import { Platforms } from './platforms/platforms';
import * as _ from 'lodash';

export class ProjectConfig {
  id: string;
  title: string;
}

export class Dimension {
  title: string;
  values: string[];
}

export class Project {
  id: string;
  config: ProjectConfig
  dimensions?: Dimension[];
  presets?: Config[];
  years?: number[];
  examples?: Example[];
  technologies?: ITechnology[];
  categories?: ICategory[];
  subcategories?: ISubCategory[];
  domains?: any[];
  trends?: Trend[];
  radarinput?: RadarInput[];

  linkExamples(e: Example)
  {
      e.Name = _.trim(e.Name);
      e._Technologies = [];
    
  }

  linkTechnology(t: ITechnology) {
    t._Category = _.find(this.categories, { Category: t.Category });
    t._SubCategory = _.find(this.subcategories, { SubCategory: t.SubCategory });
    t._RadarInput = [];
    t._Examples = [];
    t._Trends = [];
    t.Platforms.forEach(p => {
      let example = _.find(this.examples, { id: p });
      if (example) {
        if (!t._Examples.includes(example)) t._Examples.push(example);
        if (!example._Technologies.includes(t)) example._Technologies.push(t);
      }
    })
  }

  linkRadarInput(ri: RadarInput) {
    ri._Technology = _.find(this.technologies, { Technology: ri.Technology });
    if (ri._Technology) {
      if (!ri._Technology._RadarInput) ri._Technology._RadarInput = [];
      if (!ri._Technology._RadarInput.includes) ri._Technology._RadarInput.push(ri);
    }
  }

  linkTrend(tr: Trend) {
    tr._Preset = _.find(this.presets, { Title: tr.Preset });
    tr._Technologies = [];
    tr.Technologies.forEach(t => {
      let tech = _.find(this.technologies, { Technology: t });
      if (tech) { 
        if (!tr._Technologies.includes(tech)) tr._Technologies.push(tech); 
        if (!tech._Trends.includes(tr)) tech._Trends.push(tr); }
    })
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
    })

    this.subcategories.forEach(sc => {
      sc._Category = _.find(this.categories, { Category: sc.Category });
    })

  }
}


export class WikiResult {
  title: string;
  abstract: string;
  summary: string;
  source: string;

  constructor(public ref = []) {

  }

}

export class Vis {

  constructor(public Visual: 'Horizontal' | 'Radial' | 'Color' | 'Size', public Dimension: string, public Enabled: boolean = true, public Reverse: boolean = false) {
    if (Dimension[0] === '!') {
      this.Dimension = Dimension.replace('!', '');
      this.Reverse = true;
    }
  }
}

export class Filter {

  public Options: string[];

  constructor(public Dimension: string, public Value: string, public Enabled: boolean) {

  }
}

export class Trend {
  public id: string;
  public Name: string;
  public Description: string;
  public Preset: string;
  public Impact: string;
  public Scenario1: string;
  public Scenario2: string;
  public Refrences: string;
  public ImageUrl: string;
  public Wikipedia: string;
  public WikiResult: WikiResult;
  public Hide: boolean;
  public Order: number;
  public Technologies: string[] = [];
  public _Preset: Config;
  public _Technologies: ITechnology[];
}

export class Config {
  public id: string;
  public Title: string;
  public Description: string;
  public Type: 'Radar' | 'Bubble';
  public Visualisation: Vis[];
  public Filters: Filter[];
  public horizontalDimension: string;
  public radialDimension: string;
  public colorDimension: string;
  public sizeDimension: string;
  public ShowTrend: boolean;
  private Filter1: string;
  private Filter2: string;
  private Filter3: string;
  private Filter4: string;
}


export class Sheets {

  public Years = [2016, 2020];
  Domains: IDomain[];
  Technologies: ITechnology[];
  Categories: ICategory[];
  SubCategories: ISubCategory[];
  RadarInput: RadarInput[];
  Examples: Example[] = [];
  Dimensions: string[] = ["-none-"];
  Trends: Trend[];
  Presets: Config[];
  Wiki: { [url: string]: WikiResult };
}

export class InputScore {

  Title: string;
  Year: number;
  Score: string;
  Value: string;
  Description: string;

  constructor(title: string, obj: any, sheet: Sheets, description?: string) {
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
    if (sheet.Dimensions.indexOf(this.Title) === -1) sheet.Dimensions.push(this.Title);
  }

}

export class RadarCircle {
  _segment: any;
  _future: boolean;
  _segmentPos: number;
  _segmentItemPos: number;
  _pos: any;
  _year: number;
  _color: string;
  _Input: RadarInput;
  _Technology: ITechnology;
  _horScore: InputScore;
  _radScore: InputScore;
}

export class RadarInput {
  id: string;
  Technology: string;
  Users: string;
  Description: string;
  Scores: InputScore[];
  Examples: string;
  Remarks: string;
  Trend: string;
  _Technology: ITechnology;
  _Examples: Example[];
  _segment: any;
  _future: boolean;
  _segmentPos: number;
  _segmentItemPos: number;
  _pos: any;
  _color: string;

  constructor(input: any, sheet: Sheets) {
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

  public getDimensionValue(title: string, year?: number) {
    if (_.isUndefined(year)) year = 2016;
    var score = _.find(this.Scores, s => { return s.Title === title && (!s.Year || s.Year === year); });
    if (score) return score.Value;
    return null;
  }


}


export interface IDomain {
  Title: string;
}

export interface ITag {
  id: string;
  type: string;
}

export interface ITechnology {
  id: string;
  Technology: string;
  Description: string;
  Category: string;
  SubCategory: string;
  Wikipedia: string;
  WikiResult: WikiResult;
  Tags: ITag[];
  Platforms: string[];

  _Examples: Example[];
  _Trends: Trend[];
  _Category: ICategory;
  _SubCategory: ISubCategory;
  _RadarInput: RadarInput[];

}

export interface ICategory {
  Category: string;
  Domain: string;
  Description: string;
  Wikipedia: string;
  WikiResult: WikiResult;
  Hide: boolean;
}

export interface ISubCategory {
  SubCategory: string;
  Category: string;
  _Category: ICategory;
  Description: string;
}

export interface ISpreadsheetRow {
  Category: string;
  Relevance: number;
  Thumbnail: string;
  TimeCategory: string;
  DeltaTime: string | number;
  ShortTitle: string;
  Title: string;
  Text: string;
  Subtitle: string;
  ContentType: string;
  Content: string;
}

export class Example {
  id: string;
  Name: string;
  Url: string;
  Icon: string;
  Featured: number;
  Description: string;
  Webshot: string;
  Wikipedia: string;
  WikiResult: WikiResult;
  Removed: boolean;
  _isNew: boolean;
  _Technologies: ITechnology[];

  constructor(i: string) {
    this._Technologies = [];
    this.Featured = 0;
    if (i.indexOf('[') >= 0) {
      var result = /(.*)\[(.*)\]/.exec(i);
      if (result && result.length > 2) {
        this.Name = result[1];
        this.Url = result[2];
      } else {
        this.Name = i;
      }
    }
    else {
      this.Name = i;
      this.Url = "http://www." + i.trim() + ".com";
    }


  }
}


export class SpreadsheetService {
  public sheets: Sheets;
  public activeConfig: Config;
  public activeTrend: Trend;
  public presets: Config[];
  public horizontal: string[];
  public radial: string[];
  public colors: string[];
  public size: string[];
  public items: RadarInput[];
  public dimensions: { [dimension: string]: string[] } = {};
  public db;

  public initConfig(config: Config) {

    config.Visualisation = [];
    // config.Visualisation.push(new Vis("Horizontal", "Adoption", false,false));
    // config.Visualisation.push(new Vis("Radial", "Category", false));
    // config.Visualisation.push(new Vis("Color", "TRL", false));
    // config.Visualisation.push(new Vis("Size", "TRL", false));
  }





  private parseLists(lists: any) {
    var cn = lists.columnNames;
    var count = 0;
    cn.forEach(c => {
      this.dimensions[c] = [];
    });
    lists.elements.forEach(e => {
      for (var c in this.dimensions) {
        if (e.hasOwnProperty(c) && e[c] !== "") this.dimensions[c].push(e[c]);
      }
    })
    //console.log(this.dimensions);
  }

  private cloneWithoutUnderscore(v: any): any {
    if (typeof v !== 'object') return v;
    if (v instanceof Array) {
      var a = [];
      v.forEach((i) => {
        a.push(this.cloneWithoutUnderscore(i));
      });
      return a;
    } else {
      var c = {};
      for (var k in v) {
        if (k[0] !== '_') c[k] = this.cloneWithoutUnderscore(v[k]);
      }
      return c;
    }
  }

  private parseFilter(filter: string): Filter {
    if (filter.indexOf('=') > 0) {
      var ff = filter.split('=');
      var f = new Filter(ff[0], ff[1], true);
      return f;
    }
    return null;
  }

  private sdbmCode(str) {
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


}
