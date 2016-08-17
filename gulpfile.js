/* globals require */
var gulp = require("gulp");
var concat = require("gulp-concat");
var minify = require("gulp-minify");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");

gulp.task("build", function() {
  gulp.src([
    "vendors/js/jquery-latest.min.js",
    "vendors/js/utils.js",
    "js/ubi-web-lib-base.js"
  ])
  .pipe(concat("ubi-web-lib.js"))
  .pipe(minify({
    compress: {
      hoist_vars: true
    }
  }))
  .pipe(gulp.dest("./dist/js"));
  return gulp.src([
    "vendors/css/animate.min.css",
    "vendors/css/normalize.css",
    "css/animation.css",
    "css/base.css",
    "css/input.css",
    "css/structure.css",
    "css/table.css",
    "css/colors.css",
    "css/responsive.css"
  ])
  .pipe(concat("ubi-web-lib.min.css"))
  .pipe(cleanCSS({ compatibility: "ie8" }))
  .pipe(gulp.dest("./dist/css"));
});