"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const logger = require('winston');
var fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const feathers = require("feathers");
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
const wikiUtils = require('./utils/wikipedia');
const project_1 = require("./utils/project");
const screenshots_1 = require("./utils/screenshots");
const wikipedia_1 = require("./utils/wikipedia");
const app = feathers();
var projects = {};
var activeProject;
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
app.use('/categories', memory());
app.use('/subcategories', memory());
app.use('/technologies', memory());
app.use('/dimensions', memory());
app.use('/examples', memory());
app.use('/trends', memory());
app.use('/presets', memory());
app.use('/radarinput', memory());
app.use('/years', memory());
// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());
app.hooks(appHooks);
const port = app.get('port');
loadProjects(app);
app.listen(port, () => {
    for (var p in app.docs.paths) {
        let path = app.docs.paths[p];
        delete path['post'];
        delete path['put'];
        delete path['delete'];
        delete path['patch'];
    }
    delete app.docs.paths['/presets'];
    delete app.docs.paths['/presets/{id}'];
    delete app.docs.paths['/years'];
    delete app.docs.paths['/years/{id}'];
    delete app.docs.paths['/users'];
    delete app.docs.paths['/users/{_id}'];
    console.log(`Feathers server listening on port ${port}`);
    console.log('updating radar shots');
    setInterval(() => {
        parseProject(app);
        // console.log('Updating radarshots')
        // updateRadarShots(activeProject, () => {
        //   saveProject(activeProject);
        // });
    }, 1000 * 60);
});
// process.on('unhandledRejection', (reason, p) =>
//   logger.error('Unhandled Rejection at: Promise ', p, reason)
// );
function saveProject(project) {
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
        if (err) {
            console.log('Error writing config file at ' + process.env.SHEET_FILE + ' (' + err + ')');
        }
        else {
            console.log('Project saved');
        }
    });
}
function parseProject(app) {
    app.service('examples').find().then((d) => {
        if (JSON.stringify(activeProject.examples) !== JSON.stringify(d)) {
            activeProject.examples = d;
            saveProject(activeProject);
        }
    });
    app.service('technologies').find().then((d) => {
        if (JSON.stringify(activeProject.technologies) !== JSON.stringify(d)) {
            activeProject.technologies = d;
            saveProject(activeProject);
        }
    });
    app.service('trends').find().then((d) => {
        if (JSON.stringify(activeProject.trends) !== JSON.stringify(d)) {
            activeProject.trends = d;
            saveProject(activeProject);
        }
    });
    app.service('radarinput').find().then((d) => {
        if (JSON.stringify(activeProject.radarinput) !== JSON.stringify(d)) {
            activeProject.radarinput = d;
            saveProject(activeProject);
        }
    });
}
function loadProjects(app) {
    const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p + "/" + f).isDirectory());
    dirs(process.env.FOLDER + '/projects').forEach(projectFile => {
        project_1.loadProject(projectFile, ((project) => {
            // const file = process.env.FOLDER + '/projects/' + project.id + '/all.json';
            // var data = fs.readFileSync(file);
            // var sheet = CircularJSON.parse(data);
            // console.log(project.technologies.length);
            // sheet.sheets.Technologies.forEach(t => {
            //   if (t.Technology === "3D printing service") {
            //     console.log(t);
            //   }
            //   t.Technology = t.Technology.trim();
            //   let technology = project.technologies.find(tech => tech.Technology.trim().toLowerCase() === t.Technology.toLowerCase());
            //   if (!technology) {
            //     console.log(t.Technology);
            //     let pr = {
            //       "Id": project.technologies.length,
            //       "Technology": t.Technology,
            //       "Description": t.Description,
            //       "Category": t.Category,
            //       "SubCategory": t.SubCategory,
            //       "Examples": t.Examples,
            //       "WikiResult": {},
            //       "Wikipedia": t.Wikipedia,
            //       "Platforms": [],
            //       "Tags": [
            //         {
            //           "id": t.Category,
            //           "type": "category"
            //         },
            //         {
            //           "id": t.SubCategory,
            //           "type": "subcategory"
            //         }
            //       ]
            //     };
            //     t._Examples.forEach(e => {
            //       if (e.Name !== "http://www..com") {
            //         let ex = project.examples.find(ex => ex.Name === e.Name);
            //         if (ex) pr.Platforms.push(ex.id);
            //       }
            //     })
            //     project.technologies.push(pr as any);
            //   }
            // });
            activeProject = project;
            projects[project.config.id] = project;
            project.id = projectFile;
            for (var dim in project.dimensions) {
                // project.dimensions[dim].id = dim;
                let o = { id: dim, title: dim, values: project.dimensions[dim] };
                // o[dim] = project.dimensions[dim];
                app.service('dimensions').create(o);
            }
            project.technologies.forEach(technology => {
                if (technology.Technology.startsWith('2')) {
                }
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
                if (!example.DateAdded) {
                    example.DateAdded = new Date(2017, 1, 1).getTime();
                }
                if (!example.DateUpdated) {
                    example.DateUpdated = new Date(2017, 1, 1).getTime();
                }
                example.Webshot = "projects/" + project.id + "/webshots/ws" + screenshots_1.sdbmCode(example.Url) + ".jpg";
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
            });
            project.radarinput.forEach(ri => {
                // trend['id'] = trend.Name;
                app.service('radarinput').create(ri);
            });
            wikipedia_1.updateWikipedia(project, () => {
                saveProject(project);
            });
            screenshots_1.updateScreenshots(project, () => { });
            //   updateScreenshots(project, () => {
            //   });
            // });
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
//# sourceMappingURL=index.js.map