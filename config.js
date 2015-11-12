var path = require('path');
var src = './src';
var dest = './build';
var test = './test';

var pluginResourcesPath = path.join(dest, 'plugin-resources');
var pluginResourcesWebAppPath = path.join(pluginResourcesPath, 'web-app');
var pluginResourcesWebAppSection = path.join(pluginResourcesWebAppPath, 'text-table');
var pluginResourcesSrcPath = path.join(pluginResourcesPath, 'src');
var pluginResourcesJavaPath = path.join(pluginResourcesSrcPath, 'java');

/**
 * @author Dmitry Divin
 *
 * The project configuration
 */
module.exports = {
  //common paths options
  paths: {
    //destination JS documents folder
    doc: dest + '/doc',
    //source folder
    src: src,
    //destination folder
    dest: dest,
    //test folder
    test: test
  },
  browserSync: {
    server: {
      //express handling as static resources
      baseDir: [src + '/www', dest]
    }
  },
  proxy: {
    url: 'http://test.jcatalog.com/demo-app/demo',
    login: 'jcadmin',
    password: 'jcadmin',
    language: 'en'
  },
  browserify: {
    //you can select stage option according
    //to ref http://babeljs.io/docs/usage/experimental/
    babelify: {stage: 0},
    // Enable source maps
    debug: true,
    //base dir for sources folder
    basedir: src,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [
      {
        //destination folder
        dest: dest,
        //list of entry files related basedir
        entries: ['index.js'],
        //output file name
        outputName: 'i18n.bundle.js'
      },
      {
        //destination folder
        dest: pluginResourcesWebAppSection,
        //list of entry files related basedir
        entries: ['index.js'],
        //output file name
        outputName: 'i18n-bundle.js',
        /*
         * exported variables as global variable
         */
        standalone: 'I18nManager'
      },
      {
        //destination folder
        dest: pluginResourcesJavaPath,
        //list of entry files related basedir
        entries: ['index.js'],
        //output file name
        outputName: 'i18n-bundle.js',
        /*
         * exported variables as global variable
         */
        standalone: 'I18nManager'
      }
    ]
  },
  //grails plugin information
  grails: {
    version: '2.4.4',
    author: {
      name: 'Dmitry Divin',
      email: 'dmitry.divin@jcatalog.com'
    },
    title: 'I18n localization',
    description: '',

    javaSrc: pluginResourcesJavaPath,

    resources: {
      "i18n-manager-resources": [
        {file: {name: 'i18n-bundle.js', path: pluginResourcesWebAppSection}}
      ]
    }
  },
  //maven options, need for maven install/deploy
  maven: {
    groupId: 'com.jcatalog.grailsplugins',
    artefactId: 'jcatalog-i18n-resources',
    version: '7.18-SNAPSHOT',

    repositories: {
      releases: {
        id: 'maven2ReleasesDeploymentRepositoryId',
        url: 'http://maven.scand/nexus/content/repositories/releases'
      },
      snapshots: {
        id: 'maven2SnapshotsDeploymentRepositoryId',
        url: 'http://maven.scand/nexus/content/repositories/snapshots'
      }
    }
  }
};
