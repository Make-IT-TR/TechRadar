import classes = require('./classes');
var webshot = require('webshot');
var fs = require('fs');
var async = require('async');
var Jimp = require("jimp");

export function sdbmCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = char + (hash << 6) + (hash << 16) - hash;
  }
  return hash;
}

export function updateScreenshots(project: classes.Project, callback: Function) {
  var c = 0;
  let websites = [];
  var options = {};
  project.examples.forEach(e => {
    websites.push(e.Url);
  });
  async.eachSeries(websites, (url, cb) => {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (url.match(regex)) {
      var fileb = 'projects/' + project.id + '/webshots/ws' + sdbmCode(url) + 'b.jpg';
      var file = 'projects/' + project.id + '/webshots/ws' + sdbmCode(url) + '.jpg';

      if (!fs.existsSync(file)) {
        console.log('getting ' + url + " (" + fileb + " - " + c + "/" + websites.length + ")");
        webshot(url, fileb, options, function (err) {
          // screenshot now saved to flickr.jpeg
          if (err) {
            console.log('Error saving ' + url);
          };
          // open a file called "lenna.png"
          Jimp.read(fileb, (err, lenna) => {
            if (!err) {
              lenna.resize(256, 192)            // resize
                .quality(75)                 // set JPEG quality
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

  }, (e) => {
    callback();
  });
}

export function updateRadarShots(project: classes.Project, callback: Function) {
  project.trends.forEach(t => {
    var url = process.env.TREND_PAGE + "/#/trends/" + t.id + "/image";
    var options = {
      renderDelay: 4000, shotOffset: {
        left: 0
        , right: 0
        , top: 0
        , bottom: 0
      },
      quality: 75,
      windowSize: {
        width: 1024
        , height: 768
      }
    };
    var file = 'projects/' + project + '/radar/trend-' + t.id + '.png';
    webshot(url, file, options, (err) => {
      console.log('getting ' + url + " (" + file + ")");
    });

  });
  callback();
}
