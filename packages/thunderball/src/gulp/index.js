/* eslint-disable no-undef, no-console, global-require */
import bg from 'gulp-bg';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import path from 'path';
import nodemon from 'gulp-nodemon';
import runSequence from 'run-sequence';
import shell from 'gulp-shell';
import webpackBuild from '../webpack/build';
import yargs from 'yargs';
import gulpTasks from './baseTasks';
import constants from '../constants';
import _ from 'lodash';

gulpTasks.config.outputFolder = 'build';
gulpTasks.config.cleanFiles = [gulpTasks.config.outputFolder, './ios/build'];
gulpTasks.config.browserFilesLocation = path.normalize(path.join(__dirname, '../server/static'));
gulpTasks.config.thunderballPath = path.normalize(path.join(__dirname, '/../..'));
gulpTasks.config.help = `
  Dev Tasks
    - "gulp" or "npm start": run app in development mode (with watch)
    - "gulp -p": run app in production mode (with watch)
    - "gulp lint": run static code analysis
    - "gulp lint --fix": run fixing of some code issues

  Production Tasks
    - "gulp build -p": build app for production
    - "node": start app, remember to set NODE_ENV
    - "gulp clean": clear out /build folder
`;

const args = yargs.alias('p', 'production').argv;

gulp.task('build-webpack', webpackBuild);
gulp.task('build', ['clean', 'lint', 'build-webpack', 'server-static-files', 'static-ions', 'build-info']);

gulp.task('server-static-files', () => {
  gulp.src(`${gulpTasks.config.browserFilesLocation}/**/*.js`)
    .pipe(gulp.dest(gulpTasks.config.outputFolder));
});

gulp.task('static-ions', () => {
  (constants.APP_IONS || [])
    .filter(ion => !_.isEmpty(ion.config.staticDirectories))
    .forEach((ion) => {
      ion.config.staticDirectories.forEach((staticDir) => {
        const p = path.join(constants.APP_IONS_DIR, `${ion.dir}/${staticDir.dir}/**/*`);
        console.log(`Copying static folder: ${p}`);
        gulp.src(p)
          .pipe(gulp.dest(`${gulpTasks.config.outputFolder}/${ion.name}/${staticDir.dir.split('/').slice(-1).pop()}`));
      });
    });
});

gulp.task('server-hot', bg('node', path.resolve(__dirname, '../webpack/server')));

gulp.task('server', ['server-hot', 'lint', 'server-static-files', 'build-info'], () => {
  nodemon({
    watch: ['src/**/*.*', '!*.generated.js'],
    script: 'index.js',
    tasks: ['lint', 'server-static-files'],
  }).on('restart', () => {
    console.log('restarted!');
  });
});

// Default task to start development. Just type gulp.
gulp.task('default', ['static-ions', 'server']);

module.exports.config = gulpTasks.config;
module.exports.tasks = gulp.tasks;
