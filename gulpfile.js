// Initialize modules
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { src, dest, watch, series, parallel } = require('gulp');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// File Paths
const files = {
	bootstrapScssPath: 'node_modules/bootstrap/scss',
	scssPath: 'docs/scss/**/*.scss',
	jqueryPath: 'node_modules/jquery/dist/jquery.min.js',
	bootstrapJsPath: 'node_modules/bootstrap/dist/js/bootstrap.min.js',
	popperJsPath:'node_modules/popper.js/dist/umd/popper.min.js',
	pluginJsPath: 'docs/js/plugins.js',
	jsPath: 'docs/js/app.js',
	htmlPath: './docs/*.html'
};

// Sass Compilation Task
function scssTask() {
	return src(files.scssPath)
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: files.bootstrapScssPath,
			outputStyle: 'compressed'
		}))
		.pipe(postcss([ autoprefixer(), cssnano() ]))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('docs/css'))
		.pipe(browserSync.stream());
}

// JS Compilation Task
function jsTask() {
	return src([files.jqueryPath, files.pluginJsPath, files.jsPath])
		.pipe(concat('main.js'))
		// .pipe(uglify())
		.pipe(dest('docs/js'))
		.pipe(browserSync.stream());
}

// Cachebusting Task
const cbString = new Date().getTime();
function cacheBustTask() {
	return src(['docs/*.html'])
		.pipe(replace(/cb=\d+/g, 'cb=' + cbString))
		.pipe(dest('docs/.'));
}

// Watch Task
function watchTask() {
	browserSync.init({
		server: {
			baseDir: './docs'
		}
	});

	watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask));
	watch(files.htmlPath).on('change', browserSync.reload);

}

exports.scssTask = scssTask;

exports.jsTask = jsTask;

exports.watchTask = watchTask;

// Default Task
exports.default = series(
	parallel(scssTask, jsTask),
	cacheBustTask,
	watchTask
);
