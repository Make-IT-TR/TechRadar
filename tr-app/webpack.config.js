const path = require('path');
require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { AureliaPlugin } = require('aurelia-webpack-plugin');
const { optimize: { CommonsChunkPlugin }, ProvidePlugin } = require('webpack')
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// config helpers:
const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || []
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig)

// primary config:
const title = 'TechRadar';
const outDir = path.resolve(__dirname, 'dist');
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '/';

const cssRules = [
  { loader: 'css-loader' },
  {
    loader: 'postcss-loader',
    options: { plugins: () => [require('autoprefixer')({ browsers: ['last 2 versions'] })] }
  }
]

module.exports = ({ production, server, extractCss, coverage } = {}) => ({
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [srcDir, 'node_modules'],
    alias: {
      'aurelia-binding$': path.resolve(__dirname, 'node_modules/aurelia-binding/dist/amd/aurelia-binding.js')
    }
  },
  entry: {
    app: ['./src/main']
  },
  output: {
    path: outDir,
    publicPath: baseUrl,
    filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
    sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
    chunkFilename: production ? '[chunkhash].chunk.js' : '[hash].chunk.js',
  },
  devServer: {
    contentBase: baseUrl,
  },
  module: {
    rules: [
      // CSS required in JS/TS files should use the style-loader that auto-injects it into the website
      // only when the issuer is a .js/.ts file, so the loaders are not applied inside html templates
      {
        test: /\.css$/i,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: extractCss ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssRules,
        }) : ['style-loader', ...cssRules],
      },
      {
        test: /\.css$/i,
        issuer: [{ test: /\.html$/i }],
        // CSS required in templates cannot be extracted safely
        // because Aurelia would try to require it again in runtime
        use: cssRules,
      },
      { test: /\.html$/i, loader: 'html-loader' },
      { test: /\.ts$/i, loader: 'awesome-typescript-loader', exclude: nodeModulesDir },
      { test: /\.json$/i, loader: 'json-loader' },
      // use Bluebird as the global Promise implementation:
      { test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/, loader: 'expose-loader?Promise' },
      // exposes jQuery globally as $ and as jQuery:
      { test: require.resolve('jquery'), loader: 'expose-loader?$!expose-loader?jQuery' },
      // embed small images and fonts as Data Urls and larger ones as files:
      { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
      ...when(coverage, {
        test: /\.[jt]s$/i, loader: 'istanbul-instrumenter-loader',
        include: srcDir, exclude: [/\.{spec,test}\.[jt]s$/i],
        enforce: 'post', options: { esModules: true },
      })
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'] }
    }),
    new AureliaPlugin(),
    new ProvidePlugin({
      'Promise': 'bluebird',
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery', 
    }),
    new TsConfigPathsPlugin(),
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      minify: production ? {
        removeComments: true,
        collapseWhitespace: true
      } : undefined,
      metadata: {
        // available in index.ejs //
        title, server, baseUrl
      },
    }),
    // new UglifyJSPlugin(),
    new CopyWebpackPlugin([
      { from: 'static/favicon.ico', to: 'favicon.ico' }
      ,{ from: './../tr-host/projects', to: 'projects' }
      ,{ from: 'img', to: 'img' }
    ]),
    ...when(extractCss, new ExtractTextPlugin({
      filename: production ? '[contenthash].css' : '[id].css',
      allChunks: true,
    })),
    ...when(production, new CommonsChunkPlugin({
      name: ['vendor']
    })),
    ...when(production, new CopyWebpackPlugin([
      { from: 'static/favicon.ico', to: 'favicon.ico' }
    ]))
    // ,
    // new BundleAnalyzerPlugin({
    //   // Can be `server`, `static` or `disabled`. 
    //   // In `server` mode analyzer will start HTTP server to show bundle report. 
    //   // In `static` mode single HTML file with bundle report will be generated. 
    //   // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`. 
    //   analyzerMode: 'static',
    //   // Host that will be used in `server` mode to start HTTP server. 
    //   analyzerHost: '127.0.0.1',
    //   // Port that will be used in `server` mode to start HTTP server. 
    //   analyzerPort: 8888,
    //   // Path to bundle report file that will be generated in `static` mode. 
    //   // Relative to bundles output directory. 
    //   reportFilename: 'report.html',
    //   // Module sizes to show in report by default. 
    //   // Should be one of `stat`, `parsed` or `gzip`. 
    //   // See "Definitions" section for more information. 
    //   defaultSizes: 'parsed',
    //   // Automatically open report in default browser 
    //   openAnalyzer: false,
    //   // If `true`, Webpack Stats JSON file will be generated in bundles output directory 
    //   generateStatsFile: false,
    //   // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`. 
    //   // Relative to bundles output directory. 
    //   statsFilename: 'stats.json',
    //   // Options for `stats.toJson()` method. 
    //   // For example you can exclude sources of your modules from stats file with `source: false` option. 
    //   // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21 
    //   statsOptions: null,
    //   // Log level. Can be 'info', 'warn', 'error' or 'silent'. 
    //   logLevel: 'info'
    // })
  ],
})
