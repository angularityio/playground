var wallabyWebpack = require('wallaby-webpack');
var path = require('path');

var compilerOptions = Object.assign(
  require('./tsconfig.json').compilerOptions,
  require('./tsconfig.spec.json').compilerOptions);

module.exports = function (wallaby) {

  var webpackPostprocessor = wallabyWebpack({
    entryPatterns: [
      'apps/example-001-httpclient-testing/src/wallabyTest.js',
      'apps/example-001-httpclient-testing/src/**/*spec.js'
    ],

    module: {
      loaders: [
        {test: /\.css$/, loader: 'raw-loader'},
        {test: /\.html$/, loader: 'raw-loader'},
        {test: /\.js$/, loader: 'angular2-template-loader', exclude: /node_modules/},
        {test: /\.json$/, loader: 'json-loader'},
        {test: /\.styl$/, loaders: ['raw-loader', 'stylus-loader']},
        {test: /\.less$/, loaders: ['raw-loader', 'less-loader']},
        {test: /\.scss$|\.sass$/, loaders: ['raw-loader', 'sass-loader']},
        {test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'}
      ]
    },

    resolve: {
      modules: [
        path.join(wallaby.projectCacheDir, 'apps/example-001-httpclient-testing/src/app'),
        path.join(wallaby.projectCacheDir, 'apps/example-001-httpclient-testing/src'),
        path.join(wallaby.projectCacheDir, 'apps/example-001-httpclient-testing/src/test')
      ]
    }
  });

  return {
    files: [
      {pattern: 'apps/**/*.ts', load: false},
      {pattern: 'apps/**/*.d.ts', ignore: true},
      {pattern: 'apps/**/*.css', load: false},
      {pattern: 'apps/**/*.less', load: false},
      {pattern: 'apps/**/*.scss', load: false},
      {pattern: 'apps/**/*.sass', load: false},
      {pattern: 'apps/**/*.styl', load: false},
      {pattern: 'apps/**/*.html', load: false},
      {pattern: 'apps/**/*.json', load: false},
      {pattern: 'apps/**/*.json.ts', load: true},
      {pattern: 'apps/**/*spec.ts', ignore: true},

      {pattern: 'libs/**/*.ts', load: false},
      {pattern: 'libs/**/*.d.ts', ignore: true},
      {pattern: 'libs/**/*.css', load: false},
      {pattern: 'libs/**/*.less', load: false},
      {pattern: 'libs/**/*.scss', load: false},
      {pattern: 'libs/**/*.sass', load: false},
      {pattern: 'libs/**/*.styl', load: false},
      {pattern: 'libs/**/*.html', load: false},
      {pattern: 'libs/**/*.json', load: false},
      {pattern: 'libs/**/*.json.ts', load: true},
      {pattern: 'libs/**/*spec.ts', ignore: true}
    ],

    tests: [
      {pattern: 'apps/example-001-httpclient-testing/src/**/*spec.ts', load: false}
    ],

    testFramework: 'jasmine',

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript(compilerOptions)
    },

    middleware: function (app, express) {
      var path = require('path');
      app.use('/favicon.ico', express.static(path.join(__dirname, 'src/favicon.ico')));
      app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
    },

    env: {
      kind: 'electron'
    },

    postprocessor: webpackPostprocessor,

    setup: function () {
      window.__moduleBundler.loadTests();
    },

    debug: true
  };
};