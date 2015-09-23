var src = './src';
var dest = './build';
var test = './test';

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

    resources: {
      app: [
        {file: {name: 'app.bundle.js', path: dest}}
      ]
    }
  },
  //maven options, need for maven install/deploy
  maven: {
    groupId: 'com.jcatalog.grailsplugins',
    artefactId: 'jcatalog-i18n-resources',
    version: '7.17-SNAPSHOT',

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
