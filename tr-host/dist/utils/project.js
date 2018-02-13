"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes = require("./classes");
const CircularJSON = require("circular-json");
const wikiUtils = require('./wikipedia');
const feathers = require('feathers');
var fs = require('fs');
exports.public_spreadsheet_url = "https://docs.google.com/spreadsheets/d/1GE7VF6CSHnE2LonjliJam1HR6kqA5eC-CeJGRXgwtx0/pubhtml"; // "https://docs.google.com/spreadsheets/d/1XAlka6VcJ99f8A2jUlLVqvg-juUdHdf0iGuSMYTtJvM/pubhtml";
function importSheet(project) {
    let sheet = new classes.SpreadsheetService();
    sheet.loadTechnologies(exports.public_spreadsheet_url, () => {
        console.log('Saving sheet file');
        const file = 'projects/' + project + '/all.json';
        fs.writeFile(file, CircularJSON.stringify(sheet), (err) => {
            if (err)
                console.log('Error writing sheet file at ' + process.env.SHEET_FILE + ' (' + err + ')');
            convert(sheet, project);
        });
    });
}
exports.importSheet = importSheet;
function exportJson(sheet, project) {
    console.log('Exporting');
    let r = { config: { id: 'makeit', title: 'make-it' }, id: 'makeit' };
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
        });
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
        if (err)
            console.log('Error writing sheet file at ' + process.env.SHEET_FILE + ' (' + err + ')');
    });
}
function createTags(project) {
    project.technologies.forEach(t => {
        t.Tags = [];
        t.Tags.push({ id: t.Category, type: 'category' });
        if (t.SubCategory) {
            t.Tags.push({ id: t.SubCategory, type: 'subcategory' });
        }
    });
}
function convert(sheet, project) {
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
        });
    });
}
function loadProject(projectid, callback) {
    const file = process.env.FOLDER + '/projects/' + projectid + '/new.json';
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log('Error writing sheet file at ' + process.env.SHEET_FILE + ' (' + err + ')');
            callback(null);
            return null;
        }
        let d = JSON.parse(data);
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
exports.loadProject = loadProject;
// updateRadarShots(project),
// updateScreenshots(project)
function cleanJSON(j) {
    let keys = [];
    for (var k in j) {
        if (k[0] === '_')
            keys.push(k);
    }
    keys.forEach(k => delete j[k]);
    return j;
}
//# sourceMappingURL=project.js.map