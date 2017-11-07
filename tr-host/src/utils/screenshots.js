"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webshot = require('webshot');
var fs = require('fs');
var async = require('async');
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
    var c = 0;
    let websites = [];
    var options = {};
    project.examples.forEach(e => websites.push(e.Url));
    async.each(websites, (url, cb) => {
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        if (url.match(regex)) {
            var file = 'projects/' + project.id + '/webshots/ws' + sdbmCode(url) + '.jpg';
            if (!fs.existsSync(file)) {
                console.log('getting ' + url + " (" + file + " - " + c + "/" + websites.length + ")");
                webshot(url, file, options, function (err) {
                    // screenshot now saved to flickr.jpeg
                    if (err) {
                        console.log('Error saving ' + url);
                    }
                    ;
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
    }, (e) => {
        callback();
    });
}
exports.updateScreenshots = updateScreenshots;
function updateRadarShots(project, callback) {
    project.trends.forEach(t => {
        var url = process.env.TREND_PAGE + "/#/trends/" + t.id + "/image";
        var options = {
            renderDelay: 4000, shotOffset: {
                left: 60,
                right: 0,
                top: 0,
                bottom: 0
            },
            shotSize: { width: 800, height: 600 }
        };
        var file = 'projects/' + project + '/radar/trend-' + t.id + '.png';
        webshot(url, file, options, (err) => {
            console.log('getting ' + url + " (" + file + ")");
        });
    });
    callback();
}
exports.updateRadarShots = updateRadarShots;
//# sourceMappingURL=screenshots.js.map