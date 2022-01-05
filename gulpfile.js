/* globals require */
const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');

gulp.task('build', function () {
    gulp.src([
        'vendors/js/jsu.min.js',
        'vendors/js/odm/odm.min.js',
        'vendors/js/jquery.min.js',
        'js/ubi-web-lib-base.js'
    ])
        .pipe(concat('ubi-web-lib.js'))
        .pipe(minify({
            compress: {'hoist_vars': true}
        }))
        .pipe(gulp.dest('./dist'));

    return gulp.src([
        'vendors/css/normalize.css',
        'vendors/css/animate.min.css',
        'vendors/js/odm/odm.min.css',
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
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist'));
});
