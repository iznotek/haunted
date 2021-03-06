const { src, dest, task, watch, series, parallel } = require('gulp');
const del = require('del'); //For Cleaning build/dist for fresh export
const options = require("./config"); //paths and other options from config.js
const browserSync = require('browser-sync').create();

const sass = require('gulp-sass')(require('sass')); //For Compiling SASS files
const postcss = require('gulp-postcss'); //For Compiling tailwind utilities with tailwind config
const concat = require('gulp-concat'); //For Concatinating js,css files
const uglify = require('gulp-terser');//To Minify JS files
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin'); //To Optimize Images
const cleanCSS = require('gulp-clean-css');//To Minify CSS files
const purgecss = require('gulp-purgecss');// Remove Unused CSS from Styles

const babel = require('gulp-babel');

//Note : Webp still not supported in major browsers including forefox
//const webp = require('gulp-webp'); //For converting images to WebP format
//const replace = require('gulp-replace'); //For Replacing img formats to webp in html
const logSymbols = require('log-symbols'); //For Symbolic Console logs :) :P

const npm_src = options.paths.src.npm;
const asset_dist = options.paths.dist.js;

//Load Previews on Browser on dev
function livePreview(done){
	browserSync.init({
		proxy: 'http://localhost:2368',
		port: 8080,
	});
	done();
}

// Triggers Browser reload
function previewReload(done){
	console.log("\n\t" + logSymbols.info,"Reloading Browser Preview.\n");
	browserSync.reload();
	done();
}

//Development Tasks
function devHTML(){
	return src(`${options.paths.src.base}/**/*.hbs`).pipe(dest(options.paths.dist.base));
}

function devStyles(){
	const tailwindcss = require('tailwindcss');
	return src(`${options.paths.src.css}/**/*.scss`).pipe(sass().on('error', sass.logError))
	.pipe(dest(options.paths.src.css))
	.pipe(postcss([
		tailwindcss(options.config.tailwindjs),
		require('autoprefixer'),
	]))
	.pipe(purgecss({
		content: ['**/*.hbs']
  	}))
	.pipe(concat({ path: 'style.css'}))
	.pipe(dest(options.paths.dist.css));
}

function devScripts(){
//	return src([
//		`${options.paths.src.js}/libs/**/*.js`
//	]).pipe(concat({ path: 'scripts.js' }))
//    .pipe(dest(options.paths.dist.js));
  return src([
    `${npm_src}/@waaark/luge/dist/js/luge.js`,
    `${npm_src}/fslightbox/index.js`,
    `${npm_src}/swiper/swiper-bundle.js`
  ])
  .pipe(babel({
    'presets': [
      [
        '@babel/preset-env', {
          'modules': false
        }
      ]
    ]
  }))
  .pipe(concat('lib.js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(dest(asset_dist, { sourcemaps: '.' }));
}

function devModules(){
	return src([
		`${options.paths.src.js}/app.js`
  ])
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(dest(asset_dist, { sourcemaps: '.' }));
}

function devImages(){
	return src(`${options.paths.src.img}/**/*`).pipe(dest(options.paths.dist.img));
}

function devFonts(){
	return src(`${options.paths.src.fonts}/**/*`).pipe(dest(options.paths.dist.fonts));
}

function watchFiles(){
	watch(`${options.paths.src.base}/**/*.hbs`,series(devHTML, devStyles, previewReload));
	watch([options.config.tailwindjs, `${options.paths.src.css}/**/*.scss`],series(devStyles, previewReload));
	watch(`${options.paths.src.js}/**/*.js`,series(devScripts, previewReload));
	watch(`${options.paths.src.img}/**/*`,series(devImages, previewReload));
	console.log("\n\t" + logSymbols.info,"Watching for Changes..\n");
}

function devClean(){
	console.log("\n\t" + logSymbols.info,"Cleaning dist folder for fresh start.\n");
	return del([options.paths.dist.base]);
}

//Production Tasks (Optimized Build for Live/Production Sites)
function prodHTML(){
	return src(`${options.paths.src.base}/**/*.hbs`).pipe(dest(options.paths.build.base));
}

function prodStyles(){
	return src(`${options.paths.dist.css}/**/*`)
	.pipe(purgecss({
		content: ['**/*.{hbs,js}'],
		defaultExtractor: content => {
			const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
			const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
			return broadMatches.concat(innerMatches)
		}
	}))
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(dest(options.paths.build.css));
}

function prodScripts(){
  return src([
    `${npm_src}/@waaark/luge/dist/js/luge.js`,
    `${npm_src}/fslightbox/index.js`,
    `${npm_src}/swiper/swiper-bundle.js`
  ])
  .pipe(babel({
    'presets': [
      [
        '@babel/preset-env', {
          'modules': false
        }
      ]
    ]
  }))
  .pipe(concat('lib.js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(dest(asset_dist, { sourcemaps: '.' }));
}

function prodModules(){
	return src([
		`${options.paths.src.js}/app.js`
	])
	.pipe(concat({ path: 'app.js'}))
	.pipe(uglify())
	.pipe(dest(options.paths.build.js));
}

function prodImages(){
	return src(options.paths.src.img + '/**/*').pipe(imagemin()).pipe(dest(options.paths.build.img));
}

function prodFonts(){
	return src(`${options.paths.src.fonts}/**/*`).pipe(dest(options.paths.dist.fonts));
}

function prodClean(){
	console.log("\n\t" + logSymbols.info,"Cleaning build folder for fresh start.\n");
	return del([options.paths.build.base]);
}

function buildFinish(done){
	console.log("\n\t" + logSymbols.info,`Production build is complete. Files are located at ${options.paths.build.base}\n`);
	done();
}

exports.default = series(
	devClean, // Clean Dist Folder
	parallel(devStyles, devScripts, devModules, devImages, devFonts), //Run All tasks in parallel
	livePreview, // Live Preview Build
	watchFiles // Watch for Live Changes
	);

exports.prod = series(
  prodClean, // Clean Build Folder
  parallel(prodStyles, prodScripts, prodModules, prodImages, prodFonts), //Run All tasks in parallel
  buildFinish
);
