var gulp = require('gulp');
var $ 	 = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var sassPaths = [
	'node_modules/bootstrap/scss',
	'node_modules/font-awesome/scss'
];

gulp.task('scripts', function () {
	gulp.src([
		'bower_components/jquery/dist/jquery.js',
		'bower_components/velocity/velocity.min.js',
		'bower_components/velocity/velocity.ui.js',
		'bower_components/blast-text/jquery.blast.min.js',
	])
	.pipe(concat('libs.js'))
	.pipe(uglify())
	.pipe(gulp.dest('docs/js'))
});

gulp.task('sass', function () {
	return gulp.src('docs/scss/styles.scss')
	.pipe($.sass({
		includePaths: sassPaths,
		outputStyle: 'compressed'
	}).on('error', $.sass.logError))
	.pipe(gulp.dest('docs/css'))
	.pipe(reload({ stream: true }));

	gulp.watch(['docs/scss/**/*.scss'], ['sass']);
	
});

gulp.task('serve', function () {
	browserSync({
		server: {
			baseDir: ['./', 'docs'],
		}
	});

	gulp.watch(['docs/scss/**/*.scss'], ['sass']);
	gulp.watch(['docs/*.html']).on('change', browserSync.reload);
	
});

gulp.task('default', ['sass'], function() {
	gulp.watch(['docs/*.html'], ['docs/scss/**/*.scss'], ['sass']);
});