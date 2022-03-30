const {series, watch, src, dest, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pump = require('pump');

// gulp plugins and utils
// var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var tailwindcss = require('tailwindcss');
var zip = require('gulp-zip');
var uglify = require('gulp-uglify');
var beeper = require('beeper');
var browsersync = require('browser-sync');


// postcss plugins
var easyimport = require('postcss-easy-import');
var colorFunction = require('postcss-color-mod-function');
var autoprefixer = require('autoprefixer');
// var cssnano = require('cssnano');
// var purgecss = require('gulp-purgecss');


// Start a http server with browsersync
async function serve(done) {
	browsersync.init(
		{
			proxy: 'http://localhost:2368',
			port: 8080,
		},
		done());
}

// Reload the browser with browsersync
async function liveReload(done) {
	browsersync.reload(),
		handleError(done);
}

const handleError = (done) => {
	return function (err) {
		if (err) {
			beeper();
		}
		return done(err);
	};
};

async function hbs(done) {
	pump([
		src(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs']),
		// livereload()
		browsersync.stream()
	], handleError(done));
}

async function css(done) {
	var processors = [
		tailwindcss(),
		easyimport(),
		colorFunction(),
		autoprefixer()
	];

	pump([
		src('assets/css/tail.css'),
		postcss(processors),
		dest('assets/built/css'),
		browsersync.stream()
	], handleError(done));
}

async function js(done) {
	pump([
		src('assets/js/*.js', {sourcemaps: true}),
		uglify(),
		dest('assets/built/js', {sourcemaps: '.'}),
		browsersync.stream()
	], handleError(done));
}

async function zipper(done) {
	var targetDir = 'dist/';
	var themeName = require('./package.json').name;
	var filename = themeName + '.zip';

	pump([
		src([
			'**',
			'!node_modules', '!node_modules/**',
			'!dist', '!dist/**'
		]),
		zip(filename),
		dest(targetDir)
	], handleError(done));
}

const cssWatcher = () => watch([
	'assets/css/**/*.css',
	'assets/scss/**/*.scss'],
	css, liveReload
);
const hbsWatcher = () => watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs, liveReload);
const watcher = parallel(cssWatcher, hbsWatcher);
const build = series(css, js);
const dev = series(build, serve, watcher);

exports.build = build;
exports.zip = series(build, zipper);
exports.default = dev;
