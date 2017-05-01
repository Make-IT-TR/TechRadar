import classes = require('./classes');
import express = require('express');
import async = require('async');
import CircularJSON = require('circular-json');
var _ = require('lodash');
var SparqlClient = require('sparql-client');
var endpoint = 'http://dbpedia.org/sparql';

require('dotenv').config();
var webshot = require('webshot');
var fs = require('fs');

var public_spreadsheet_url = "https://docs.google.com/spreadsheets/d/1GE7VF6CSHnE2LonjliJam1HR6kqA5eC-CeJGRXgwtx0/pubhtml"; // "https://docs.google.com/spreadsheets/d/1XAlka6VcJ99f8A2jUlLVqvg-juUdHdf0iGuSMYTtJvM/pubhtml";
var wikipedia = require("node-wikipedia");
var sheet = new classes.SpreadsheetService();
var app = express();

function getDBPedia(url: string) {
    if (url.indexOf('wikipedia') != -1) {
        var parts = url.split('/');
        var title = parts[parts.length - 1];
        url = 'http://dbpedia.org/resource/' + title;
        return url;
    } else if (url.indexOf('dbpedia.org') != -1) {
        return url;
    } else {
        url = 'http://dbpedia.org/resource/' + url.replace(/ /g, '_');
        return url;
    }
}



function getValue(element, url, p, DBPResult, f, lang = true) {
    if ((element.s.value === url) && (element.p.value === p) && (!lang || (element.o.lang === "en"))) {
        if (_.isArray(DBPResult[f])) {
            DBPResult[f].push(element.o.value);
        }
        else {
            DBPResult[f] = element.o.value;
        }
    }
}

function summary(url, results) {
    var res = <classes.WikiResult>{};
    res.ref = [];
    results.results.bindings.forEach(element => {
        getValue(element, url, "http://dbpedia.org/ontology/abstract", res, "abstract");
        getValue(element, url, "http://www.w3.org/2000/01/rdf-schema#label", res, "title");
        getValue(element, url, "http://www.w3.org/2000/01/rdf-schema#comment", res, "summary");
        getValue(element, url, "http://xmlns.com/foaf/0.1/isPrimaryTopicOf", res, "source", false);
        getValue(element, url, "http://dbpedia.org/ontology/wikiPageExternalLink", res, "ref");
    });
    return res;
}


function getWiki(wikiUrl: string, callback: Function) {
    let url = getDBPedia(wikiUrl);
    var id = sdbmCode(url);
    var file = process.env.WIKI + id + ".json";

    if (!fs.existsSync(file)) {
        var sparqlQuery = 'DESCRIBE <{{url}}>'.replace('{{url}}', url);

        var client = new SparqlClient(endpoint);
        client.query(sparqlQuery)
            //.bind('city', 'db:Chicago')
            //.bind('city', 'db:Tokyo')
            //.bind('city', 'db:Casablanca')
            // .bind('city', '<http://dbpedia.org/resource/Vienna>')
            .execute((error, results) => {
                if (!error) {
                    fs.writeFile(file, JSON.stringify(results), (err) => {
                    });
                    var sum = summary(url, results);
                    console.log("WIKI:" + JSON.stringify(sum.title));
                    callback(sum);
                }
                //process.stdout.write(util.inspect(arguments, null, 20, true) + "\n"); 1
            });
    }
    else {
        fs.readFile(file, (err, data) => {
            if (!err) {
                var sum = summary(url, JSON.parse(data));
                callback(sum);
            }
        }
        );
    }
}

function loadSheet() {
    sheet.loadTechnologies(public_spreadsheet_url, () => {
        console.log('Saving sheet file at ' + process.env.SHEET_FILE);
        fs.writeFile(process.env.SHEET_FILE, CircularJSON.stringify(sheet), (err) => {
            if (err) console.log('Error writing sheet file at ' + process.env.SHEET_FILE + ' (' + err + ')');
        })
        updateWikipedia();
        updateRadarShots();
        updateScreenshots();
    });
}

