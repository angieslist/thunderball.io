const gulp = require('gulp');

gulp.task('generator-update', () => {
  gulp.src([
    'packages/thunderball-hello-world/**',
    '!**/build{,/**}',
    '!**/lib{,/**}',
    '!**/node_modules{,/**}',
    '!**/.yo-rc.json',
    '!**/.npmrc',
    '!**/build-info.json',
    '!**/bundle-stats.json',
    '!**/webpack-assets.html',
    '!**/webpack-assets.json',
    '!**/package-lock.json',
  ], {
    dot: true,
  }).pipe(gulp.dest('packages/generator-thunderball/app/templates'));
});
