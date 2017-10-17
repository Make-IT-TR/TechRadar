var fs = require('fs');
import classes = require('./classes');
import screenshots = require('./screenshots');
var SparqlClient = require('sparql-client');
var endpoint = 'http://dbpedia.org/sparql';
var _ = require('lodash');
var async = require('async');

export function updateWikipedia(sheet: classes.SpreadsheetService, project: string, callback: Function) {
    var wikis = [];
    console.log('Updating wikis');

    async.series([
        (callback) => {
            console.log('Updating categories');
            async.eachSeries(sheet.sheets.Categories, (c, cb) => {
                if (c.Wikipedia) {
                    getWiki(c.Wikipedia, project, (sum) => { c.WikiResult = sum; cb(); });
                } else { cb(); }
            }, () => callback()
            );
        },
        (callback) => {
            console.log('Updating technologies');
            async.eachSeries(sheet.sheets.Technologies, (c, cb) => {
                if (c.Wikipedia) {
                    getWiki(c.Wikipedia, project, (sum) => { c.WikiResult = sum; cb(); });
                } else { cb(); }
            }, () => callback()
            );
        },
        (callback) => {
            console.log('Updating trends');
            async.eachSeries(sheet.sheets.Trends, (c, cb) => {
                if (c.Wikipedia) {
                    getWiki(c.Wikipedia, project, (sum) => { c.WikiResult = sum; cb(); });
                } else { cb(); }
            }, () => callback()
            );
        },
        (callback) => {
            console.log('Updating examples');
            async.eachSeries(sheet.sheets.Examples, (c, cb) => {
                if (c.Wikipedia) {
                    getWiki(c.Wikipedia, project, (sum) => { c.WikiResult = sum; cb(); });
                } else { cb(); }
            }, () => callback()
            );
        }

    ],
        () => {
            console.log('Wiki updated');
            callback();
        });

    //         // .forEach(t => { if (t.Wikipedia) {  } });
    // //    if (wikis.indexOf(t.Wikipedia) == -1) wikis.push(t.Wikipedia); } });
    // sheet.sheets.Technologies.forEach(t => { if (t.Wikipedia) { getWiki(t.Wikipedia, project, (sum) => t.WikiResult = sum) } });
    // sheet.sheets.Trends.forEach(t => { if (t.Wikipedia) { getWiki(t.Wikipedia, project, (sum) => t.WikiResult = sum) } });
    // sheet.sheets.Examples.forEach(t => { if (t.Wikipedia) { getWiki(t.Wikipedia, project, (sum) => t.WikiResult = sum) } });

    // sheet.sheets.Technologies.forEach(t => { if (t.Wikipedia) { if (wikis.indexOf(t.Wikipedia) == -1) wikis.push(t.Wikipedia); } });
    //sheet.sheets.Trends.forEach(t => { if (t.Wikipedia) { if (wikis.indexOf(t.Wikipedia) == -1) wikis.push(t.Wikipedia); } });

    // sheet.sheets.Examples.forEach(t => { if (t.Wikipedia) { if (wikis.indexOf(t.Wikipedia) == -1) wikis.push(t.Wikipedia); } });

    // console.log(wikis.length);
    // async.eachSeries(wikis, (w, cb) => {
    //     getWiki(w, project, (sum) => {
    //         wiki[w] = sum;
    //         cb();
    //     })
    // }, e => {
    //     fs.writeFile(process.env.FOLDER + 'projects/' + project + '/wiki.json', JSON.stringify(wiki), (err) => {
    //         console.log("Writing wiki.json");
    //         //             if (err) console.log('Error writing sheet file at ' + file + ' (' + err + ')');
    //         //         });

    //     });

    //     console.log('Wiki updated');

    //     callback();
    // });




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


function getWiki(wikiUrl: string, project: string, callback: Function) {
    let url = getDBPedia(wikiUrl);
    var id = screenshots.sdbmCode(url);
    var file = process.env.FOLDER + '/projects/' + project + '/wiki/' + id + ".json";

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


function getWikiText(wiki: string): string {
    return "";

}