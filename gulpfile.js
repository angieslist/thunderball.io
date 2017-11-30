const gulp = require('gulp');

gulp.task('generator-update', () => {
  gulp.src([
    'packages/thunderball-hello-world/**',
    '!**/node_modules{,/**}',
    '!**/lib{,/**}',
    '!**/build{,/**}',
    '!**/.npmrc',
    '!**/package-lock.json',
    '!**/.yo-rc.json',
  ], {
    dot: true,
  }).pipe(gulp.dest('packages/generator-thunderball/app/templates'));
});
