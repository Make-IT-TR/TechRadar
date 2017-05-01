
var _ = require('lodash');

export module classes {

  export class WikiResult {
    title: string;
    abstract: string;
    summary: string;
    source: string;

    constructor(public ref = []) {
        
    }

}

  export class Content {

    public isSelected: boolean;
    public previewImage: string;
    public videoUrl: string;

    constructor(
      public id: number,
      public contentType: string,
      public content: string,
      public subTitle: string

    ) {


    }
  }

  /** description of a technology  */
  export class Technology {

    public content: Content[] = [];

    constructor(
      public id: number,
      public priority: number,
      public category: string,
      public thumbnail: string,
      public timePeriod: string,
      public relativeRadius: number,
      public shortTitle: string,
      public Wikipedia: string,
      public title: string,
      public subTitle: string,
      public text: string,
      public color: string,
      public visible: boolean = true,
      public focus: boolean = false
    ) {
      this.content = [];
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
    public Id: string;
    public Name: string;
    public Description: string;
    public Preset: string;
    public Impact: string;
    public Scenario1: string;
    public Scenario2: string;
    public Refrences: string;
    public Wikipedia:string;
    public Hide:boolean;
    public Order: number;
    public _Preset: Config;
    public _TrendTechnologies: TrendTechnology[];
  }

  export class TrendTechnology {
    public Trend: string;
    public Technology: string;
    public Remark: string;
    public _Trend: Trend;
    public _Technology: ITechnology;
  }

  export class Config {
    public Title: string;
    public Description: string;
    public Type: 'Radar' | 'Bubble';
    public Visualisation: Vis[];
    public Filters: Filter[];
    public horizontalDimension: string;
    public radialDimension: string;
    public colorDimension: string;
    public sizeDimension: string;
    public ShowTrend : boolean = true;
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
  }

  export class InputScore {

    Title: string;
    Year: number;
    Score: string;
    Value: string;
    Description: string;
    _Circle: RadarCircle;




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
    _Technology : ITechnology;
    _horScore : InputScore;
    _radScore : InputScore;
  }

  export class RadarInput {
    Technology: string;
    Users: string;
    Description: string;
    Scores: InputScore[];
    Examples: string;
    Remarks: string;
    Trend: string;
    _Technology: ITechnology;
    _Examples: Example[];


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
      this.Scores.push(new InputScore("Perez Technological Revolution 2020", input, sheet));
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

export interface ITechnology {
        id: string;
        Technology: string;
        Description: string;
        Category: string;
        SubCategory: string;
        Examples: string;
        Wikipedia: string;

        _Examples: Example[];
        _Category: ICategory;
        _SubCategory: ISubCategory;
        _RadarInput: RadarInput[];
        _TrendTechnologies: TrendTechnology[];
    }

  export interface ICategory {
    Category: string;
    Domain: string;
    Description: string;
    Wikipedia: string;
    Hide:boolean;
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
    Name: string;
    Url: string;
    Icon: string;
    Featured: number;
    Description: string;
    Webshot: string;
    Wikipedia: string;
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
        this.Url = "http://" + i + ".com";
      }


    }
  }


  export class SpreadsheetService {
    public technologies: Technology[];
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





  }
}

