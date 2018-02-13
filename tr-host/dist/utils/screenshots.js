"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webshot = require('webshot');
var fs = require('fs');
var async = require('async');
var Jimp = require("jimp");
function sdbmCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = char + (hash << 6) + (hash << 16) - hash;
    }
    return hash;
}
exports.sdbmCode = sdbmCode;
function updateScreenshots(project, callback) {
    console.log('updating screenshots');
    var c = 0;
    let websites = [];
    var options = {
        userAgent: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
        // timeout: 10000,
        phantomConfig: { 'ssl-protocol': 'ANY', 'ignore-ssl-errors': true }
    };
    // project.examples.forEach(e => {
    //   websites.push(e.Url);
    // });
    async.eachSeries(project.examples, (e, cb) => {
        if (!e.WebshotFailed) {
            let url = e.Url;
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            var regex = new RegExp(expression);
            if (url.match(regex)) {
                var fileb = 'projects/' + project.config.id + '/webshots/ws' + sdbmCode(url) + 'b.jpg';
                var file = 'projects/' + project.config.id + '/webshots/ws' + sdbmCode(url) + '.jpg';
                if (!fs.existsSync(file)) {
                    console.log('getting ' + url + " (" + fileb + " - " + c + "/" + websites.length + ")");
                    webshot(url, fileb, options, (err) => {
                        // screenshot now saved to flickr.jpeg
                        if (err) {
                            console.log('Error saving ' + url);
                            console.log(err);
                            e.WebshotFailed = true;
                        }
                        ;
                        // open a file called "lenna.png"
                        Jimp.read(fileb, (err, lenna) => {
                            if (!err) {
                                lenna.resize(256, 192) // resize
                                    .quality(75) // set JPEG quality
                                    .write(file); // save
                                fs.unlinkSync(fileb);
                            }
                        });
                        c += 1;
                        console.log('done: ' + url);
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
        }
        else {
            cb();
        }
    }, (e) => {
        callback();
    });
}
exports.updateScreenshots = updateScreenshots;
function updateRadarShots(project, callback) {
    async.eachSeries(project.trends, (t, cb) => {
        var url = process.env.TREND_PAGE + "/#/trends/" + t.id + "/image";
        var options = {
            timeout: 2000,
            shotOffset: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            quality: 75,
            windowSize: {
                width: 1024,
                height: 768
            }
        };
        var file = 'projects/' + project.config.id + '/radar/trend-' + t.id + '.png';
        console.log('getting ' + url + " (" + file + ")");
        webshot(url, file, options, (err) => {
            if (err) {
                console.log('Error getting ' + url);
                cb();
            }
            else {
                console.log('Got it!');
                cb();
            }
        });
    }), () => {
        callback();
    };
}
exports.updateRadarShots = updateRadarShots;
//# sourceMappingURL=screenshots.js.map