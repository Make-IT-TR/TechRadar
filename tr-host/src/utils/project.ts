import classes = require('./classes');
import CircularJSON = require('circular-json');
const wikiUtils = require('./wikipedia');
const feathers = require('feathers');
var fs = require('fs');
export const public_spreadsheet_url = "https://docs.google.com/spreadsheets/d/1GE7VF6CSHnE2LonjliJam1HR6kqA5eC-CeJGRXgwtx0/pubhtml"; // "https://docs.google.com/spreadsheets/d/1XAlka6VcJ99f8A2jUlLVqvg-juUdHdf0iGuSMYTtJvM/pubhtml";

export function importSheet(project: string) {
    let sheet = new classes.SpreadsheetService();
    sheet.loadTechnologies(public_spreadsheet_url, () => {
        console.log('Saving sheet file');
        const file = 'projects/' + project + '/all.json';
        fs.writeFile(file, CircularJSON.stringify(sheet), (err) => {
            if (err) console.log('Error writing sheet file at ' + process.env.SHEET_FILE + ' (' + err + ')');
            convert(sheet, project);
        })

    });
}


function exportJson(sheet: classes.SpreadsheetService, project: string) {
    console.log('Exporting');
    let r: classes.Project = { config: { id: 'makeit', title: 'make-it' }, id: 'makeit' };
    r.dimensions = sheet.dimensions;
    r.presets = sheet.presets;
    r.years = sheet.sheets.Years;
    sheet.sheets.Examples.forEach(e => {
        e = cleanJSON(e);
    });
    r.examples = sheet.sheets.Examples;

    sheet.sheets.Technologies.forEach(e => {
        e = cleanJSON(e);
    });
    r.technologies = sheet.sheets.Technologies;
    r.categories = sheet.sheets.Categories;
    r.subcategories = sheet.sheets.SubCategories;
    r.domains = sheet.sheets.Domains;
    sheet.sheets.Trends.forEach(t => {
        t.Technologies = [];

        sheet.sheets.TrendTechnologies.forEach(tt => {
            if (tt.Trend === t.id) {
                t.Technologies.push(tt.Technology);
            }
        })
        t = cleanJSON(t);
    });
    r.trends = sheet.sheets.Trends;

    // console.log(sheet.sheets.RadarInput);
    sheet.sheets.RadarInput.forEach(e => {
        e = cleanJSON(e);
    });
    r.radarinput = sheet.sheets.RadarInput;
    // cleanJSON(sheet.sheets.Examples);
    createTags(r);
    const file = 'projects/' + project + '/new.json';
    fs.writeFile(file, JSON.stringify(r, null, 2), (err) => {
        if (err) console.log('Error writing sheet file at ' + process.env.SHEET_FILE + ' (' + err + ')');
    })


}

function createTags(project: classes.Project) {
    project.technologies.forEach(t => {
        t.Tags = [];
        t.Tags.push({ id: t.Category, type: 'category' });
        if (t.SubCategory) {
            t.Tags.push({ id: t.SubCategory, type: 'subcategory' });
        }
    });
}

function convert(sheet: classes.SpreadsheetService, project: string) {
    console.log('Converting...');
    const file = process.env.FOLDER + '/projects/' + project + '/all.json';
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log('Error writing sheet file at ' + process.env.SHEET_FILE + ' (' + err + ')');
            return null;
        }
        sheet = CircularJSON.parse(data);
        wikiUtils.updateWikipedia(sheet, project, () => {
            exportJson(sheet, project);
        })

    });
}


export function loadProject(projectid, callback: Function) {
    const file = process.env.FOLDER + '/projects/' + projectid + '/new.json';
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log('Error writing sheet file at ' + process.env.SHEET_FILE + ' (' + err + ')');
            callback(null);
            return null;
        }
        let d = <classes.Project>JSON.parse(data);

        // classes.linkObjects(d);
        callback(d);
        // async.parallel([
        //     (cb) => { updateWikipedia(project, cb) },
        //     (cb) => { updateRadarShots(project, cb) }
        //     // ,(cb) => { updateScreenshots(project, cb)}
        // ], (err, results) => {
        //     console.log('Project loaded');
        // });
    });
}
// updateRadarShots(project),
// updateScreenshots(project)





function cleanJSON(j: any): any {
    let keys = [];
    for (var k in j) { if (k[0] === '_') keys.push(k); }
    keys.forEach(k => delete j[k]);
    return j;
}
