// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../static/styles.css';
import '../static/radar.css';
import 'valueconverters';
import 'aurelia-bootstrapper';
import 'bootstrap';
import 'bootstrap-select';
import 'd3';
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import * as Bluebird from 'bluebird';
import 'aurelia-google-analytics'; 

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });


export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin(PLATFORM.moduleName('aurelia-google-analytics'), config => {
			config.init('UA-98391880-1');
			config.attach({
				logging: {
					enabled: true // Set to `true` to have some log messages appear in the browser console.
				},
				pageTracking: {
					enabled: true // Set to `false` to disable in non-production environments.
				},
				clickTracking: {
					enabled: true // Set to `false` to disable in non-production environments.
				},
				exceptionTracking: {
					enabled: true // Set to `false` to disable in non-production environments.
				}
			})});

  // Uncomment the line below to enable animation.
  //aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));



  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}
