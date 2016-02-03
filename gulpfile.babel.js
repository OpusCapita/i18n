import gulp from 'gulp';
import includeGrailsPluginPackageTask from './scripts/grails-plugin-package';
import includeGrailsPluginInstallTask from './scripts/grails-plugin-install';
import includeGrailsPluginDeployTask from './scripts/grails-plugin-deploy';

// includes all gulp tasks
includeGrailsPluginPackageTask(gulp);
includeGrailsPluginInstallTask(gulp);
includeGrailsPluginDeployTask(gulp);
