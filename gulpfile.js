/* globals require */
var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');

gulp.task('build', function() {
  gulp.src([
    'vendors/js/jsu.js',
    'vendors/js/odm/odm.js',
    'vendors/js/jquery.min.js',
    'js/ubi-web-lib-base.js'
  ])
  .pipe(concat('ubi-web-lib.js'))
  .pipe(minify({
    compress: {
      // screw_ie8: true,
      hoist_vars: true
    }
  }))
  .pipe(gulp.dest('./dist'));
  return gulp.src([
    'vendors/css/normalize.css',
    'vendors/css/animate.min.css',
    'vendors/js/odm/odm.css',
    'css/animation.css',
    'css/base.css',
    'css/input.css',
    'css/structure.css',
    'css/table.css',
    'css/responsive.css',
    'css/tools.css',
    'css/colors.css'
  ])
  .pipe(concat('ubi-web-lib.min.css'))
  .pipe(cleanCSS({ compatibility: 'ie8' }))
  .pipe(gulp.dest('./dist'));
});