function updateRadarShots() {
    sheet.sheets.Trends.forEach(t => {
        var url = process.env.TREND_PAGE + "/#/trends/" + t.Id + "/image";
        var options = {
            renderDelay: 4000, shotOffset: {
                left: 60
                , right: 0
                , top: 0
                , bottom: 0
            },
            shotSize: { width: 800, height: 600 }
        };
        var file = process.env.IMG + 'radar/trend-' + t.Id + '.png';
        webshot(url, file, options, (err) => {
            console.log('getting ' + url + " (" + file + ")");
        });

    });
}

function updateWikipedia() {
    var wikis = [];
    var wiki = {};
    sheet.sheets.Categories.forEach(t => { if (t.Wikipedia) { if (wikis.indexOf(t.Wikipedia)==-1) wikis.push(t.Wikipedia); } });
    sheet.sheets.Technologies.forEach(t => { if (t.Wikipedia) { if (wikis.indexOf(t.Wikipedia)==-1) wikis.push(t.Wikipedia); } });
    sheet.sheets.Trends.forEach(t => { if (t.Wikipedia) { if (wikis.indexOf(t.Wikipedia)==-1) wikis.push(t.Wikipedia); } });
    sheet.sheets.Examples.forEach(t => { if (t.Wikipedia) { if (wikis.indexOf(t.Wikipedia)==-1) wikis.push(t.Wikipedia); } });

    async.eachSeries(wikis, (w, cb) => {
        getWiki(w, (sum) => {
            wiki[w] = sum;
            cb();
        })
    }, e => {
        fs.writeFile(process.env.WIKI_FILE, JSON.stringify(wiki), (err) => {
            console.log("Writing wiki.json");
            //             if (err) console.log('Error writing sheet file at ' + file + ' (' + err + ')');
            //         });

        });
    });




        // wiki.WIKIPEDIA.getData(t.Wikipedia, d => {
        //     console.log(JSON.stringify(d));

        // }, e => {
        //     console.log('error');
        // });


        // t.Wikipedia.replace('https://en.wikipedia.org/wiki/', '');
        // var file = process.env.WIKI + resource + ".json";
        // if (!fs.existsSync(file)) {
        //     console.log(resource);
        //     wikipedia.page.data(resource, { content: true }, (response) => {
        //         fs.writeFile(file,JSON.stringify(response), (err) => {
        //             if (err) console.log('Error writing sheet file at ' + file + ' (' + err + ')');
        //         });
        //     });

        // };

 
}

function updateScreenshots() {
    var c = 0;
    let websites = [];
    var options = {};
    sheet.sheets.Examples.forEach(e => websites.push(e.Url));
    async.eachSeries(websites, (url, cb) => {
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        if (url.match(regex)) {
            var file = process.env.IMG + '/webshots/ws' + sdbmCode(url) + '.jpg';
            if (!fs.existsSync(file)) {
                console.log('getting ' + url + " (" + file + " - " + c + "/" + websites.length + ")");
                webshot(url, file, options, function (err) {
                    // screenshot now saved to flickr.jpeg
                    if (err) {
                        console.log('Error saving ' + url);
                    };

                    c += 1;
                    cb();
                });

            }
            else {
                c += 1;
                cb();
            }
        }
        else {
            cb();
        }

    });
}

var sdbmCode = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = char + (hash << 6) + (hash << 16) - hash;
    }
    return hash;
}


// let resource = getDBPedia("https://en.wikipedia.org/wiki/Virtual_reality");
// let json = getWiki(resource);


loadSheet();
// setInterval(() => {
//     loadSheet();
// }, 1000 * process.env.REFRESH);


var server = app.listen(process.env.PORT, () => {

    // Add headers
    app.use((req, res, next) => {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Pass to next layer of middleware
        next();
    });

    app.use(express.static('public'));


    app.use('/api/trends', (req, res) => {
        res.end(CircularJSON.stringify(sheet.sheets.Trends));
    });

    app.use('/api/platforms', (req, res) => {
        res.end(CircularJSON.stringify(sheet.sheets.Examples));
    });

    app.use('/api/sheets', (req, res) => {
        res.end(CircularJSON.stringify(sheet));
    });

    console.log('Example app listening at http://localhost:%s', process.env.PORT);
});






