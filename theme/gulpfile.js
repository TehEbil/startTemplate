'use strict';

// sass compile
var gulp = require('gulp');
var sass = require('gulp-sass');
var ngAnnotate = require('gulp-ng-annotate');
var prettify = require('gulp-prettify');
var babel = require('gulp-babel');
var removeUseStrict = require("gulp-remove-use-strict");
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var rtlcss = require("gulp-rtlcss");  
var connect = require('gulp-connect');

//*** Localhost server tast
gulp.task('localhost', function() {
  connect.server();
});

gulp.task('localhost-live', function() {
  connect.server({
    livereload: true
  });
});

//*** SASS compiler task
gulp.task('sass', function () {
  // bootstrap compilation
	gulp.src('./sass/bootstrap.scss').pipe(sass()).pipe(gulp.dest('./assets/global/plugins/bootstrap/css/'));

  // select2 compilation using bootstrap variables
	gulp.src('./assets/global/plugins/select2/sass/select2-bootstrap.min.scss').pipe(sass({outputStyle: 'compressed'})).pipe(gulp.dest('./assets/global/plugins/select2/css/'));

  // global theme stylesheet compilation
	gulp.src('./sass/global/*.scss').pipe(sass()).pipe(gulp.dest('./assets/global/css'));
	gulp.src('./sass/apps/*.scss').pipe(sass()).pipe(gulp.dest('./assets/apps/css'));
	gulp.src('./sass/pages/*.scss').pipe(sass()).pipe(gulp.dest('./assets/pages/css'));

  // theme layouts compilation
	gulp.src('./sass/layouts/layout/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css'));
  gulp.src('./sass/layouts/layout/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css/themes'));

  gulp.src('./sass/layouts/layout2/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout2/css'));
  gulp.src('./sass/layouts/layout2/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout2/css/themes'));

  gulp.src('./sass/layouts/layout3/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout3/css'));
  gulp.src('./sass/layouts/layout3/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout3/css/themes'));

  gulp.src('./sass/layouts/layout4/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout4/css'));
  gulp.src('./sass/layouts/layout4/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout4/css/themes'));

  gulp.src('./sass/layouts/layout5/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout5/css'));

  gulp.src('./sass/layouts/layout6/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout6/css'));

  gulp.src('./sass/layouts/layout7/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout7/css'));
});

//*** SASS watch(realtime) compiler task
gulp.task('sass:watch', function () {
	gulp.watch('./sass/**/*.scss', ['sass']);
});

//*** CSS & JS minify task
gulp.task('minify', function () {
    gulp.src(['./admin_1_angularjs/js2/**/*.js','!./admin_1_angularjs/js/**/*.min.js'])
		.pipe(babel({
            "presets": ['es2015', 'stage-0', 'env'],
			       "plugins": [["angularjs-annotate", { "explicitOnly" : true}]]
        }))
		.pipe(removeUseStrict())
    //.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('./admin_1_angularjs/js'));
		// .pipe(rename({suffix: '.min'}))
		
	
	//gulp.src(['./plugins/**/*.js','!./plugins/**/*.min.js'])
	//	.pipe(babel({
    //       presets: ['es2015', 'stage-0', 'env']
    //  }))
	//	.pipe(removeUseStrict())
    //  .pipe(ngAnnotate())
	//	.pipe(uglify())
	//	.pipe(gulp.dest('./plugins'));
		
		// .pipe(rename({suffix: '.min'}))
		
		/*.pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(ngAnnotate())
        .pipe(diff())
        .pipe(diff.reporter({fail: true}))
        .pipe(gulp.dest('public/dist'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist'))
        .pipe(notify({message: 'Scripts task complete'}));*/
});

//*** RTL convertor task
gulp.task('rtlcss', function () {

  gulp
    .src(['./assets/apps/css/*.css', '!./assets/apps/css/*-rtl.min.css', '!./assets/apps/css/*-rtl.css', '!./assets/apps/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/apps/css'));

  gulp
    .src(['./assets/pages/css/*.css', '!./assets/pages/css/*-rtl.min.css', '!./assets/pages/css/*-rtl.css', '!./assets/pages/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/pages/css'));

  gulp
    .src(['./assets/global/css/*.css', '!./assets/global/css/*-rtl.min.css', '!./assets/global/css/*-rtl.css', '!./assets/global/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/global/css'));

  gulp
    .src(['./assets/layouts/**/css/*.css', '!./assets/layouts/**/css/*-rtl.css', '!./assets/layouts/**/css/*-rtl.min.css', '!./assets/layouts/**/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/layouts'));

  gulp
    .src(['./assets/layouts/**/css/**/*.css', '!./assets/layouts/**/css/**/*-rtl.css', '!./assets/layouts/**/css/**/*-rtl.min.css', '!./assets/layouts/**/css/**/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/layouts'));

  gulp
    .src(['./assets/global/plugins/bootstrap/css/*.css', '!./assets/global/plugins/bootstrap/css/*-rtl.css', '!./assets/global/plugins/bootstrap/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/global/plugins/bootstrap/css')); 
});

//*** HTML formatter task
gulp.task('prettify', function() {
  	
  	gulp.src('./**/*.html').
  	  	pipe(prettify({
    		indent_size: 4, 
    		indent_inner_html: true,
    		unformatted: ['pre', 'code']
   		})).
   		pipe(gulp.dest('./'));
});