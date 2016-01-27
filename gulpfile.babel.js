import gulp from 'gulp';
import includePackageTask from './scripts/plugin-package';
import includeInstallTask from './scripts/plugin-install';
import includeDeployTask from './scripts/plugin-deploy';

// includes all gulp tasks
includePackageTask(gulp);
includeInstallTask(gulp);
includeDeployTask(gulp);
