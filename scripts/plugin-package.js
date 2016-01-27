'use strict';

var config = require('../package.json');
var util = require('./common');
var through = require('through2');
var gutil = require('gulp-util');
var File = gutil.File;
var handlebars = require('handlebars');
var zip = require('gulp-zip');
var fs = require('fs');
var globule = require('globule');
var path = require('path');

if (!config.grails || !config.maven) {
  throw new gutil.PluginError('plugin-package', 'Grails and Maven sections not found in package.json!');
}

function createFile(path, text) {
  var buffer = new Buffer(text, 'utf8');
  return new File({
    path: path,
    contents: buffer
  });
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
}

function pluginName(artefactId) {
  var parts = artefactId.split('-');

  var result = [parts[0]];

  for (var i = 1; i < parts.length; i++) {
    var part = parts[i];

    result.push(capitalize(part));
  }

  return result.join('');
}

function addFiles(files) {
  return through.obj(function (file, enc, cb) {
    this.push(file);
    cb();
  }, function (cb) {
    for (var i = 0; i < files.length; i++) {
      this.push(files[i]);
    }
    cb();
  });
}

/**
 * Exports grails tasks
 *
 * @param gulp - gulp instance
 */
module.exports = function (gulp) {

  gulp.task('plugin-package', function () {
    let release = (process.argv.indexOf("--release") > -1);
    var name = pluginName(config.maven.artefactId);

    var pluginPrefix = capitalize(name);
    var mavenArtefactVersion = util.getMavenArtefactVersion(release);

    var pluginFiles = [];

    pluginFiles.push(
      createFile('application.properties',
        handlebars.compile(fs.readFileSync(__dirname + '/templates/application.hbs').toString())({
          grailsVersion: config.grails.version || '',
          app: {
            name: config.maven.artefactId || '',
            version: mavenArtefactVersion || ''
          }
        })
      )
    );

    pluginFiles.push(
      createFile('plugin.xml',
        handlebars.compile(fs.readFileSync(__dirname + '/templates/plugin.hbs').toString())({
          pluginName: config.maven.artefactId,
          pluginPrefix: pluginPrefix,
          author: config.author.name || '',
          email: config.author.email || '',
          title: `Auto-generated for ${config.name }`,
          description: config.description || '',
          version: mavenArtefactVersion || '',
          artefactId: config.maven.artefactId || ''
        })
      )
    );

    pluginFiles.push(
      createFile(pluginPrefix + 'GrailsPlugin.groovy',
        handlebars.compile(fs.readFileSync(__dirname + '/templates/descriptor.hbs').toString())({
          pluginPrefix: pluginPrefix,
          author: config.author.name || '',
          email: config.author.email || '',
          title: `Auto-generated for ${config.name}`,
          description: config.description || '',
          version: mavenArtefactVersion || '',
          groupId: config.maven.groupId || ''
        })
      )
    );

    pluginFiles.push(
      createFile('grails-app/conf/' + pluginPrefix + 'Resources.groovy',
        handlebars.compile(fs.readFileSync(__dirname + '/templates/modules.hbs').toString())({
          resources: config.grails.resources,
          pluginName: config.maven.artefactId
        })
      )
    );

    for (var resId in config.grails.resources) {
      var resource = config.grails.resources[resId];
      for (var i = 0; i < resource.length; i++) {
        var content = fs.readFileSync('./dist/' + resource[i].file.name).toString();
        pluginFiles.push(
          createFile('web-app/js/' + resource[i].file.name, content)
        )
      }
    }

    var javaSrcs = globule.find(config.grails.javaSrc + '/**/*.js');
    for (var i = 0; i < javaSrcs.length; i++) {
      var file = javaSrcs[i];
      pluginFiles.push(
        createFile('src/java/' + path.relative(config.grails.javaSrc, file), fs.readFileSync(file).toString())
      )
    }

    var doc = globule.find('./esdoc/**/*.*');
    for (var i = 0; i < doc.length; i++) {
      var file = doc[i];
      pluginFiles.push(
        createFile('web-app/docs/' + path.relative('./esdoc', file), fs.readFileSync(file).toString())
      )
    }

    return gulp.src([])
      .pipe(addFiles(pluginFiles))
      .pipe(zip(util.getMavenArtefactName(mavenArtefactVersion)))
      .pipe(gulp.dest('./build'))
  });
};
