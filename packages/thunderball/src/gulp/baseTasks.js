/* eslint no-console:0 */
import del from 'del';
import eslint from 'gulp-eslint';
import git from 'git-rev';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import gutil from 'gulp-util';
import path from 'path';
import yargs from 'yargs';
import fs from 'fs';

const config = {
  name: '',
  packageJson: './package.json',
  sourceFiles: 'src/**/*.js?(x)',
  outputFolder: 'build',
  cleanFiles: null,
};

const args = yargs
  .alias('p', 'production')
  .argv;

// Check if we should run production, otherwise use the current NODE_ENV or set to 'development'
process.env.NODE_ENV = args.production ? 'production' : (process.env.NODE_ENV || 'development');

const packageFile = JSON.parse(fs.readFileSync(config.packageJson, 'utf8'));

// Services like CircleCI set a CI env variable
const isBuildServer = !!(process.env.IS_BUILD_SERVER || process.env.CI);
if (isBuildServer) {
  console.log('Running on a build server, errors will break the build');
}

gulp.task('clean', () => {
  // This runs synchronously and will block other tasks
  del.sync(
    (config.cleanFiles || [path.join(config.outputFolder, '**')]),
  );
});

gulp.task('build-info', () => {
  // Generate the build-info.json
  if (process.env.CIRCLECI) {
    git.branch((branch) => {
      git.long((commit) => {
        fs.writeFileSync('build-info.json', JSON.stringify({
          buildTimestamp: new Date().toISOString(),
          gitBranch: branch,
          gitCommit: commit,
          repository: (process.env.CIRCLE_PROJECT_REPONAME || config.name || packageFile.name)
            .toUpperCase(),
          build: process.env.CIRCLE_BUILD_NUM || -1,
          instigator: process.env.CIRCLE_USERNAME || '',
        }, null, '  '));
      });
    });
  } else {
    fs.writeFileSync('build-info.json', JSON.stringify({
      buildTimestamp: new Date().toISOString(),
      gitBranch: process.env.GIT_BRANCH,
      gitCommit: process.env.GIT_COMMIT,
      repository: (process.env.GIT_REPO || config.name || packageFile.name).toUpperCase(),
      build: process.env.GIT_COMMIT || -1,
      instigator: process.env.USERNAME || process.env.username || '',
    }, null, '  '));
  }
});

gulp.task('lint', () => {
  const opts = yargs
    .option('fix', {
      default: false,
      describe: 'fix lint issues',
      type: 'boolean',
    })
    .help('h')
    .alias('h', 'help')
    .argv;
  const isFixed = file => opts.fix && file.eslint && file.eslint.fixed;

  return gulp.src(config.sourceFiles, { base: './' })
    .pipe(eslint({ fix: opts.fix }))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest('./')))
    // Cause errors to break the pipeline only if running from build server
    .pipe(isBuildServer ? eslint.failAfterError() : gutil.noop());
});

// COMMANDS
gulp.task('help', () => {
  console.log(config.help);
});

module.exports.config = config;
module.exports.tasks = gulp.tasks;
