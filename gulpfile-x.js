const gulp = require('gulp');
const { series, parallel } = require("gulp");
var sass = require('gulp-sass')(require('sass'));
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var postcss = require('gulp-postcss');
var tailwindcss = require('tailwindcss');
var uglify = require('gulp-uglify');
var colorFunction = require('postcss-color-mod-function');
var cssnano = require('cssnano');
var easyimport = require('postcss-easy-import');

const reload = browserSync.reload();

async function serve() {
	return gulp
	.pipe(browserSync.init(
		{
			proxy: 'http://localhost:2368',
			port: 8080,
		},
		done())
	);
}

async function hbs() {
	gulp.src(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'])
		 .pipe(browserSync.stream());
}

async function sass() {
   return gulp
   .src('assets/scss/**/*.scss')
   .pipe(sass({outputStyle: 'compressed'})
      .on('error', sass.logError)
   )
   .pipe(autoprefixer())
   .pipe(gulp.dest('assets/css/'))
   .pipe(browserSync.stream());

};

async function css() {
	var processors = [
		tailwindcss(),
		easyimport(),
		colorFunction(),
		autoprefixer(),
		cssnano()
	]
	return gulp
		.src('assets/css/tail.css')
		.pipe(postcss(processors))
		.pipe(gulp.dest('assets/built/css'))
		.pipe(browserSync.stream());
}

async function js() {
	return gulp
		.src('assets/js/*.js', { sourcemaps: true })
		.pipe(uglify())
		.pipe(gulp.dest('assets/built/js', { sourcemaps: '.' }))
		.pipe(browsersync.stream());
}

async function cssWatcher() {
	return watch([
		'assets/css/**/*.css',
		'assets/scss/**/*.scss'
	],
		sass, css, reload
	);
}

const hbsWatcher = () => {
	return watch([
		'*.hbs',
		'**/**/*.hbs',
		'!node_modules/**/*.hbs'
	],
		hbs, reload);
};
const watch = parallel(cssWatcher, hbsWatcher);
const build = series(sass, css, js);
const dev = series(build, serve, watch);

exports.build = build;
exports.watch = watch;
exports.serve = serve;
exports.dev = dev;
exports.default = build;


async function css(done) {
	var processors = [
		tailwindcss(),
		easyimport(),
		colorFunction(),
		autoprefixer(),
		cssnano()
	];

	pump([
		src(['assets/scss/main.scss', 'assets/css/tail.css'], { sourcemaps: true }),
		sass().on('error', sass.logError),
		postcss(processors),
		dest('assets/built/css', {sourcemaps: '.'}),
		browsersync.stream()
	], handleError(done));
}
