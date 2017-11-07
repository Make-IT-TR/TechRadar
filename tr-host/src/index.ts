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
const socketio = require('feathers-socketio');

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

const app = feathers();
var projects: { [id: string]: classes.Project } = {};

require('dotenv').config();


// Load app configuration
app.configure(configuration(path.join(__dirname, './../config')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(rest());
app.configure(socketio());
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
  console.log(`Feathers server listening on port ${port}`)
});

// process.on('unhandledRejection', (reason, p) =>
//   logger.error('Unhandled Rejection at: Promise ', p, reason)
// );


function loadProjects(app: feathers.Application) {
  const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p + "/" + f).isDirectory())
  dirs(process.env.FOLDER + '/projects').forEach(projectFile => {
      loadProject(projectFile, ((project: classes.Project) => {
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
          })


          project.examples.forEach(example => {
              // example['id'] = example.Name;
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
          // app.service('projects').create({ project: projects['makeit'], id: projectFile }).then(message => console.log('Created project'));
      }));

      // loadSheet(project);
      // console.log(project);
  });
}