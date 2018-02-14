
import { ICategory } from './classes';
import _ = require('lodash');
import Tabletop = require('tabletop');
import TechRadar = require('./technology');
import CircularJSON = require('circular-json');

export class ProjectConfig {
    id: string;
    title: string;
}

export class Project {
    id: string;
    config: ProjectConfig
    dimensions?: any;
    presets?: Config[];
    years?: number[];
    examples?: Example[];
    technologies?: ITechnology[];
    categories?: ICategory[];
    subcategories?: ISubCategory[];
    domains?: any[];
    trends?: Trend[];

    radarinput?: RadarInput[];

}

export function linkObjects(project: Project) {
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
}

export class TrendTechnology {
    public Trend: string;
    public Technology: string;
    public Remark: string;
    public _Trend: Trend;
    public _Technology: ITechnology;
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
    TrendTechnologies: TrendTechnology[] = [];
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

export class RadarInput {
    Technology: string;
    Users: string;
    Description: string;
    Scores: InputScore[];
    Examples: string;
    Platforms: string[];
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
    Id: string;
    Technology: string;
    Description: string;
    Category: string;
    SubCategory: string;
    Examples: string;
    Platforms: string[];
    Wikipedia: string;
    WikiResult: WikiResult;
    Tags: ITag[];

    _Examples: Example[];
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
    WebshotFailed: boolean;
    Wikipedia: string;
    WikiLookup: string;
    WikiResult: WikiResult;
    DateAdded: number;
    DateUpdated: number;

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
    public technologies: TechRadar.Technology[];
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

    /** Load the technologies */
    public loadTechnologies(url: string, callback: () => void) {


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

    private parseLists(lists: any) {
        var cn = lists.columnNames;
        console.log(cn);
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

    private parseTechnologies(r, callback) {
        this.sheets = new Sheets();
        this.sheets.Technologies = r.Technologies.elements;
        this.sheets.Categories = _.filter(r.Categories.elements, (c: ICategory) => { return !c.Hide; });
        this.sheets.SubCategories = r.SubCategories.elements;
        this.sheets.RadarInput = [];
        this.sheets.Domains = [];

        this.sheets.Categories.forEach(c => {
            if (_.findIndex(this.sheets.Domains, d => d.Title === c.Domain) === -1) { this.sheets.Domains.push(<IDomain>{ Title: c.Domain }) }
        })

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

            if (p.Filter1) { c.Filters.push(this.parseFilter(p.Filter1)); }
            if (p.Filter2) { c.Filters.push(this.parseFilter(p.Filter2)); }
            if (p.Filter3) { c.Filters.push(this.parseFilter(p.Filter3)); }

            this.presets.push(c);
        });
        if (this.presets.length > 0) {
            this.activeConfig = this.presets[0];
        } else {
            this.activeConfig = new Config();
            this.presets.push(this.activeConfig);
            this.initConfig(this.activeConfig);
        }

        this.sheets.Trends = _.filter(r.Trends.elements, (t: Trend) => { return !t.Hide; }); //r.Trends.elements;
        this.sheets.Trends.forEach(t => {
            t.id = t['Id'];
            delete t['Id'];
            if (t.Preset) { t._Preset = _.find(this.presets, (p) => p.Title === t.Preset); }
            t.Technologies = [];
        })

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
                })


                //existingExample = _.find(this.sheets.Examples, (ex) => ((ex.Url && example.Url && ex.Url.toLowerCase() === example.Url.toLowerCase())) || (!ex.Url && ex.Name && example.Name && ex.Name.toLowerCase() === example.Name.toLowerCase()))
                if (existingExample) {
                    if (!existingExample.Featured) existingExample.Featured = 0;
                    t._Examples.push(existingExample);
                    if (existingExample._Technologies && existingExample._Technologies.indexOf(t) === -1) { existingExample._Technologies.push(t); }
                } else {
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
                if (ri.Technology === '') ri.Technology = lastTech;
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
                    })
                    if (ri._Technology && !ri._Technology._Examples) ri._Technology._Examples = [];

                    //existingExample = _.find(this.sheets.Examples, (ex) => ((ex.Url && example.Url && ex.Url.toLowerCase() === example.Url.toLowerCase())) || (!ex.Url && ex.Name && example.Name && ex.Name.toLowerCase() === example.Name.toLowerCase()))
                    if (existingExample) {
                        if (!existingExample.Featured) existingExample.Featured = 0;
                        ri._Examples.push(existingExample);

                        if (ri._Technology) ri._Technology._Examples.push(existingExample);
                        if (existingExample._Technologies && existingExample._Technologies.indexOf(ri._Technology) === -1) { existingExample._Technologies.push(ri._Technology); }
                    } else {
                        example._Technologies.push(ri._Technology);
                        this.sheets.Examples.push(example);
                        if (ri._Technology) ri._Technology._Examples.push(example);
                        ri._Examples.push(example);
                    }
                });


                if (ri._Technology && !ri.Description) ri.Description = ri._Technology.Description;

                if (!ri.Description) ri.Description = ri.Technology;

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
        this.presets.forEach(p => { if (!p.Filters) { p.Filters = [] } });
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
                        if (v && f.Options.indexOf(v) === -1) f.Options.push(v);
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
            ti+=1;

        });

        //console.log(res);
        //     console.log(JSON.stringify(exportExamples));
        var ee = "";
        this.sheets.Examples.forEach(e => {
            e.Name = e.Name.replace(/^\s*|\s*$/,"").trim();
            if (e.Name === "") e.Name = e.Url;
            ee += e.Name + ';' + (e.Description || '') + ';' + (e.Url || '') + ';' + (e.Featured || '0') + ';' + (e.Description || '') + ';' + (e.Icon || '') + '\n';
        });

        this.sheets.Technologies.forEach(t => {
            t.Platforms = [];
            if (t._Examples) {
                t._Examples.forEach(e => {
                    if (e.Name!=="" && e.Name!=="http://www..com" && t.Platforms.indexOf(e.id) === -1) t.Platforms.push(e.id);
                })
            };
            // t.Examples = [];
        });



        var res = JSON.stringify(this.cloneWithoutUnderscore(this.sheets));
        //console.log(ee);

        callback();
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
    private loadSheet(url: string, callback: (sheet: any) => void) {
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
