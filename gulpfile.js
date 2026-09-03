// Initialize modules
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { src, dest, watch, series, parallel } = require('gulp');
const concat = require('gulp-concat');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass')(require('sass'));

// File Paths
const files = {
	bootstrapScssPath: 'node_modules/bootstrap/scss',
	scssPath: 'docs/scss/**/*.scss',
	jqueryPath: 'node_modules/jquery/dist/jquery.min.js',
	pluginJsPath: 'docs/js/plugins.js',
	jsPath: 'docs/js/app.js',
	htmlPath: './docs/*.html'
};

// Sass Compilation Task
function scssTask() {
	return src(files.scssPath)
		.pipe(sass({
			loadPaths: [files.bootstrapScssPath],
			outputStyle: 'compressed',
			quietDeps: true
		}))
		.pipe(postcss([
			autoprefixer(),
			cssnano({ preset: ['default', { svgo: false }] })
		]))
		.pipe(dest('docs/css'));
}

// JS Compilation Task
function jsTask() {
	return src([files.jqueryPath, files.pluginJsPath, files.jsPath])
		.pipe(concat('main.js'))
		.pipe(dest('docs/js'));
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
	watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask));
}

function serverTask(done) {
	const root = path.resolve('docs');
	const contentTypes = {
		'.css': 'text/css; charset=UTF-8',
		'.html': 'text/html; charset=UTF-8',
		'.ico': 'image/x-icon',
		'.js': 'text/javascript; charset=UTF-8',
		'.jpg': 'image/jpeg',
		'.jpeg': 'image/jpeg',
		'.png': 'image/png',
		'.svg': 'image/svg+xml',
		'.woff': 'font/woff',
		'.woff2': 'font/woff2'
	};
	const port = Number(process.env.PORT) || 3000;
	const server = http.createServer((request, response) => {
		const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
		const requestedPath = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);

		if (requestedPath !== root && !requestedPath.startsWith(`${root}${path.sep}`)) {
			response.writeHead(403).end('Forbidden');
			return;
		}

		fs.readFile(requestedPath, (error, contents) => {
			if (error) {
				response.writeHead(error.code === 'ENOENT' ? 404 : 500).end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
				return;
			}

			response.writeHead(200, { 'Content-Type': contentTypes[path.extname(requestedPath)] || 'application/octet-stream' });
			response.end(contents);
		});
	});

	server.on('error', done);
	server.listen(port, '127.0.0.1', () => console.log(`Local server: http://localhost:${port}`));
}

exports.scssTask = scssTask;

exports.jsTask = jsTask;

exports.watchTask = watchTask;
exports.serverTask = serverTask;

exports.build = series(
	parallel(scssTask, jsTask),
	cacheBustTask
);

// Default Task
exports.default = series(
	parallel(scssTask, jsTask),
	cacheBustTask,
	parallel(watchTask, serverTask)
);
