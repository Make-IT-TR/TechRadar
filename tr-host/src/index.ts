import { Technology } from './utils/technology';
/* eslint-disable no-console */
const logger = require('winston');
var fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
import * as feathers from 'feathers';
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const swagger = require('feathers-swagger');
const express = require('feathers-express');
// const socketio = require('feathers-socketio');

const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');
const memory = require('feathers-memory');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');


const authentication = require('./authentication');

import classes = require('./utils/classes');

const wikiUtils = require('./utils/wikipedia');
import { importSheet, loadProject } from './utils/project';
import { updateScreenshots, sdbmCode, updateRadarShots } from './utils/screenshots';
import { updateWikipedia } from './utils/wikipedia';

const app = feathers();
var projects: { [id: string]: classes.Project } = {};
var activeProject: classes.Project;

require('dotenv').config();


// Load app configuration
app.configure(configuration(path.join(__dirname, './../config')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));
// app.use('/projects', feathers.static(app.get('.//projects')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(rest());
app.configure(swagger({
  docsPath: '/docs',
  uiIndex: true,
  info: {
    title: 'A test',
    description: 'A description'
  }
}));

// app.configure(socketio());
app.use('/categories', memory())
app.use('/subcategories', memory())
app.use('/technologies', memory())
app.use('/dimensions', memory())
app.use('/examples', memory())
app.use('/trends', memory())
app.use('/presets', memory())
app.use('/radarinput', memory())
app.use('/years', memory())

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());

(<any>app).hooks(appHooks);
const port = app.get('port');

loadProjects(app);

app.listen(port, () => {

  for (var p in (<any>app).docs.paths) {
    let path = (<any>app).docs.paths[p];
    delete path['post'];
    delete path['put'];
    delete path['delete'];
    delete path['patch'];
  }

  delete (<any>app).docs.paths['/presets'];
  delete (<any>app).docs.paths['/presets/{id}'];
  delete (<any>app).docs.paths['/years'];
  delete (<any>app).docs.paths['/years/{id}'];
  delete (<any>app).docs.paths['/users'];
  delete (<any>app).docs.paths['/users/{_id}'];
  console.log(`Feathers server listening on port ${port}`);

  console.log('updating radar shots');

  setInterval(() => {
    parseProject(app);
    // console.log('Updating radarshots')
    // updateRadarShots(activeProject, () => {
    //   saveProject(activeProject);
    // });
  }, 1000 * 60 * 5);
});

// process.on('unhandledRejection', (reason, p) =>
//   logger.error('Unhandled Rejection at: Promise ', p, reason)
// );

function saveProject(project: classes.Project) {
  console.log('Saving project');
  const projectFolder = process.env.FOLDER + '/projects/' + project.config.id;
  // make a backup first
  const backupFolder = projectFolder + '/backup';
  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder);
  }
  const backupFile = backupFolder + '/backup-' + new Date().getTime() + '.json';
  console.log('Saving config to ' + backupFile);
  fs.createReadStream(projectFolder + '/new.json').pipe(fs.createWriteStream(backupFile));

  fs.writeFile(projectFolder + '/new.json', JSON.stringify(project, null, 2), (err) => {
    if (err) { console.log('Error writing config file at ' + process.env.SHEET_FILE + ' (' + err + ')'); } else {
      console.log('Project saved');
    }
  })
}

function parseProject(app: feathers.Application) {
  app.service('examples').find().then((d: classes.Example[]) => {
    if (JSON.stringify(activeProject.examples) !== JSON.stringify(d)) {
      activeProject.examples = d;
      saveProject(activeProject);
    }
  });
  app.service('technologies').find().then((d: classes.ITechnology[]) => {
    if (JSON.stringify(activeProject.technologies) !== JSON.stringify(d)) {
      activeProject.technologies = d;
      saveProject(activeProject);
    }
  });
  app.service('trends').find().then((d: classes.Trend[]) => {
    if (JSON.stringify(activeProject.trends) !== JSON.stringify(d)) {
      activeProject.trends = d;
      saveProject(activeProject);
    }
  });

  app.service('radarinput').find().then((d: classes.RadarInput[]) => {
    if (JSON.stringify(activeProject.radarinput) !== JSON.stringify(d)) {
      activeProject.radarinput = d;
      saveProject(activeProject);
    }
  });

}


function loadProjects(app: feathers.Application) {
  const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p + "/" + f).isDirectory())
  dirs(process.env.FOLDER + '/projects').forEach(projectFile => {
    loadProject(projectFile, ((project: classes.Project) => {
      activeProject = project;
      projects[project.config.id] = project;
      project.id = projectFile;

      for (var dim in project.dimensions) {
        // project.dimensions[dim].id = dim;
        let o = { id: dim, title: dim, values: project.dimensions[dim] }
        // o[dim] = project.dimensions[dim];
        app.service('dimensions').create(o);
      }
      project.technologies.forEach(technology => {
        app.service('technologies').create(technology);
      });

      project.categories.forEach(category => {
        app.service('categories').create(category);
      });

      project.subcategories.forEach(subcategory => {
        app.service('subcategories').create(subcategory);
      });

      project.examples.forEach(example => {
        // example['id'] = example.Name;
        example.Webshot = "projects/" + project.id + "/webshots/ws" + sdbmCode(example.Url) + ".jpg";
        app.service('examples').create(example);

      });
      app.service('examples').on('created', pl => {
        // let s = dimensions;
        // console.log(pl);
      });

      app.service('examples').on('update', pl => {
        console.log(JSON.stringify(pl));
      });

      app.service('technologies').on('update', pl => {
        console.log(JSON.stringify(pl));
      });

      project.trends.forEach(trend => {
        // trend.id = trend.Name;
        app.service('trends').create(trend);
      });

      project.presets.forEach(preset => {
        preset.id = preset.Title;
        app.service('presets').create(preset);
      });

      project.years.forEach(year => {
        let yo = { year: year, id: year };
        app.service('years').create(yo);
      })

      project.radarinput.forEach(ri => {
        // trend['id'] = trend.Name;
        app.service('radarinput').create(ri);
      });

      updateScreenshots(project, () => {
        saveProject(project);
      });


      // updateWikipedia(project, () => {
      //   updateScreenshots(project, () => {
      //     saveProject(project);
      //   });

      //   //
      // });


      // app.service('projects').create({ project: projects['makeit'], id: projectFile }).then(message => console.log('Created project'));
    }));

    // loadSheet(project);
    // console.log(project);
  });
}
