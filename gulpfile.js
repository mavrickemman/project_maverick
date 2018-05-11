var gulp = require('gulp');
var $ 	 = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var sassPaths = [
	'node_modules/bootstrap/scss',
	'node_modules/font-awesome/scss'
];

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